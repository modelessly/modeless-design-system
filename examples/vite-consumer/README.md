# Modeless Design System Vite Consumer

This example is a permanent external-consumer fixture for the `@modeless/design-system` package.

It installs the package from the repo root with `file:../..` and imports:

- `@modeless/design-system`
- `@modeless/design-system/globals`
- `@modeless/design-system/styles`
- exported tokens and types

## Run

From the repo root:

```bash
npm run build
npm install --prefix examples/vite-consumer
npm run typecheck --prefix examples/vite-consumer
npm run build --prefix examples/vite-consumer
```

This example should eventually run in CI after the package build.
