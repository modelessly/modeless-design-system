# AGENTS.md

Entry point for AI agents working with the Modeless Design System.

This system is built for agents first and humans second. If you are an agent, read this file before anything else in the repository — it tells you what is here, what to read for a given task, and the rules your output must respect.

Humans: `README.md` is your entry point.

---

## What this is

`@modeless/design-system` — React components, design tokens, and theme CSS for AI-native product interfaces: agentic workflows, operational tooling, telemetry, and trust-sensitive systems.

**66 components** are public. Each one has a maturity tier that governs whether you may use it, and how. Those tiers are enforced, not advisory.

**The repository is the agent distribution channel.** The npm tarball ships the built package and prose documentation, but not `registry/` or `mcp/` — so the machine-readable half of this system is here, in the repo, and not in an installed copy of the package.

---

## Read this for that

Do not read the whole repository. Read what your task needs.

| Your task | Read |
| --- | --- |
| Use a component in generated code | Query the registry — see below. Do not read `src/`. |
| Pick a colour, type or shape token | `DESIGN.md` at the root |
| Understand a family's intent | `docs/components.md`, `docs/visualizations.md`, `docs/agentic-commerce.md` |
| Get accessibility rules right | `docs/accessibility.md` |
| Know whether something is production-ready | `docs/component-readiness.md` |
| Install or import the package | `docs/package-usage.md` |
| Copy source instead of installing | `docs/registry.md` |
| Understand the token layer's shape | `docs/design-md.md` |
| See what is planned or open | `PLANNING.md` |

`docs/` holds 31 files. Most are records of decisions and QA runs, useful to a human reviewing history and rarely useful to you mid-task.

---

## Querying the registry

`registry/registry.json` holds a record per component: props with types, token bindings, composition rules, do/don't guidance with citations, provenance, and the files needed to copy it.

**It is roughly 287 KB. Do not read it whole.** Query it.

### Preferred: the MCP server

```bash
npm run mcp:serve
```

A local stdio MCP server, documented in `docs/mcp-server.md`. Four read-only tools, each answering per component, per token or per section:

| Tool | Use it for |
| --- | --- |
| `modeless_list_components` | Find components by tier, category or text query |
| `modeless_get_component` | One component's full record |
| `modeless_get_design_tokens` | A token group, or one token by name |
| `modeless_get_guidance` | One prose section of `DESIGN.md` |

Every response carries its tier's usage policy inline. Read it — it tells you what you may do with what you just received.

### Without MCP

Read a single item out of `registry/registry.json` by name rather than parsing the file into context. Item names are kebab-case (`agent-trace-map`); the exported identifier is in `meta.export` (`AgentTraceMap`).

The four hand-authored bundle items — `modeless-theme`, `modeless-components`, `modeless-visualizations`, `modeless-agentic-commerce` — are source-copy entrypoints, not components.

---

## Trust tiers — these are rules, not guidance

Every component carries a tier. It governs what you may retrieve and what you may do with it.

| Tier | May you retrieve it? | May you use it in unsupervised output? |
| --- | --- | --- |
| `stable` | Yes | Yes |
| `beta` | Yes | Yes — but flag output referencing it for human review |
| `experimental` | Yes | **No.** Prototyping only. Never in output a human will not review before it ships. |
| `deprecated` | Yes | **No.** Compatibility only; not for new work. |
| `internal` | **No** | **No** |

Current distribution: **6 stable, 38 beta, 22 experimental, 6 internal.**

Tiers live in `registry/component-maturity.json` and are reconciled by human review — an inferred tier can never be `stable`.

### Internal components

These six are not part of the public package and are not exported. They exist in `src/` for the Modeless site only:

`ProductCard` · `ProductCTACluster` · `ProductCategoryLabel` · `ProductStatusBadge` · `StatusLegend` · `MotionVisualizationGuide`

The MCP server withholds them. If you ask for one, you are told it is unavailable — **that is a refusal, not a gap.** Do not infer their API, do not reconstruct them from `src/`, and do not invent a replacement with the same name. Use a public component, or tell the user no suitable component exists.

---

## Rules your generated output must respect

These come from `docs/tokens.md` and `docs/accessibility.md`. Each has been violated in shipped code and fixed; they are not hypothetical.

1. **Acid lime means live, never finished.** `--primary` / `--signal` is for active, processing, connected, selected. A completed state uses `--success`. A finished job rendered in lime reads as still running.
2. **Ready is not live.** A loaded-but-idle item is informational — `SignalBadge variant="ready"`, radar blue — not lime.
3. **Never carry state in colour alone.** Pair it with text, shape or structure. This applies to generated markup as much as to components.
4. **Never remove a focus ring.** If you clear an outline, put a ring on the element or its wrapper.
5. **Selection must be exposed.** A selectable control needs `aria-pressed` or `aria-current`, not just a border colour.
6. **Icons are decorative unless interactive.** Hide them from assistive technology.
7. **Motion respects `prefers-reduced-motion`,** and every surface must stay understandable when motion is off. Never let animation be the only carrier of state.
8. **The 45° `artifact-angle` cut belongs on component surfaces.** Page sections and background grids stay square.
9. **Reach for the foundation layer** before writing a route-local control. If a text field exists here, use it.

---

## Verifying your work

```bash
npm run verify
```

Runs the full release gate: build, public API check, registry check, `DESIGN.md` lint, 76 tests, drift detection, packaging, and the external consumer fixture. If you changed anything in this repository, this must pass before you hand back.

Individually: `npm test` (accessibility render harness plus MCP trust-tier tests), `npm run registry:check`, `npm run drift:check`.

---

## Do not

- **Do not edit generated files.** `registry/registry.json` and `DESIGN.md` are regenerated by `npm run build`; `drift:check` fails if a committed copy is stale. Edit the source and rebuild.
- **Do not read `registry.json` or `src/` wholesale** to answer a question the registry answers per component.
- **Do not use an internal component**, or reconstruct one.
- **Do not treat `experimental` as usable** in output that ships without review.
- **Do not add a component without its metadata.** `registry:check` fails on an export with no record and on a record with no export.
- **Do not invent tokens.** Every colour, type and shape value is in `DESIGN.md`. If nothing fits, say so.

---

## Where things live

```txt
AGENTS.md                        this file
README.md                        human entry point
DESIGN.md                        generated token description
PLANNING.md                      backlog and open decisions
registry/registry.json           generated — a record per component
registry/component-maturity.json human-owned tier assignments
mcp/server.mjs                   the query layer
src/                             component source
docs/                            prose documentation, 31 files
scripts/                         generators and checks
tests/                           accessibility harness, trust-tier tests
```
