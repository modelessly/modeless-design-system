# Track A — External Builder Run 1

Date: 2026-09-09. Builder: Antigravity, clean room, `docs/` only, no access to `src/`.
Prompt: `docs/qa-prompt-external-builder.md`. Scoring key: `docs/qa-brief-external-builder.md`.

## Result

The run **passed the readiness gate** and produced a real app: a fleet operations dashboard
using 16 components, the idle → active → complete lifecycle, an `AgentTraceMap` visualization,
and empty and error states. `tsc -b && vite build` clean.

| Gate question | Result |
| --- | --- |
| Clean external app installed the package | Pass — on the third attempt |
| Components imported from `@modeless/design-system` | Pass |
| Required CSS imports worked | Pass, after the builder wrote its own ambient declaration |
| Typecheck and production build passed | Pass |

Passing the gate is not the finding. The friction log is.

## Canaries

All three sealed items were found independently.

1. The documented install path fails — found, and it was worse than we knew (see D1).
2. 44 of 66 components lack per-component documentation — found, with the five that cost the most time named.
3. The registry copy path had never been run — found, in two distinct failure modes.

## Defects beyond the canaries

Each verified in this repository before being recorded.

**D1 — the GitHub install named the wrong repository.** *Fixed.*
`docs/installation.md` said `npm install github:modelessly/modeless#main`. That is the private
site repository. npm resolves it, records the dependency as `modeless`, and every
`@modeless/design-system` import then fails module resolution. The documented command had
never been run by anyone.

**D2 — the CSS subpath exports shipped no types.** *Fixed.*
`import "@modeless/design-system/globals"` does not typecheck when `noUncheckedSideEffectImports`
is set — which the stock Vite `react-ts` template does. The builder had to invent an ambient
declaration before it could compile anything. Our own consumer fixture never caught it because
its hand-written tsconfig omits the flag. Reproduced here, then fixed by emitting `.d.ts` files
beside both stylesheets, pointing the export conditions at them, and setting the flag in the fixture.

**D3 — the registry's `meta.props` does not expand named types.** *Open.*
The generator emits `steps: AgentTraceStep[]` and `status: AgentTraceStatus`. An agent learns
that a prop exists and nothing about its shape. The builder discovered the required `x`, `y` and
`type` fields, and the `"running" | "complete" | "failed"` union, by writing wrong code and reading
compiler errors. This is the central agentic finding: the data an agent needs exists, one
dereference away from where it looks.

**D4 — the shadcn CLI cannot consume the registry.** *Open.*
`npx shadcn add <registry.json>` fails on the schema discriminator: the CLI wants a single
registry *item*, not the catalog. Pointed at an individual item, it parses dependencies, reports
success and writes nothing — items list file paths with no `content` field and no hosted base URL.

**D5 — the `modeless-components` bundle does not compile when copied.** *Open.*
It ships `src/components/modeless/index.ts`, which unconditionally re-exports `./visualizations`
and `./commerce`, but delegates both families to `registryDependencies` rather than including
them in `files`. Copying the bundle yields `TS2307` on both. The single-component items are
sound: `agent-trace-map`'s seven listed files compiled with zero hand edits, which was the
question Phase 3 set out to answer.

**D6 — consumer Tailwind utilities are absent from the shipped CSS.** *Not a defect.*
`docs/installation.md` and `docs/package-usage.md` both state this. The builder hit it before
reading it, which makes it a discoverability problem for the Get started page rather than a gap.

## What this says about agent consumption

Every expensive moment in the run was the same moment: the builder needed a type it could not
see, so it wrote code it expected to fail and read the compiler's reply. Documentation prose
naming a prop is not enough — an agent needs the closed set of values and the required fields.
The registry already holds most of this. Expanding named types (D3) and giving agents a path to
query it are worth more than any amount of additional prose.
