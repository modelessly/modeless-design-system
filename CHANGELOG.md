# Changelog

## Unreleased

### Added

- Seeded the standalone Modeless Design System package repo from the main Modeless site repository.
- Added GitHub CI, contribution templates, security policy, and release-process documentation for public soft-launch readiness.
- Renamed the public package contract to `@modeless/design-system`.
- Added distinct completion-green success semantics across badges, progress indicators, feedback, and terminal status treatments.
- Added the accessible `ModelessDropzone` Foundation Component and operational workflow guidance for local-file and destination-folder patterns.
- Added automatic GitHub Pages deployment for the packaged Vite consumer showcase on pushes to `main`.
- Added `AGENTS.md`, the entry point for AI agents: what to read for a given task, how to query the registry, the trust tiers as enforced rules, and the rules generated output must respect.
- Added per-component registry items to `registry/registry.json` — props, token bindings, composition rules, do/don't guidance and provenance for all 66 exported components, generated on every build.
- Added `DESIGN.md`, generated from the token layer, with `design:lint` in the release gate.
- Added a local MCP server (`npm run mcp:serve`) exposing the registry and `DESIGN.md` as queryable resources, enforcing the maturity trust tiers at retrieval. Internal-tier components are unreachable through it.
- Added an accessibility render harness — the repository's first test suite — asserting structural accessibility rules against every rendered component.
- Added drift detection for the generated artifacts, so a stale committed `registry.json` or `DESIGN.md` fails the gate.
- Added accessibility documentation for the visualization and agentic commerce families, including per-component notes.
- Added `PLANNING.md` as the tracked backlog, and QA documentation covering the test plan, the runtime brief and the calibration findings.

### Changed

- Six components moved to the internal tier and out of the public barrel: `ProductCard`, `ProductCTACluster`, `ProductCategoryLabel`, `ProductStatusBadge`, `StatusLegend` and `MotionVisualizationGuide`. They are typed against the Modeless catalog rather than a general interface pattern, so they are no longer part of the public package contract. **Breaking.**
- Resolved every inferred maturity tier by human review: 6 stable, 38 beta, 22 experimental, 6 internal. Tiers are now enforced against the exports in both directions.
- Completed the registry bundles, which were shipping files that could not resolve their imports — `shadcn add` copied components without the token barrel they import.

### Fixed

- Stabilized clipped-corner frame edge rendering by letting the shared clip geometry determine 1px border joins.
- Fixed completion states rendering in acid lime. `AgentReceipt`, `DelegatedPaymentTimeline` and `X402PaymentHandshake` resolved finished states to the active colour, against the rule that lime means live and never finished.
- Fixed invisible focus states in `ModelessTextField`, `ModelessSearchField` and `CommandSurface`, which cleared the native outline without drawing a ring.
- Fixed selection state being invisible to assistive technology across the five interactive agentic commerce components, which indicated selection by colour alone.
- Fixed `SharedPaymentTokenCard` conveying permission grant state through icon and colour only, with no text equivalent.
- Fixed `SignalBloom` items carrying `role="listitem"` on buttons, which discarded the button role and made their `aria-pressed` state invalid.
- Fixed unexposed value labels on `ProductMaturityMeter` and `ContextWindowHeatmap`, and menu icons left visible to assistive technology in `ModelessShell`.
- Fixed `VisualizationFrame` being unable to shrink inside a grid, which pushed the page wide at narrow widths instead of scrolling its own content.
