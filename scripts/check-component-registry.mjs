import fs from "node:fs/promises";
import path from "node:path";
import ts from "typescript";

import { COMPILER_OPTIONS, ENTRY, MATURITY_SOURCE, OUTPUT, collectExports } from "./generate-component-registry.mjs";
import { resolveLocalImport } from "./registry-graph.mjs";

const root = process.cwd();
const TIERS = ["stable", "beta", "experimental", "internal", "deprecated"];

/** The documented source-copy entrypoints. Removing one is a breaking change. */
const AUTHORED_BUNDLES = ["modeless-theme", "modeless-components", "modeless-visualizations", "modeless-agentic-commerce"];

const failures = [];
const warnings = [];

const registry = await fs
  .readFile(path.join(root, OUTPUT), "utf8")
  .then(JSON.parse)
  .catch((error) => {
    failures.push(`Cannot read ${OUTPUT}: ${error.message}. Run "npm run build" first.`);
    return null;
  });

/**
 * An item is only useful if copying its files gives you something that
 * compiles, so every local import reachable from an item's files must also be
 * listed in that item.
 */
async function checkSelfContained(item, byName) {
  // Files reachable through registryDependencies are installed alongside this
  // item, so they count as available.
  const listed = new Set();
  const queue = [item];
  const visited = new Set();
  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || visited.has(current.name)) continue;
    visited.add(current.name);
    for (const file of current.files ?? []) listed.add(file.path);
    for (const dependency of current.registryDependencies ?? []) queue.push(byName.get(dependency));
  }

  const own = new Set(item.files?.map((file) => file.path) ?? []);
  const missing = new Set();

  for (const file of own) {
    let source;
    try {
      source = await fs.readFile(path.join(root, file), "utf8");
    } catch {
      continue; // reported separately
    }
    if (!/\.tsx?$/.test(file)) continue;

    for (const [, specifier] of source.matchAll(/(?:^|\n)\s*(?:import|export)[\s\S]*?from\s+"(\.[^"]+)"/g)) {
      const resolved = resolveLocalImport(file, specifier);
      if (resolved && !listed.has(resolved)) missing.add(`${file} imports ${resolved}`);
    }
  }

  return [...missing];
}

if (registry) {
  const packageJson = JSON.parse(await fs.readFile(path.join(root, "package.json"), "utf8"));
  const maturity = JSON.parse(await fs.readFile(path.join(root, MATURITY_SOURCE), "utf8"));

  const byName = new Map(registry.items.map((item) => [item.name, item]));
  const generated = registry.items.filter((item) => item.meta?.generated);
  const authored = registry.items.filter((item) => !item.meta?.generated);

  for (const name of AUTHORED_BUNDLES) {
    if (!authored.some((item) => item.name === name)) {
      failures.push(`Authored bundle "${name}" is missing from ${OUTPUT}. Removing it breaks the documented source-copy path.`);
    }
  }

  const program = ts.createProgram([path.resolve(root, ENTRY)], COMPILER_OPTIONS);
  const exported = new Set(collectExports(program).map((entry) => entry.name));
  const recorded = new Set(generated.map((item) => item.meta.export));

  for (const name of exported) {
    if (!recorded.has(name)) failures.push(`Exported component "${name}" has no registry item.`);
  }
  for (const name of recorded) {
    if (!exported.has(name)) failures.push(`Registry item for "${name}" is no longer exported from ${ENTRY}.`);
  }

  for (const item of generated) {
    const label = item.meta.export ?? item.name;

    if (!item.name || !item.type || !item.files?.length) failures.push(`${label}: incomplete registry item.`);
    if (!item.categories?.length || item.categories[0] === "uncategorized") {
      failures.push(`${label}: missing or uncategorized category.`);
    }

    const tier = item.meta.maturityTier;
    if (!tier) failures.push(`${label}: no maturityTier. Add an entry to ${MATURITY_SOURCE}.`);
    else if (!TIERS.includes(tier)) failures.push(`${label}: maturityTier "${tier}" is not one of ${TIERS.join(", ")}.`);
    if (tier === "internal") failures.push(`${label}: internal components must not appear in the registry.`);

    if (item.meta.maturitySource?.startsWith("inferred:") && tier === "stable") {
      failures.push(`${label}: tier "stable" was inferred, not documented. Only a documented tier may be stable.`);
    }

    if (!Array.isArray(item.meta.props?.own)) failures.push(`${label}: props were not introspected.`);

    const { provenance } = item.meta;
    if (!provenance?.packageVersion || !provenance?.sourceFile || !provenance?.sourceUrl) {
      failures.push(`${label}: incomplete provenance.`);
    } else if (provenance.packageVersion !== packageJson.version) {
      failures.push(`${label}: provenance version "${provenance.packageVersion}" does not match package.json. Regenerate.`);
    }

    const unknown = item.meta.tokenBindings?.unknownCssVariables ?? [];
    if (unknown.length) failures.push(`${label}: references CSS variables not declared in the theme: ${unknown.join(", ")}.`);
  }

  // Every file referenced by any item must exist, and every item must be
  // self-contained enough to copy.
  for (const item of registry.items) {
    for (const file of item.files ?? []) {
      try {
        await fs.access(path.join(root, file.path));
      } catch {
        failures.push(`${item.name}: file "${file.path}" does not exist.`);
      }
    }

    const missing = await checkSelfContained(item, byName);
    if (missing.length === 0) continue;

    if (item.meta?.generated) {
      failures.push(`${item.name}: not self-contained — ${missing.join("; ")}.`);
    } else {
      warnings.push(`${item.name} (hand-authored bundle): not self-contained — ${missing.join("; ")}.`);
    }
  }

  for (const [name, assignment] of Object.entries(maturity.components ?? {})) {
    const isExported = exported.has(name);
    if (assignment.tier === "internal" && isExported) {
      failures.push(`${MATURITY_SOURCE} marks "${name}" internal, but it is still exported from ${ENTRY}.`);
    }
    if (assignment.tier !== "internal" && !isExported) {
      failures.push(`${MATURITY_SOURCE} assigns tier "${assignment.tier}" to "${name}", which is not exported.`);
    }
  }

  const undocumented = generated.filter((item) => !item.meta.documentedIn?.length);
  if (undocumented.length) {
    warnings.push(
      `${undocumented.length} of ${generated.length} components have no per-component documentation section, so their compositionRules/doDont are structural only.`,
    );
  }

  const needsReview = generated.filter((item) => item.meta.maturitySource?.startsWith("inferred:"));
  if (needsReview.length) {
    warnings.push(`${needsReview.length} components carry an inferred tier pending human review: ${needsReview.map((item) => item.meta.export).join(", ")}.`);
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

console.log(
  `Component registry check passed: ${registry.items.filter((item) => !item.meta?.generated).length} authored bundles + ${registry.items.filter((item) => item.meta?.generated).length} component items.`,
);
