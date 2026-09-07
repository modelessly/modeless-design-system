# MCP Server

A local [Model Context Protocol](https://modelcontextprotocol.io) server that exposes the Modeless registry and `DESIGN.md` as queryable resources, and enforces the maturity trust tiers at the point of retrieval.

This is where tiers stop being documentation an agent may or may not read, and become a gate: an internal component cannot be retrieved at all, and an experimental one arrives labelled as ineligible for unsupervised output.

## Running it

```bash
npm run mcp:serve
```

The server speaks stdio and reads the repository's own artifacts — `registry/registry.json`, `registry/component-maturity.json`, and `DESIGN.md`. It holds no state and writes nothing.

To register it with an MCP client, point the client at the command:

```json
{
  "mcpServers": {
    "modeless-design-system": {
      "command": "node",
      "args": ["/absolute/path/to/modeless-design-system/mcp/server.mjs"]
    }
  }
}
```

## Tools

| Tool | Purpose |
| --- | --- |
| `modeless_list_components` | List components, filtered by tier, category, or text query. Paginated. |
| `modeless_get_component` | One component's full record: props, token bindings, composition rules, do/don't guidance, provenance, and the files needed to copy it. |
| `modeless_get_design_tokens` | Token lookup by group, or a single token by name. |
| `modeless_get_guidance` | One prose section of `DESIGN.md`. Call with no arguments to list sections. |

Every tool is read-only, returns markdown by default and JSON on request, and answers **per component or per token** rather than returning whole files. An agent asking about one button should not have to read the entire design system to find it.

## The trust tiers

The table below is enforced in `mcp/trust-tiers.mjs`, and every response carries its tier's guidance inline so a consuming agent is told the policy along with the data.

| Tier | Retrievable? | Usable in unsupervised output? |
| --- | --- | --- |
| `stable` | Yes | Yes |
| `beta` | Yes | Yes, but flag output referencing it for human review |
| `experimental` | Yes | No — prototyping only, not eligible for unsupervised or auto-merged output |
| `deprecated` | Yes | No — compatibility only, not for new work |
| `internal` | **No** | No |

`deprecated` is not in the original plan's table. The vocabulary in `docs/component-readiness.md` defines it, so the layer needs a defined behaviour for it rather than a gap. An unrecognised tier is treated as **not retrievable**, so a typo fails closed.

### How internal components are withheld

Internal components never reach the registry in the first place — the generator reads the public entrypoint, and `registry:check` fails if one appears. The server adds a second, independent barrier: it reads the internal names from `registry/component-maturity.json` and refuses them explicitly.

That means a query for `ProductCard` is answered "not available", not "unknown". The distinction is deliberate: an agent that asked for a real component deserves to know the request was refused rather than being told the component does not exist, which would invite it to invent one.

Two barriers rather than one is the point. If a future change let an internal component into the registry, the server would still withhold it.

## Tests

`tests/mcp-trust-tiers.test.mjs` covers the tier rules directly and then over a real client session:

- every internal component is withheld, and none appears in any listing, including one filtered by tier
- a withheld component is refused rather than reported as unknown
- experimental components carry `unsupervisedUse: false`
- beta components carry `requiresHumanReview: true`
- stable components carry neither restriction
- every tier in the vocabulary has a policy, so none falls through to a default
- lookups return one component, one token, or one section — never the whole file
- the server starts over stdio, lists its four tools, and still withholds internal components through the transport

Run them with `npm test`; they are part of `npm run verify`.

## What this layer does not do

It does not enforce anything about *how* generated code is written — only what an agent may retrieve and what it is told about using it. An agent is free to ignore the guidance; the layer makes the policy explicit and machine-readable, and makes internal components genuinely unreachable.

It also does not validate that generated output matches the registry. That is drift detection, which is separate work.

## Packaging

The server reads from the repository. The package tarball ships `dist` but not `registry/` or `mcp/`, so an installed copy of `@modeless/design-system` does not carry this server or its data.

That is fine for local use, which is what this is for today. Serving the registry from an installed package, or hosting it remotely, means deciding to ship `registry/` — a deliberate packaging change, and one that would want the remote-transport and authentication guidance in the MCP specification rather than this stdio setup.
