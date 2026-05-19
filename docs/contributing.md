# Contributing

## Principles

- Keep components source-owned and easy to copy.
- Prefer CSS variables over hardcoded colors.
- Keep variants typed and documented.
- Preserve keyboard focus and reduced-motion behavior.
- Avoid proprietary assets, copyrighted logos, and moodboard image dependencies.

## Development

```bash
npm install
npm run dev
npm run typecheck
npm run build
npm run verify
```

## Component Changes

When adding a component, include:

- Source file in `src/components/modeless`
- Export in `src/components/modeless/index.ts`
- Demo usage in `/components` or `/patterns`
- Documentation update in `docs/components.md`
- Registry entry if it should be distributed through shadcn

See the root `CONTRIBUTING.md` for public pull request expectations.
