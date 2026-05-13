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
```

## Component Changes

When adding a component, include:

- Source file in `design-system/src/components/modeless`
- Export in `design-system/src/components/modeless/index.ts`
- Demo usage in `/components` or `/patterns`
- Documentation update in `design-system/docs/components.md`
- Registry entry if it should be distributed through shadcn
