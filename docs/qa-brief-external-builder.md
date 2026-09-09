# QA Brief — External Builder (Track A)

Instructions for an agentic coding tool, plus a scoring key for the operator.

**The prompt is a separate file: `docs/qa-prompt-external-builder.md`.** It contains only what the agent should see, so it can be handed over whole.

**This file must not be given to the agent.** It names what we already know is missing, and an agent that reads it can perform the expected findings instead of producing real ones.

Track A is the highest-value untested path in the system. `docs/component-readiness.md` requires a clean external-consumer test before any component can reach `stable`, and **no component has ever passed one**.

## Setup, before you start the agent

The test only works if the agent cannot read the design system's source. Two rules:

1. **Open a workspace containing only the new test app** — an empty directory outside this repository. Do not add `modeless-design-system` to the workspace, and do not run the agent from inside it.
2. **The repository is public on GitHub.** A capable agent can find and read it. The brief says not to; if your tool can restrict web access to the published docs, do that as well.

An agent that reads `src/` tests nothing. The question is whether the documentation stands on its own, and source access answers it before it is asked.

---

# Part 2 — Operator scoring key

**Do not give this to the agent.**

Unlike the runtime brief, this is not a calibration run with a sealed answer — most of what Track A tests has genuinely never been exercised, so the outcome is unknown. But three things are known in advance, and whether the agent surfaces them tells you how much to trust the rest of the report.

## Known before the run

| # | What we know | What the agent should hit |
| --- | --- | --- |
| 1 | **The documented install path does not work.** `README.md` and `docs/package-usage.md` describe `npm publish` (paused) and packing from a local clone — which requires the source the agent is told not to read. The `github:` install is documented nowhere. | It should fail to install by the documented route and say so. If it silently uses the fallback without flagging it, its friction log is not trustworthy. |
| 2 | **44 of 66 components have no per-component documentation.** Their composition rules and do/don't guidance are structural only. `ArtifactCard`, `CommandSurface`, `ModelessDropzone`, `ModelessTabs` and most of the foundation layer are in this group. | Friction on prop discovery for anything outside the visualization and commerce families. |
| 3 | **The registry copy path has never been run.** Phase 3 repaired bundles that were shipping unresolvable imports, verified by a checker only. | Genuinely unknown — this is the first real test. Either outcome is a result. |

## Reading the report

- **Finds 1 and 2, and the copy path either works or fails with a specific reproducible error** — a good run. Act on the friction log.
- **Reports no friction** — the agent read the source. Check whether the app uses props that appear in no documentation.
- **Silently worked around the install failure** — treat the rest of the friction log as incomplete rather than empty.

## What this run cannot tell you

Whether the components are any good, whether the design is right, or whether the API is well-shaped. It tests one thing: can somebody build with this from the documentation. That is the gate, and it is the only thing standing between the current tiers and `stable`.

## Afterwards

The friction log is the input to the P1 documentation work — specifically which of the 44 undocumented components actually block someone, which is the question that decides whether that item is expensive or cheap.
