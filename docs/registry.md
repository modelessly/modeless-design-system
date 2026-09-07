# Registry

`registry/registry.json` follows the [shadcn registry schema](https://ui.shadcn.com/schema/registry.json) and serves two audiences from one file: people copying source into their own projects, and agents that need to know what a component is, what it may contain, and whether it can be trusted.

It holds two kinds of item.

## Bundle items (hand-authored)

Four items are the documented source-copy entrypoints and are maintained by hand:

| Item | Contents |
| --- | --- |
| `modeless-theme` | Theme CSS and the Tailwind config |
| `modeless-components` | The core and foundation components |
| `modeless-visualizations` | The visualization family, canvas primitives, and globe |
| `modeless-agentic-commerce` | The commerce family |

Removing one is a breaking change for anyone consuming the registry, so `registry:check` fails if any of the four disappears.

## Component items (generated)

One item per exported component, regenerated on every `npm run build` by `scripts/generate-component-registry.mjs`. Generated items carry `meta.generated: true`; anything without that flag is treated as hand-authored and is preserved untouched by regeneration.

Each item is a valid registry item — `name`, `type`, `title`, `description`, `categories`, `dependencies`, `files` — so it can be installed on its own. The design-system metadata lives under `meta`, which the schema defines as free-form:

| `meta` field | What it carries |
| --- | --- |
| `export` | The exported identifier, since item names are kebab-case |
| `maturityTier` | Reconciled from `registry/component-maturity.json` |
| `maturitySource`, `maturityNote` | Where the tier came from, and why |
| `props` | Own props with types, requiredness, and doc comments, read from the built declarations |
| `tokenBindings` | CSS variables, token objects, and semantic classes the component consumes |
| `compositionRules` | Structural facts from the types plus purpose and accessibility statements from docs |
| `doDont` | Discrete rules converted from prose, each citing its document and line |
| `provenance` | Package version, source path and URL, and last-modified date from git |

Internal-tier components are absent by construction: the generator reads the public entrypoint, and `registry:check` fails if an internal component appears.

## Files are self-contained

Every item lists the local files it transitively imports, not just its own. `AgentTraceMap` pulls in `visualizations/shared.tsx`, `lib/utils.ts`, and the token modules, because copying the component without them gives you code that does not compile.

`registry:check` enforces this: for every item, every relative import reachable from its files must also be listed in that item, or in an item it names in `registryDependencies`. `modeless-components` uses that second form, since its barrel re-exports the visualization and commerce families.

This check was added with the per-component items and immediately found that all three component bundles were shipping broken: every component imports the token barrel `src/tokens/index.ts`, and no bundle listed it. Anyone running `shadcn add modeless-visualizations` copied files that could not resolve their imports. The bundles now carry the token modules.

## Regenerating

```bash
npm run build            # regenerates registry.json
npm run registry:check   # validates it
```

`registry.json` is committed and regenerated, in the same way as `DESIGN.md`. Do not hand-edit generated items; edit the source or `registry/component-maturity.json` and rebuild. Regeneration is idempotent, so a clean tree stays clean.

## Consuming the registry

The registry points at local source paths. Before publishing it as a hosted registry, rewrite those paths to raw GitHub URLs or a registry endpoint.

Consumers still need the Modeless theme styles and Tailwind tokens for the intended visual treatment; `modeless-theme` carries both.

The package tarball does not ship `registry/`, so the metadata is repository-only today. If the query layer is to serve it from an installed package, that packaging decision has to be made deliberately.
