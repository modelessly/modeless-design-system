import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { isRetrievable, policyFor } from "./trust-tiers.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const REGISTRY = "registry/registry.json";
const MATURITY = "registry/component-maturity.json";
const DESIGN = "DESIGN.md";

/**
 * Reads the artifacts once and answers per-component questions against them.
 *
 * Kept separate from the server so the tier rules can be tested directly,
 * without a transport in the way.
 */
export async function createRegistryService({ root = repoRoot } = {}) {
  const [registry, maturity, design] = await Promise.all([
    fs.readFile(path.join(root, REGISTRY), "utf8").then(JSON.parse),
    fs.readFile(path.join(root, MATURITY), "utf8").then(JSON.parse),
    fs.readFile(path.join(root, DESIGN), "utf8"),
  ]);

  const components = new Map();
  for (const item of registry.items ?? []) {
    if (!item.meta?.generated) continue;
    components.set(item.meta.export, item);
  }

  // Internal components never reach the registry, but a query can still name
  // one. Knowing which names are internal lets the layer refuse them explicitly
  // instead of answering "unknown", which would be misleading.
  const internalNames = new Set(
    Object.entries(maturity.components ?? {})
      .filter(([, assignment]) => assignment.tier === "internal")
      .map(([name]) => name),
  );

  const { tokens, sections } = parseDesign(design);

  function summarise(item) {
    const tier = item.meta.maturityTier;
    return {
      name: item.meta.export,
      item: item.name,
      category: item.categories?.[0] ?? null,
      maturityTier: tier,
      description: item.description ?? null,
      usage: policyFor(tier),
    };
  }

  return {
    /** Component names withheld by tier, for diagnostics and tests. */
    withheldNames: internalNames,

    listComponents({ tier, category, query, limit = 25, offset = 0 } = {}) {
      let matches = [...components.values()].filter((item) => isRetrievable(item.meta.maturityTier));

      if (tier) matches = matches.filter((item) => item.meta.maturityTier === tier);
      if (category) matches = matches.filter((item) => item.categories?.includes(category));
      if (query) {
        const needle = query.toLowerCase();
        matches = matches.filter((item) =>
          `${item.meta.export} ${item.description ?? ""} ${item.categories?.join(" ") ?? ""}`.toLowerCase().includes(needle),
        );
      }

      matches.sort((a, b) => a.meta.export.localeCompare(b.meta.export));
      const page = matches.slice(offset, offset + limit);

      return {
        total: matches.length,
        count: page.length,
        offset,
        components: page.map(summarise),
        has_more: offset + page.length < matches.length,
        ...(offset + page.length < matches.length ? { next_offset: offset + page.length } : {}),
      };
    },

    /**
     * Per-component lookup. Returns null when the component does not exist or
     * its tier makes it unretrievable — the caller cannot tell those apart from
     * the payload, only from the accompanying reason.
     */
    getComponent(name) {
      if (internalNames.has(name)) {
        return { component: null, reason: "withheld", tier: "internal", guidance: policyFor("internal").guidance };
      }

      const item = components.get(name);
      if (!item) return { component: null, reason: "unknown" };

      const tier = item.meta.maturityTier;
      if (!isRetrievable(tier)) {
        return { component: null, reason: "withheld", tier, guidance: policyFor(tier).guidance };
      }

      return {
        component: {
          ...summarise(item),
          props: item.meta.props,
          tokenBindings: item.meta.tokenBindings,
          compositionRules: item.meta.compositionRules,
          doDont: item.meta.doDont,
          documentedIn: item.meta.documentedIn,
          provenance: item.meta.provenance,
          files: item.files?.map((file) => file.path) ?? [],
          dependencies: item.dependencies ?? [],
        },
        reason: "ok",
      };
    },

    getTokens(group, name) {
      const available = Object.keys(tokens);
      if (group && !available.includes(group)) {
        return { error: `Unknown token group "${group}". Available groups: ${available.join(", ")}.` };
      }

      const groups = group ? { [group]: tokens[group] } : tokens;
      if (!name) return { groups };

      const matches = {};
      for (const [groupName, entries] of Object.entries(groups)) {
        if (entries[name] !== undefined) matches[groupName] = { [name]: entries[name] };
      }
      if (Object.keys(matches).length === 0) {
        return { error: `No token named "${name}"${group ? ` in group "${group}"` : ""}.` };
      }
      return { groups: matches };
    },

    getGuidance(section) {
      const available = Object.keys(sections);
      if (!section) return { sections: available };
      const body = sections[section];
      if (body === undefined) {
        return { error: `Unknown section "${section}". Available sections: ${available.join(", ")}.` };
      }
      return { section, body };
    },
  };
}

/** Parse DESIGN.md into its token groups and its prose sections. */
function parseDesign(design) {
  const tokens = {};
  const frontMatter = design.match(/^---\n([\s\S]*?)\n---/);

  if (frontMatter) {
    let group = null;
    let entry = null;
    for (const line of frontMatter[1].split("\n")) {
      const top = line.match(/^([a-zA-Z]+):\s*(.*)$/);
      if (top) {
        group = ["colors", "typography", "rounded", "spacing"].includes(top[1]) ? top[1] : null;
        if (group) tokens[group] = {};
        entry = null;
        continue;
      }
      if (!group) continue;

      const pair = line.match(/^ {2}([\w-]+):\s*(.*)$/);
      if (pair) {
        if (pair[2] === "") {
          entry = pair[1];
          tokens[group][entry] = {};
        } else {
          entry = null;
          tokens[group][pair[1]] = pair[2].replace(/^"|"$/g, "");
        }
        continue;
      }

      const nested = line.match(/^ {4}([\w-]+):\s*(.*)$/);
      if (nested && entry) tokens[group][entry][nested[1]] = nested[2].replace(/^"|"$/g, "");
    }
  }

  const sections = {};
  const body = design.replace(/^---\n[\s\S]*?\n---\n/, "");
  let current = null;
  const buffer = [];
  const flush = () => {
    if (current) sections[current] = buffer.join("\n").trim();
    buffer.length = 0;
  };
  for (const line of body.split("\n")) {
    const heading = line.match(/^##\s+(.+?)\s*$/);
    if (heading) {
      flush();
      current = heading[1];
      continue;
    }
    if (current) buffer.push(line);
  }
  flush();

  return { tokens, sections };
}
