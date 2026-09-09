# QA Brief — External Builder (Track A)

Instructions for an agentic coding tool, plus a scoring key for the operator.

**Part 1 is given to the agent. Part 2 must not be** — it names what we already know is missing.

Track A is the highest-value untested path in the system. `docs/component-readiness.md` requires a clean external-consumer test before any component can reach `stable`, and **no component has ever passed one**.

## Setup, before you start the agent

The test only works if the agent cannot read the design system's source. Two rules:

1. **Open a workspace containing only the new test app** — an empty directory outside this repository. Do not add `modeless-design-system` to the workspace, and do not run the agent from inside it.
2. **The repository is public on GitHub.** A capable agent can find and read it. The brief says not to; if your tool can restrict web access to the published docs, do that as well.

An agent that reads `src/` tests nothing. The question is whether the documentation stands on its own, and source access answers it before it is asked.

---

# Part 1 — The brief (give this to the agent)

You are testing whether a design system can be adopted from its documentation alone.

## The rule that matters

You may read the package's published documentation — its `README.md`, its `docs/` directory, and its `DESIGN.md`.

**You may not read the design system's component source.** Not `src/`, not the GitHub repository's implementation files, not the built `.js` in `node_modules`. If you cannot work out how to use something from the documentation, that is a finding — record it and move on, or make your best guess and record that you guessed.

Reading the source to unblock yourself invalidates the entire exercise.

## What to build

A **fleet operations dashboard** for monitoring AI agents. One page, real interface, using only components from the package:

1. An application shell with navigation and a page header
2. A configuration form — text field, select, switch, and a submit action
3. A task lifecycle surface showing a job move through **idle → active → complete**, using the correct status treatment for each state
4. One visualization component showing agent activity
5. An empty state and an error state

Make it a plausible product screen, not a component gallery.

## Getting the package

The documentation describes how to install it. **Try the documented path first and record exactly what happens** — including if it does not work.

If you cannot install by the documented route, use this and note that you had to:

```bash
npm install github:modelessly/modeless-design-system
```

Then follow the documentation for imports and CSS.

## What to report — friction is the product

This is not a pass/fail exercise. A working app that took eight painful steps is a worse result than a working app that took three, and both are useful. Record:

- **Every point where you had to guess.** What were you trying to do, what was missing, what did you assume?
- **Everything documented that did not work as described** — an import, a class, a prop, a command.
- **Anything you needed that you could not find at all.**
- **Where you were tempted to read the source**, and what you were trying to learn.
- **How long it took to get the first component rendering**, and how many attempts.

Quote the documentation you were following when something went wrong.

## Also test the copy path

The system offers a second adoption route: copying component source into your own project rather than installing a package. The documentation describes it.

In a **separate** directory, try it:

```bash
npx shadcn@latest add <the registry URL or path the docs give you>
```

Try both a bundle and a single component. **Confirm the copied files compile without you adding imports by hand.** If the CLI cannot consume the registry, record that as the finding and copy the files the registry item lists instead — the question being tested is whether an item lists everything it needs.

## Deliverable

A report with:

```
## What I built
[what works, what does not, a screenshot if you can]

## Install
Documented path: [what happened]
Working path: [what you used]

## Friction log
1. [what I wanted] → [what was missing] → [what I did]

## Documentation that was wrong
[quote it, then what actually happened]

## What I could not find
[things I looked for and never found]

## Times I wanted the source
[what I was trying to learn]

## The copy path
[did it work, what was missing]
```

Plus the four things the design system's own readiness gate asks for:

- Did a clean external app install the package?
- Did components import from `@modeless/design-system`?
- Did the required CSS imports work?
- Did typecheck and a production build pass?

# End of brief

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
