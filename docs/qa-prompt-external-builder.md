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
