import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

import { createRegistryService } from "../mcp/registry-service.mjs";
import { TIER_POLICY } from "../mcp/trust-tiers.mjs";

const service = await createRegistryService();

/**
 * The trust tier table is the reason this layer exists, so it is tested
 * directly rather than through the transport. The integration tests below then
 * confirm the same rules survive a real client session.
 */

test("internal components are not retrievable", () => {
  const internal = [...service.withheldNames];
  assert.ok(internal.length > 0, "expected at least one internal component to exist");

  for (const name of internal) {
    const result = service.getComponent(name);
    assert.equal(result.component, null, `${name} must not be returned`);
    assert.equal(result.reason, "withheld");
  }
});

test("internal components never appear in a listing", () => {
  const all = service.listComponents({ limit: 1000 });
  const leaked = all.components.filter((component) => service.withheldNames.has(component.name));
  assert.deepEqual(leaked, [], "internal components leaked into a listing");

  // and not through a filter that names their tier either
  const byTier = service.listComponents({ tier: "internal", limit: 1000 });
  assert.equal(byTier.total, 0);
});

test("a withheld component is refused, not reported as unknown", () => {
  const [name] = [...service.withheldNames];
  assert.equal(service.getComponent(name).reason, "withheld");
  assert.equal(service.getComponent("NoSuchComponent").reason, "unknown");
});

test("experimental components are retrievable but not eligible for unsupervised output", () => {
  const experimental = service.listComponents({ tier: "experimental", limit: 1000 });
  assert.ok(experimental.total > 0);

  for (const component of experimental.components) {
    assert.equal(component.usage.unsupervisedUse, false, `${component.name} must not be unsupervised-eligible`);
    assert.match(component.usage.guidance, /prototyping only/i);
  }
});

test("beta components are usable but flagged for human review", () => {
  const beta = service.listComponents({ tier: "beta", limit: 1000 });
  assert.ok(beta.total > 0);

  for (const component of beta.components) {
    assert.equal(component.usage.unsupervisedUse, true);
    assert.equal(component.usage.requiresHumanReview, true);
  }
});

test("stable components carry no review requirement", () => {
  const stable = service.listComponents({ tier: "stable", limit: 1000 });
  assert.ok(stable.total > 0);

  for (const component of stable.components) {
    assert.equal(component.usage.unsupervisedUse, true);
    assert.notEqual(component.usage.requiresHumanReview, true);
  }
});

test("every tier in the vocabulary has a defined policy", () => {
  // A tier with no policy would silently fall through to some default; the
  // table must cover the whole vocabulary in docs/component-readiness.md.
  for (const tier of ["stable", "beta", "experimental", "internal", "deprecated"]) {
    assert.ok(TIER_POLICY[tier], `no policy defined for tier "${tier}"`);
  }
});

test("lookups are per-component, not whole-file dumps", () => {
  const one = service.getComponent("AgentTraceMap");
  assert.equal(one.reason, "ok");
  assert.equal(one.component.name, "AgentTraceMap");

  const tokens = service.getTokens("colors", "acid-lime");
  assert.deepEqual(Object.keys(tokens.groups), ["colors"]);
  assert.deepEqual(Object.keys(tokens.groups.colors), ["acid-lime"]);

  const guidance = service.getGuidance("Shapes");
  assert.equal(guidance.section, "Shapes");
  assert.ok(guidance.body.length > 0);
});

/** The server must actually run, over a real transport, with these rules intact. */
test("the server runs and enforces the tiers over stdio", async (t) => {
  const client = new Client({ name: "trust-tier-test", version: "0.0.0" });
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [path.resolve("mcp/server.mjs")],
  });

  await client.connect(transport);
  t.after(() => client.close());

  const { tools } = await client.listTools();
  assert.deepEqual(
    tools.map((tool) => tool.name).sort(),
    ["modeless_get_component", "modeless_get_design_tokens", "modeless_get_guidance", "modeless_list_components"],
  );

  const stable = await client.callTool({
    name: "modeless_list_components",
    arguments: { tier: "stable", response_format: "json" },
  });
  assert.ok(stable.structuredContent.total > 0);

  const [internalName] = [...service.withheldNames];
  const withheld = await client.callTool({
    name: "modeless_get_component",
    arguments: { name: internalName },
  });
  assert.equal(withheld.isError, true, "an internal component must not be returned over the transport");
  assert.match(withheld.content[0].text, /not available/i);
  assert.ok(!withheld.structuredContent, "no record may accompany a withheld component");

  const listed = await client.callTool({
    name: "modeless_list_components",
    arguments: { limit: 100, response_format: "json" },
  });
  const names = listed.structuredContent.components.map((component) => component.name);
  assert.ok(!names.includes(internalName), "internal component leaked through the transport");
});
