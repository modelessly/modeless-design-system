import fs from "node:fs/promises";
import path from "node:path";
import ts from "typescript";

import { COMPILER_OPTIONS, ENTRY, MATURITY_SOURCE, OUTPUT, collectExports } from "./generate-component-registry.mjs";

const root = process.cwd();
const TIERS = ["stable", "beta", "experimental", "internal", "deprecated"];

const failures = [];
const warnings = [];

const registry = await fs
  .readFile(path.join(root, OUTPUT), "utf8")
  .then(JSON.parse)
  .catch((error) => {
    failures.push(`Cannot read ${OUTPUT}: ${error.message}. Run "npm run build" first.`);
    return null;
  });

if (registry) {
  const packageJson = JSON.parse(await fs.readFile(path.join(root, "package.json"), "utf8"));
  const maturity = JSON.parse(await fs.readFile(path.join(root, MATURITY_SOURCE), "utf8"));

  // Every component currently exported must have a record, and every record must
  // still correspond to a live export. Both directions matter: the first catches
  // a new component shipping without metadata, the second catches a stale record
  // outliving the component it described.
  const program = ts.createProgram([path.resolve(root, ENTRY)], COMPILER_OPTIONS);
  const exported = new Set(collectExports(program).map((entry) => entry.name));
  const recorded = new Set(registry.components.map((component) => component.name));

  for (const name of exported) {
    if (!recorded.has(name)) failures.push(`Exported component "${name}" has no registry record.`);
  }
  for (const name of recorded) {
    if (!exported.has(name)) failures.push(`Registry record "${name}" is no longer exported from ${ENTRY}.`);
  }

  if (registry.packageVersion !== packageJson.version) {
    failures.push(
      `Registry packageVersion "${registry.packageVersion}" does not match package.json "${packageJson.version}". Regenerate it.`,
    );
  }

  for (const component of registry.components) {
    const label = component.name ?? "(unnamed record)";

    if (!component.name) failures.push("A registry record has no name.");
    if (!component.category) failures.push(`${label}: missing category.`);
    if (component.category === "uncategorized") {
      failures.push(`${label}: category is "uncategorized" — add its path prefix to CATEGORIES in the generator.`);
    }

    if (!component.maturityTier) {
      failures.push(`${label}: no maturityTier. Add an entry to ${MATURITY_SOURCE}.`);
    } else if (!TIERS.includes(component.maturityTier)) {
      failures.push(`${label}: maturityTier "${component.maturityTier}" is not one of ${TIERS.join(", ")}.`);
    }

    // Inference must never grant unsupervised agent use. Only a documented tier
    // can put a component in the "stable" trust tier.
    if (component.maturitySource?.startsWith("inferred:") && component.maturityTier === "stable") {
      failures.push(`${label}: tier "stable" was inferred, not documented. Only a documented tier may be stable.`);
    }

    if (!component.props || !Array.isArray(component.props.own)) {
      failures.push(`${label}: props were not introspected.`);
    }

    const { provenance } = component;
    if (!provenance?.packageVersion || !provenance?.sourceFile || !provenance?.sourceUrl) {
      failures.push(`${label}: incomplete provenance.`);
    } else {
      try {
        await fs.access(path.join(root, provenance.sourceFile));
      } catch {
        failures.push(`${label}: provenance.sourceFile "${provenance.sourceFile}" does not exist.`);
      }
      if (!provenance.lastModified) {
        warnings.push(`${label}: no git history for ${provenance.sourceFile} (uncommitted?).`);
      }
    }

    const unknown = component.tokenBindings?.unknownCssVariables ?? [];
    if (unknown.length) {
      failures.push(`${label}: references CSS variables not declared in the theme: ${unknown.join(", ")}.`);
    }

  }

  // The internal tier means "not part of the public package contract", so those
  // components must be absent from the barrel — and every other tier must be
  // present in it. Both directions are enforced, so a component cannot be
  // quietly demoted in the tier file while still shipping, or unexported
  // without the tier being updated to say so.
  for (const [name, assignment] of Object.entries(maturity.components ?? {})) {
    const isExported = exported.has(name);
    if (assignment.tier === "internal" && isExported) {
      failures.push(`${MATURITY_SOURCE} marks "${name}" internal, but it is still exported from ${ENTRY}.`);
    }
    if (assignment.tier !== "internal" && !isExported) {
      failures.push(`${MATURITY_SOURCE} assigns tier "${assignment.tier}" to "${name}", which is not exported.`);
    }
  }

  const undocumented = registry.components.filter((component) => !component.documentedIn?.length);
  if (undocumented.length) {
    warnings.push(
      `${undocumented.length} of ${registry.components.length} components have no per-component documentation section, so their compositionRules/doDont are structural only: ${undocumented
        .map((component) => component.name)
        .join(", ")}.`,
    );
  }

  const needsReview = registry.components.filter((component) => component.maturityNeedsReview);
  if (needsReview.length) {
    warnings.push(
      `${needsReview.length} components carry an inferred tier pending human review (see docs/agentic-upgrade-audit.md D2): ${needsReview
        .map((component) => component.name)
        .join(", ")}.`,
    );
  }
}

if (warnings.length) {
  console.warn("Component registry warnings:");
  for (const warning of warnings) console.warn(`- ${warning}`);
  console.warn("");
}

if (failures.length) {
  console.error("Component registry check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Component registry check passed for ${registry.components.length} records.`);
