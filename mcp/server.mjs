#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { pathToFileURL } from "node:url";

import { createRegistryService } from "./registry-service.mjs";
import { RETRIEVABLE_TIERS, TIER_POLICY } from "./trust-tiers.mjs";

const CATEGORIES = ["core", "foundation", "product", "visualizations", "commerce"];
const TOKEN_GROUPS = ["colors", "typography", "rounded", "spacing"];

const responseFormat = z
  .enum(["markdown", "json"])
  .default("markdown")
  .describe("Output format: 'markdown' for human-readable or 'json' for machine-readable");

/** Every response states what the agent may do with what it just received. */
function usageLine(tier) {
  const policy = TIER_POLICY[tier];
  return policy ? `${tier} — ${policy.guidance}` : `${tier} — unknown tier, treat as not usable.`;
}

function reply(text, structured) {
  return { content: [{ type: "text", text }], ...(structured ? { structuredContent: structured } : {}) };
}

function errorReply(text) {
  return { content: [{ type: "text", text }], isError: true };
}

export async function createServer(options = {}) {
  const service = await createRegistryService(options);

  const server = new McpServer({ name: "modeless-design-system-mcp-server", version: "0.1.0" });

  server.registerTool(
    "modeless_list_components",
    {
      title: "List Modeless components",
      description: `List components in the Modeless Design System, filtered by maturity tier, category, or a text query.

Returns a summary per component, not the full record — call modeless_get_component for props, composition rules, and do/don't guidance.

Internal-tier components are never listed. They are not part of the public package contract.

Args:
  - tier ('stable' | 'beta' | 'experimental' | 'deprecated'): restrict to one maturity tier
  - category ('core' | 'foundation' | 'product' | 'visualizations' | 'commerce'): restrict to one family
  - query (string): case-insensitive match against name, description and category
  - limit (number): maximum results, 1-100 (default: 25)
  - offset (number): results to skip, for pagination (default: 0)
  - response_format ('markdown' | 'json'): output format (default: 'markdown')

Returns:
  { total, count, offset, components: [{ name, item, category, maturityTier, description, usage }], has_more, next_offset? }
  where usage states whether the component may be used in unsupervised output.

Examples:
  - "What stable components are there?" -> tier="stable"
  - "Show me visualization components" -> category="visualizations"
  - "Anything for payments?" -> query="payment"`,
      inputSchema: {
        tier: z.enum(RETRIEVABLE_TIERS).optional().describe("Restrict to one maturity tier"),
        category: z.enum(CATEGORIES).optional().describe("Restrict to one component family"),
        query: z.string().min(2).max(100).optional().describe("Case-insensitive text match"),
        limit: z.number().int().min(1).max(100).default(25).describe("Maximum results to return"),
        offset: z.number().int().min(0).default(0).describe("Results to skip, for pagination"),
        response_format: responseFormat,
      },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async ({ tier, category, query, limit, offset, response_format }) => {
      const result = service.listComponents({ tier, category, query, limit, offset });

      if (result.total === 0) {
        return reply("No components matched. Internal-tier components are never listed.", result);
      }

      if (response_format === "json") return reply(JSON.stringify(result, null, 2), result);

      const lines = result.components.map(
        (component) =>
          `- **${component.name}** (${component.category}) — ${usageLine(component.maturityTier)}${component.description ? `\n  ${component.description}` : ""}`,
      );
      const more = result.has_more ? `\n\nShowing ${result.count} of ${result.total}. Next offset: ${result.next_offset}.` : "";
      return reply(`${result.total} component(s):\n\n${lines.join("\n")}${more}`, result);
    },
  );

  server.registerTool(
    "modeless_get_component",
    {
      title: "Get one Modeless component",
      description: `Get the full record for a single component: props, token bindings, composition rules, do/don't guidance, provenance, and the files needed to copy it.

Enforces the trust tier table. Internal-tier components are withheld: the tool reports that the component is not available rather than returning its record.

Args:
  - name (string): the exported component identifier, e.g. "AgentTraceMap" (not the kebab-case registry item name)
  - response_format ('markdown' | 'json'): output format (default: 'markdown')

Returns:
  { name, category, maturityTier, description, usage, props, tokenBindings, compositionRules, doDont, documentedIn, provenance, files, dependencies }

Error Handling:
  - Returns "not available" for internal-tier components
  - Returns "Unknown component" with a suggestion to call modeless_list_components if the name does not exist`,
      inputSchema: {
        name: z.string().min(1).max(100).describe("Exported component identifier, e.g. AgentTraceMap"),
        response_format: responseFormat,
      },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async ({ name, response_format }) => {
      const result = service.getComponent(name);

      if (result.reason === "withheld") {
        return errorReply(
          `"${name}" is ${result.tier} tier and is not available through this layer. ${result.guidance}`,
        );
      }
      if (result.reason === "unknown") {
        return errorReply(`Unknown component "${name}". Call modeless_list_components to see what is available.`);
      }

      const component = result.component;
      if (response_format === "json") return reply(JSON.stringify(component, null, 2), component);

      const props = component.props.own
        .map((prop) => `  - \`${prop.name}\`: ${prop.type}${prop.required ? " (required)" : ""}`)
        .join("\n");
      const rules = component.compositionRules.map((rule) => `  - ${rule.constraint}: ${rule.statement}`).join("\n");
      const doDont = component.doDont.map((rule) => `  - ${rule.rule.toUpperCase()}: ${rule.statement}`).join("\n");

      return reply(
        [
          `# ${component.name}`,
          ``,
          `**Tier:** ${usageLine(component.maturityTier)}`,
          `**Category:** ${component.category}`,
          component.description ? `\n${component.description}` : "",
          `\n## Props\n${props || "  (none)"}`,
          `\n## Composition rules\n${rules || "  (none)"}`,
          `\n## Do / don't\n${doDont || "  (none documented)"}`,
          `\n## Tokens\n  ${component.tokenBindings.cssVariables.join(", ") || "(none)"}`,
          `\n## Source\n  ${component.provenance.sourceFile} (v${component.provenance.packageVersion})`,
        ].join("\n"),
        component,
      );
    },
  );

  server.registerTool(
    "modeless_get_design_tokens",
    {
      title: "Get Modeless design tokens",
      description: `Look up design tokens from DESIGN.md by group, or a single token by name.

Args:
  - group ('colors' | 'typography' | 'rounded' | 'spacing'): restrict to one token group
  - name (string): a single token name, e.g. "acid-lime" or "primary"
  - response_format ('markdown' | 'json'): output format (default: 'markdown')

Returns:
  { groups: { <group>: { <token>: <value> } } }

Examples:
  - "What is the primary color?" -> group="colors", name="primary"
  - "Show the type scale" -> group="typography"`,
      inputSchema: {
        group: z.enum(TOKEN_GROUPS).optional().describe("Restrict to one token group"),
        name: z.string().min(1).max(80).optional().describe("A single token name"),
        response_format: responseFormat,
      },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async ({ group, name, response_format }) => {
      const result = service.getTokens(group, name);
      if (result.error) return errorReply(result.error);
      if (response_format === "json") return reply(JSON.stringify(result, null, 2), result);

      const rendered = Object.entries(result.groups)
        .map(([groupName, entries]) => {
          const body = Object.entries(entries)
            .map(([token, value]) => `  - \`${token}\`: ${typeof value === "object" ? JSON.stringify(value) : value}`)
            .join("\n");
          return `## ${groupName}\n${body}`;
        })
        .join("\n\n");
      return reply(rendered, result);
    },
  );

  server.registerTool(
    "modeless_get_guidance",
    {
      title: "Get Modeless design guidance",
      description: `Get one prose section of DESIGN.md — the design system's written guidance. Call with no arguments to list the available sections.

Sections are returned one at a time rather than as the whole document.

Args:
  - section (string): section heading, e.g. "Colors", "Shapes", "Do's and Don'ts"
  - response_format ('markdown' | 'json'): output format (default: 'markdown')

Returns:
  { section, body } or { sections: [...] } when called with no section`,
      inputSchema: {
        section: z.string().min(1).max(80).optional().describe("Section heading from DESIGN.md"),
        response_format: responseFormat,
      },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async ({ section, response_format }) => {
      const result = service.getGuidance(section);
      if (result.error) return errorReply(result.error);
      if (response_format === "json") return reply(JSON.stringify(result, null, 2), result);
      if (result.sections) return reply(`Available sections:\n${result.sections.map((name) => `  - ${name}`).join("\n")}`, result);
      return reply(`## ${result.section}\n\n${result.body}`, result);
    },
  );

  return server;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const server = await createServer();
  await server.connect(new StdioServerTransport());
}
