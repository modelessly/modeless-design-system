# Testing

The repository has one test suite: an accessibility render harness. It is the first test tooling in the project, and it uses Node's built-in runner rather than adding a framework.

```bash
npm test          # node --test "tests/**/*.test.mjs"
npm run verify    # runs the suite as part of the release gate
```

The suite requires a build, because it renders the compiled components from `dist`. `npm run verify` builds first; run `npm run build` yourself before `npm test` in isolation.

## What it does

For every component exported from the package, the harness renders it to static markup, parses the result, and asserts structural accessibility rules against what actually rendered — not against the source.

This exists because six components shipped the same defect, in three separate families, and nothing in the release gate could see it: `verify` builds and typechecks, but never rendered anything.

## Props are synthesized, not fixtured

`tests/synthesize-props.mjs` builds minimal props for each component directly from its declared types: required props only, string literal unions resolved to their first member, arrays filled with two entries, callbacks stubbed.

This is deliberate. Hand-written fixtures for 71 components would drift as props change, and a component added without a fixture would silently go unchecked. Synthesized props mean a new component is covered the moment it is exported, and the suite asserts that every exported component has coverage.

The values are minimal, not realistic — they exercise structure, not visual design. Two accommodations are made:

- `children` is supplied even though it is optional, because a control rendered without it has no text, which reads as a missing accessible name rather than an artefact of synthesis. Components that render a void element reject children, so the render is retried without it.
- `CANNOT_SYNTHESIZE` holds components whose props cannot be made coherent from types alone. A test asserts entries are still failing, so one that starts rendering must be removed rather than lingering.

## The rules

| Rule | What it catches |
| --- | --- |
| `button-role-override` | A `<button>` given a non-interactive role such as `listitem`, discarding its own semantics. Widget roles that legitimately sit on buttons — `tab`, `radio`, `switch`, `menuitem` — are allowed. |
| `aria-pressed-needs-button` | `aria-pressed` on an element that does not have the button role, where it is invalid and silently ignored. |
| `list-owns-listitem` | A `role="list"` owning children that are not listitems. |
| `label-needs-role` | `aria-label` on a generic element (`div`, `span`, `p`, `footer`, `header`) with no role, where it is not exposed. `<section>` is excluded: a named section maps to `region`, which accepts a label. |
| `button-needs-name` | A button with no text content and no accessible name. Elements inside an `aria-hidden` subtree are exempt, since they are deliberately not exposed. |
| `svg-needs-name-or-hidden` | An `<svg>` that is neither hidden from assistive technology nor named. |

## What it cannot catch

These rules are structural. **They cannot detect meaning carried only by color** — the `SharedPaymentTokenCard` defect, where permission grant state was conveyed by icon and swatch alone, would pass every rule here. That class of problem still needs human review against the guidance in `docs/accessibility.md`.

They also say nothing about focus order, contrast, or whether an accessible name is *meaningful* rather than merely present.

## Known failures

`KNOWN_FAILURES` records violations that exist on the current branch but are fixed in review elsewhere, each with a reason. Entries are asserted to still fail, so a merged fix makes the entry stale and the suite reports that it should be deleted — a baseline that cleans itself up rather than quietly growing.

## Adding a rule

Add an entry to `RULES` in `tests/a11y-render.test.mjs` with an `id`, a `describe`, and a `check(document)` returning an array of human-readable violation strings. Rules receive a parsed document and should describe the offending element specifically enough to locate it.

Prefer rules that encode a defect that actually shipped. Every rule currently in the suite does.
