# Modeless Design System Planning

Kanban for product planning, release readiness, and idea capture.

**North star:** a design system for AI agents first, humans second. The repository is the agent's distribution channel; modeless.io is the human's, and should be generated from what the repository already produces rather than maintained beside it.

Last brought current: 2026-09-09.

Updated after every working session, alongside `CHANGELOG.md` and any documentation the work touched.

---

## Needs Decision

Ordered by what they unblock. Each names the recommendation where there is one.

- [ ] **Release posture.** Quiet GitHub soft launch, npm prerelease, or public announcement. Carried over and still open. Note that the taxonomy half of this question is now settled — see the tier review under Done.

- [ ] **Server-side rendering.** The design system section of modeless.io renders nothing without JavaScript, so anything that does not execute JS — including many agents — sees an empty page. This is the old "Next.js or SSR fixture" question, sharpened: it now matters for the north star, not just for external builders. Unsized until the site's source is visible.

- [ ] **`colors.ts` vs the theme CSS.** The same palette is defined twice and **11 of 13 core colours disagree** — `acid-lime` is `#C7FF2A` in TypeScript but renders `#c6ff29`; `radar-blue` is four steps off in the green channel. What renders is always the CSS, so the two can disagree on screen inside one product. Fix by generating one from the other; deriving `colors.ts` from the theme matches the stated source-of-truth direction. Changes public API values. Full table in `docs/design-md.md`.

- [ ] **`CommerceTrustBoundary` maps `low` risk to acid lime.** Lime means live. Low risk is a steady-state quality rather than a running task, so the completion rule does not obviously apply — but it deserves a deliberate answer rather than an accident.

- [ ] **Rename `ProductMaturityMeter`.** It takes `level: number` and has nothing to do with products; the name is the only product-specific thing left about it. Cheap, but it is a public API rename.

---

## In Progress

- [ ] Nothing active. The last delivery cycle closed with `main` green: 76 tests, 66 registry components, zero design lint errors.

---

## Ready To Do

### P1 — make the repository genuinely agent-consumable

- [ ] **Give agents a usable path into the registry.** 287 KB is too large to read whole and nothing says not to try. Document MCP-first access, emit a smaller index, or both.
- [ ] **Document a working install path.** `README.md` and `docs/package-usage.md` describe two routes: `npm install @modeless/design-system`, which fails because publication is paused, and packing from a local clone, which requires the source. The `github:` install that actually works — and that modeless.io now uses — is documented nowhere. An external builder following the docs cannot install the package.
- [ ] **Map `docs/`.** 31 files with no index; neither an agent nor a new human can tell which matter. Ideally generated.
- [ ] **Document the muted-text contrast constraint.** Muted text passes AA on background, card and muted surfaces and fails on `border` (3.49:1) and `input` (4.35:1). No component composes it that way today, so this is preventative — and cheaper than lightening a core token. Closes the library half of QA D8.

### P2 — site restructure

Direction settled: four sections — Get started, Foundations, Components, Patterns. The Get started page uses the three-routes design.

- [ ] **Build out the Get started page.** Install, import, the three consumption routes, requirements, and what is safe to depend on.
- [ ] **Generate component pages from `registry.json`.** The site has no per-component page at all — the biggest usability gap, and why it reads as a brochure rather than a reference. Everything such a page needs already exists in the registry. Generating them is also what stops the site drifting from the package again. Highest-value site item after the rebuild.
- [ ] **Correct the site's factual errors.** Distribution advertises `npm install` as *live* when the package is not published; the catalog labels Product Primitives `stable` when five are `internal` and unexported; Foundation is labelled `new` where the package says `beta`.
- [ ] **Add search.** 66 components, none findable.
- [ ] **Redo the component index and detail mockups** in the settled visual direction. The first pass was drawn before I had looked at how the site actually uses lime.

### P3 — close the readiness gap

Nothing reaches `stable` until these move: `docs/component-readiness.md` requires a clean external-consumer test and no component has ever passed one.

- [ ] **Track A — external builder run.** A coding agent builds a real app from the published package using only `docs/`, never `src/`. Also the first genuine exercise of the registry copy path repaired in Phase 3. **Prompt ready: `docs/qa-prompt-external-builder.md`** — safe to hand over whole. The operator's setup and scoring key are in `docs/qa-brief-external-builder.md`, which the agent must not see. Run it before the P2 site restructure, so the documentation is validated before component pages are generated from it.
- [ ] **Re-run the runtime QA properly.** The first Grok run was a calibration run and passed. The next run, against a rebuilt site, is the real validation.
- [ ] **Per-component documentation for the 44 components that lack it.** Their composition rules and do/don't guidance are structural only, which limits both the generated site pages and what an agent can be told. Splittable by family.

### P4 — library debt

- [ ] **Document and consider promoting `ModelessButtonLink`.** The anchor variant of stable `ModelessButton` with an identical API, currently undocumented and `beta`. Blocked on Track A like every promotion.
- [ ] **QA D5 — motion `off` collapses two sections.** Did not reproduce against the library CSS. `MotionVisualizationGuide` now lives in the site repo at `src/components/modeless-internal`, so this is reproducible there.
- [ ] **QA D8 — muted text contrast.** The failing 3.49:1 combination does not occur in the library; muted text passes AA on every surface a component actually uses. Confirm the offending element is site markup, now that the site source is available.
- [ ] **Upstream the site's `SectionHeader` and `TagList` changes.** The site restyled two public components: `SectionHeader` gained a `divided` prop, `TagList` a different chip treatment. Both are held locally in the site repo; reconciling them here removes the last of the fork.

---

## Deferred by decision

- **npm publication** — deliberately paused until the package stays boring for a few cycles.
- **Automated drift correction** — detection needs a track record first. Drift is detected; nothing auto-fixes.
- **Promoting Experimental to Stable** — a human maturity decision, gated on Track A.
- **The public case study** — after the rest is live and stable, not before.

---

## Done

### Agentic upgrade — 2026-09

- [x] Phase 0 audit of the plan's assumptions against the actual repository (`docs/agentic-upgrade-audit.md`).
- [x] Phase 1 — per-component registry records generated from the TypeScript declarations (#1).
- [x] Phase 2 — `DESIGN.md` generated from the token layer, with `design:lint` in the gate (#2).
- [x] Phase 3 — registry extended with 66 per-component items alongside the four authored bundles (#10).
- [x] Phase 4 — accessibility documentation for the visualization and commerce families (#3).
- [x] Phase 5 — MCP server enforcing the trust tiers; internal components unreachable (#11).
- [x] Phase 6 — drift detection for the generated artifacts (#15).
- [x] Resolved the 16 inferred maturity tiers; six components moved to `internal` and out of the public barrel (#9).
- [x] Landed the globe and canvas visualization layer (#8).

### The site consumes the package

- [x] **modeless.io migrated off its vendored fork** — the site carried 41 files at `design-system/src` with no dependency on the package, drifted behind on every accessibility fix and ahead by site-specific work. It now consumes `@modeless/design-system` as a git dependency; 47 vendored files removed. Verified live: buttons with `role="listitem"` 22 → 0, `aria-pressed` outside SignalBloom 0 → 43, unexposed `aria-label`s 12 → 0. modelessly/modeless#8.
- [x] **The internal tier proved itself.** The site's local evolution was concentrated almost entirely in the six components classified `internal` — reasoned from type signatures, confirmed by the codebase. They now live in the site repo, which is what the tier means.

### Repository as the agent channel

- [x] **`AGENTS.md`** — the agent entry point: task-to-document map, how to query the registry instead of reading it, the trust tiers as enforced rules, nine output rules, and an explicit do-not list (#17).
- [x] **Agent distribution channel decided** — agents consume through the repository, not the package. `registry/`, `component-maturity.json` and `mcp/` stay out of the tarball deliberately, and the README now says so.

### Quality

- [x] Accessibility render harness — the repository's first test tooling, 76 tests (#6).
- [x] Fixed nine accessibility defects across three families (#5, #7, #14): commerce selection state, grant-state text, `SignalBloom` button semantics, focus visibility in `ModelessTextField`/`ModelessSearchField`/`CommandSurface`, unexposed value labels.
- [x] Fixed completion states rendering in acid lime, against the system's own rule (#14).
- [x] Fixed `VisualizationFrame` unable to shrink, which pushed the page wide at narrow widths (#14).
- [x] QA test plan and runtime brief with a sealed scoring key (#12, #13); the calibration run passed — all three canaries found plus five real defects.

### Closed as already done

- [x] **Repository rename** to `modeless-design-system` — complete; the remote is `modelessly/modeless-design-system`. The old entry still listed `modelessly/modeless-ui`.
- [x] **Package contract renamed** to `@modeless/design-system`.
- [x] **npm publish dry run** — `pack:check` and `pack:local` run on every `npm run verify`, and the package name is final. The remaining question is release posture, not the dry run.
- [x] **Scope of the stable/beta/experimental labels** — settled at 6 stable, 38 beta, 22 experimental, 6 internal, with zero inferred tiers, enforced against the exports in both directions (#9). What remains is release posture.

### Earlier

- [x] Confirmed repository visibility is public and `main` aligned with `origin/main`.
- [x] Added GitHub Actions CI for the release gate.
- [x] Added `CONTRIBUTING.md`, `SECURITY.md`, PR template, and issue templates.
- [x] Added release docs with semver, prerelease, soft-launch and pre-publish checklists.
- [x] Made `npm run verify` use a repo-local npm cache for the consumer fixture install.
- [x] Updated stale docs referencing `design-system/`, `build:ui`, and `verify:ui`.

---

## Ideas

- Add a lightweight examples gallery for stable primitives.
- Create a richer external-builder tutorial using a real product settings screen.
- Add visual regression screenshots for foundation components.
- Add a source-copy adoption guide separate from npm package usage.
- Create a package maturity badge/table in the README — now cheap, since the tiers are machine-readable.
- Lead the site with the agent-first architecture rather than the component gallery. The registry, the trust tiers and the drift detection are the rare part; a component gallery is the most commoditised artifact in the industry.
