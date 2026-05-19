# Contributing

Thanks for taking the time to improve Modeless Design System.

## Development

```bash
npm install
npm run build
npm run public-api:check
npm run verify
```

## Pull Requests

- Keep changes focused and easy to review.
- Update docs when public APIs, styling requirements, or maturity labels change.
- Add or update examples when component usage changes.
- Preserve keyboard access, visible focus states, and reduced-motion behavior.
- Run `npm run verify` before opening a release-facing PR.

## Component Changes

When adding or changing a public component, update:

- Source in `src/components/modeless`
- Barrel exports in `src/components/modeless/index.ts`
- Public API guard in `scripts/check-public-api.mjs`, when needed
- Documentation in `docs/components.md` or the relevant specialist doc
- Registry metadata in `registry/registry.json`, when the source-copy path should include it

## Release Readiness

Stable components should have documented props, package-safe imports, visible focus states, reduced-motion behavior, and a clean external-consumer build.
