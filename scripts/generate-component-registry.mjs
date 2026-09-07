import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { pathToFileURL } from "node:url";
import ts from "typescript";

import { collectFileGraph, registryFileType } from "./registry-graph.mjs";

const run = promisify(execFile);
const root = process.cwd();

export const ENTRY = "dist/index.d.ts";
export const OUTPUT = "registry/registry.json";
export const MATURITY_SOURCE = "registry/component-maturity.json";
const THEME_CSS = "src/styles/modeless-theme.css";
const DOC_DIR = "docs";

export const COMPILER_OPTIONS = {
  target: ts.ScriptTarget.ES2020,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  jsx: ts.JsxEmit.ReactJSX,
  strict: true,
  skipLibCheck: true,
};

/** Source-path prefix to category. First match wins, so order matters. */
const CATEGORIES = [
  ["src/components/modeless/visualizations/", "visualizations"],
  ["src/components/modeless/commerce/", "commerce"],
  ["src/components/modeless/modeless-foundation", "foundation"],
  ["src/components/modeless/product-primitives", "product"],
  ["src/components/modeless/", "core"],
];

/**
 * Enumerate every component exported from the public entrypoint.
 *
 * Components are identified structurally, not by naming convention: an export
 * qualifies when it has a call signature returning a React element type. That
 * keeps helpers such as `hashSeed`, `motionBudget`, and `productStatusMeta` out
 * of the registry without maintaining a denylist. Hooks are recorded separately
 * because they carry maturity but have no props surface.
 */
export function collectExports(program) {
  const checker = program.getTypeChecker();
  const entry = program.getSourceFile(path.resolve(root, ENTRY));
  if (!entry) throw new Error(`Cannot read ${ENTRY}. Run "npm run build" first.`);

  const moduleSymbol = checker.getSymbolAtLocation(entry);
  if (!moduleSymbol) throw new Error(`${ENTRY} did not resolve as a module.`);

  const collected = [];

  for (const symbol of checker.getExportsOfModule(moduleSymbol)) {
    const resolved = symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
    const declaration = resolved.declarations?.[0];
    if (!declaration || !(resolved.flags & ts.SymbolFlags.Value)) continue;

    const type = checker.getTypeOfSymbolAtLocation(resolved, declaration);
    const [signature] = type.getCallSignatures();
    if (!signature) continue;

    const returnType = checker.typeToString(signature.getReturnType());
    if (!/Element|ReactNode|JSX/.test(returnType)) continue;

    const declarationFile = path.relative(root, declaration.getSourceFile().fileName);
    collected.push({
      name: symbol.getName(),
      kind: /^use[A-Z]/.test(symbol.getName()) ? "hook" : "component",
      declarationFile,
      sourceFile: toSourcePath(declarationFile),
      props: describeProps(checker, signature),
    });
  }

  return collected.sort((a, b) => a.name.localeCompare(b.name));
}

/** dist/components/foo.d.ts -> src/components/foo.tsx, or .ts for non-JSX modules. */
function toSourcePath(declarationFile) {
  const base = declarationFile.replace(/^dist\//, "src/").replace(/\.d\.ts$/, "");
  const candidate = `${base}.tsx`;
  return existsSync(path.join(root, candidate)) ? candidate : `${base}.ts`;
}

/**
 * Enumerate the component's props from its first parameter type. Props are read
 * from the compiled declarations rather than re-typed by hand, so they cannot
 * drift from the shipped types.
 *
 * Components that spread `React.HTMLAttributes` inherit ~250 DOM attributes.
 * Those are recorded as a single summary rather than enumerated: they are not
 * part of the design system's own API surface, and listing them would bury the
 * props that are.
 */
function describeProps(checker, signature) {
  const empty = { own: [], inheritsDomProps: false, inheritedPropCount: 0 };

  const [parameter] = signature.getParameters();
  if (!parameter) return empty;

  const declaration = parameter.valueDeclaration ?? parameter.declarations?.[0];
  if (!declaration) return empty;

  const parameterType = checker.getTypeOfSymbolAtLocation(parameter, declaration);
  const all = parameterType.getProperties();

  const isOwn = (property) => {
    const propertyDeclaration = property.valueDeclaration ?? property.declarations?.[0];
    if (!propertyDeclaration) return false;
    return !propertyDeclaration.getSourceFile().fileName.includes("node_modules");
  };

  const own = all
    .filter(isOwn)
    .map((property) => {
      const propertyDeclaration = property.valueDeclaration ?? property.declarations?.[0];
      const propertyType = propertyDeclaration
        ? checker.getTypeOfSymbolAtLocation(property, propertyDeclaration)
        : checker.getDeclaredTypeOfSymbol(property);

      return {
        name: property.getName(),
        type: checker.typeToString(propertyType),
        required: !(property.flags & ts.SymbolFlags.Optional),
        description: ts.displayPartsToString(property.getDocumentationComment(checker)).trim() || null,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const inheritedPropCount = all.length - own.length;

  return { own, inheritsDomProps: inheritedPropCount > 0, inheritedPropCount };
}

function categoryFor(sourceFile) {
  const match = CATEGORIES.find(([prefix]) => sourceFile.startsWith(prefix));
  return match ? match[1] : "uncategorized";
}

/** Every CSS custom property the theme actually declares. */
async function readThemeTokens() {
  const css = await fs.readFile(path.join(root, THEME_CSS), "utf8");
  return new Set([...css.matchAll(/^\s*(--[a-z0-9-]+)\s*:/gim)].map((match) => match[1]));
}

/**
 * Which tokens a component consumes. Components reach tokens three ways: CSS
 * custom properties, the exported token objects, and semantic Tailwind classes
 * that resolve to theme variables. All three are recorded; CSS variables are
 * validated against the theme so a typo surfaces as an unknown binding rather
 * than silently disappearing.
 */
async function readTokenBindings(sourceFile, themeTokens) {
  let source;
  try {
    source = await fs.readFile(path.join(root, sourceFile), "utf8");
  } catch {
    return { cssVariables: [], unknownCssVariables: [], tokenObjects: [], semanticClasses: [] };
  }

  const cssVariables = new Set();
  const unknown = new Set();
  for (const [, name] of source.matchAll(/var\((--[a-z0-9-]+)/gi)) {
    (themeTokens.has(name) ? cssVariables : unknown).add(name);
  }

  const tokenObjects = new Set();
  for (const [, object, member] of source.matchAll(
    /\b(modelessColors|modelessVisualizationColors|semanticColors|modelessTypography|modelessMotion[A-Za-z]*)\.([A-Za-z0-9_]+)/g,
  )) {
    tokenObjects.add(`${object}.${member}`);
  }

  const semanticClasses = new Set();
  const semanticRoles =
    "background|foreground|card|popover|primary|secondary|muted|accent|destructive|border|input|ring|signal|terminal|artifact|grid-line|scanline|noise|warning|success|experimental|archived";
  for (const [, utility] of source.matchAll(
    new RegExp(`\\b((?:bg|text|border|fill|stroke|ring)-(?:${semanticRoles})(?:-foreground)?)\\b`, "g"),
  )) {
    semanticClasses.add(utility);
  }

  return {
    cssVariables: [...cssVariables].sort(),
    unknownCssVariables: [...unknown].sort(),
    tokenObjects: [...tokenObjects].sort(),
    semanticClasses: [...semanticClasses].sort(),
  };
}

/**
 * Index the per-component prose in docs/. Several docs already use a stable
 * shape — a `### ComponentName` heading followed by `Label: value` lines — so
 * the structured fields below are converted from that prose rather than
 * duplicated into a second hand-maintained source.
 */
async function indexDocs() {
  const index = new Map();
  const files = (await fs.readdir(path.join(root, DOC_DIR))).filter((file) => file.endsWith(".md"));

  for (const file of files) {
    const relativePath = path.join(DOC_DIR, file);
    const contents = await fs.readFile(path.join(root, relativePath), "utf8");
    const lines = contents.split("\n");

    let current = null;
    let startLine = 0;
    const flush = (endLine) => {
      if (!current) return;
      const existing = index.get(current.name) ?? [];
      existing.push({ doc: relativePath, line: startLine, body: current.body.join("\n").trim() });
      index.set(current.name, existing);
    };

    lines.forEach((line, position) => {
      const heading = line.match(/^###\s+`?([A-Za-z][A-Za-z0-9]*)`?\s*$/);
      if (heading) {
        flush(position);
        current = { name: heading[1], body: [] };
        startLine = position + 1;
        return;
      }
      if (/^##?\s/.test(line)) {
        flush(position);
        current = null;
        return;
      }
      if (current) current.body.push(line);
    });
    flush(lines.length);
  }

  return index;
}

const LABELS = ["Purpose", "Key props", "Use when", "Avoid when", "Use case", "Why include it", "Accessibility"];

/** Sentence-case a fragment lifted from after a `Label:` prefix. */
const normalize = (fragment) => {
  const trimmed = fragment.trim();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
};

const LABEL = (body, label) => {
  const match = body.match(new RegExp(`^${label}:\\s*(.+)$`, "im"));
  return match ? normalize(match[1]) : null;
};

/**
 * Convert prose guidance into discrete, checkable rules. Each rule keeps a
 * citation so a reviewer can trace it back to the sentence it came from.
 */
function buildGuidance(sections) {
  const doDont = [];
  const compositionRules = [];

  for (const section of sections) {
    const cite = { doc: section.doc, line: section.line };

    const useWhen = LABEL(section.body, "Use when") ?? LABEL(section.body, "Use case");
    if (useWhen) doDont.push({ rule: "do", statement: useWhen, source: cite });

    const avoidWhen = LABEL(section.body, "Avoid when");
    if (avoidWhen) doDont.push({ rule: "dont", statement: avoidWhen, source: cite });

    const purpose = LABEL(section.body, "Purpose") ?? LABEL(section.body, "Why include it");
    if (purpose) compositionRules.push({ constraint: "purpose", statement: purpose, source: cite });

    const accessibility = LABEL(section.body, "Accessibility");
    if (accessibility) compositionRules.push({ constraint: "accessibility", statement: accessibility, source: cite });

    // Imperative prohibitions in unlabelled prose ("Do not ...", "Never ...", "Avoid ...").
    // Labelled lines are skipped: they are already captured above, and the sweep
    // would otherwise re-capture "Avoid when: ..." as a second, redundant rule.
    const prose = section.body
      .split("\n")
      .filter((line) => !new RegExp(`^(?:${LABELS.join("|")}):`, "i").test(line.trim()))
      .join("\n");

    for (const [, sentence] of prose.matchAll(/(?:^|\s)((?:Do not|Never|Avoid)\s[^.\n]+\.)/g)) {
      const statement = sentence.trim();
      if (doDont.some((entry) => entry.statement === statement)) continue;
      doDont.push({ rule: "dont", statement, source: cite });
    }
  }

  return { doDont, compositionRules };
}

/** Slot props and motion support are structural composition facts, read from the types. */
function structuralRules(props) {
  const rules = [];
  const slots = props.own.filter((prop) => /ReactNode|ReactElement/.test(prop.type)).map((prop) => prop.name);
  if (slots.length) {
    rules.push({ constraint: "slots", statement: `Accepts composed content through: ${slots.join(", ")}.`, source: null });
  }

  const motion = props.own.find((prop) => prop.name === "motion");
  if (motion) {
    rules.push({ constraint: "motion", statement: `Motion-aware. Accepts ${motion.type}.`, source: null });
  }

  const required = props.own.filter((prop) => prop.required).map((prop) => prop.name);
  if (required.length) {
    rules.push({ constraint: "required-props", statement: `Requires: ${required.join(", ")}.`, source: null });
  }

  return rules;
}

async function lastModified(sourceFile) {
  try {
    const { stdout } = await run("git", ["log", "-1", "--format=%cI", "--", sourceFile], { cwd: root });
    return stdout.trim() || null;
  } catch {
    return null;
  }
}

/** AgentTraceMap -> agent-trace-map, X402PaymentHandshake -> x402-payment-handshake. */
function toItemName(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

async function main() {
  const program = ts.createProgram([path.resolve(root, ENTRY)], COMPILER_OPTIONS);
  const [exports, themeTokens, docIndex, packageJson, maturity, existing] = await Promise.all([
    Promise.resolve(collectExports(program)),
    readThemeTokens(),
    indexDocs(),
    fs.readFile(path.join(root, "package.json"), "utf8").then(JSON.parse),
    fs.readFile(path.join(root, MATURITY_SOURCE), "utf8").then(JSON.parse),
    fs.readFile(path.join(root, OUTPUT), "utf8").then(JSON.parse),
  ]);

  const repositoryUrl = packageJson.repository?.url?.replace(/^git\+/, "").replace(/\.git$/, "") ?? null;

  const items = [];
  for (const entry of exports) {
    const sections = docIndex.get(entry.name) ?? [];
    const guidance = buildGuidance(sections);
    const assignment = maturity.components?.[entry.name];
    const graph = collectFileGraph(entry.sourceFile);
    const purpose = guidance.compositionRules.find((rule) => rule.constraint === "purpose")?.statement;

    items.push({
      name: toItemName(entry.name),
      type: "registry:component",
      title: entry.name,
      ...(purpose ? { description: purpose } : {}),
      categories: [categoryFor(entry.sourceFile)],
      ...(graph.packages.length ? { dependencies: graph.packages } : {}),
      files: graph.files.map((file) => ({ path: file, type: registryFileType(file) })),
      meta: {
        // Marks this item as regenerated on every build. Items without it are
        // hand-authored and are preserved untouched.
        generated: true,
        export: entry.name,
        kind: entry.kind,
        maturityTier: assignment?.tier ?? null,
        maturitySource: assignment?.source ?? null,
        maturityNote: assignment?.note ?? null,
        props: entry.props,
        tokenBindings: await readTokenBindings(entry.sourceFile, themeTokens),
        compositionRules: [...structuralRules(entry.props), ...guidance.compositionRules],
        doDont: guidance.doDont,
        documentedIn: sections.map((section) => ({ doc: section.doc, line: section.line })),
        provenance: {
          packageVersion: packageJson.version,
          sourceFile: entry.sourceFile,
          declarationFile: entry.declarationFile,
          sourceUrl: repositoryUrl ? `${repositoryUrl}/blob/main/${entry.sourceFile}` : null,
          lastModified: await lastModified(entry.sourceFile),
        },
      },
    });
  }

  // Hand-authored bundle items are the documented source-copy entrypoints and
  // must survive regeneration untouched.
  const authored = (existing.items ?? []).filter((item) => !item.meta?.generated);

  const output = { ...existing, items: [...authored, ...items] };
  await fs.writeFile(path.join(root, OUTPUT), `${JSON.stringify(output, null, 2)}\n`);

  const counts = items.reduce((totals, item) => {
    const tier = item.meta.maturityTier ?? "unassigned";
    totals[tier] = (totals[tier] ?? 0) + 1;
    return totals;
  }, {});

  console.log(`Generated ${OUTPUT}: ${authored.length} authored bundles + ${items.length} component items.`);
  console.log(
    `Tiers: ${Object.entries(counts)
      .map(([tier, count]) => `${tier}=${count}`)
      .join(", ")}`,
  );
}

// Only generate when invoked directly; scripts/check-component-registry.mjs
// imports the introspection above so the two cannot drift apart.
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
