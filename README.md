# Modeless Design System

Reusable React components, tokens, theme CSS, docs, and source-copy material for the Modeless interface language.

The public package name is `@modeless/design-system`.

## Structure

```txt
src/       React components, tokens, styles, and shared utilities
docs/      installation, package usage, tokens, components, accessibility
registry/  shadcn-compatible registry draft
examples/  downstream consumer fixtures
```

## Entrypoints

- Package root: `src/index.ts`
- Components: `src/components/modeless/index.ts`
- Tokens: `src/tokens/index.ts`
- Theme CSS: `src/styles/modeless-theme.css`
- Tailwind globals: `src/styles/globals.css`
- Built package output: `dist`

## Quickstart

Build the package and run the full release gate:

```bash
npm run build
npm run public-api:check
npm run verify
```

Test the external-builder path with the permanent Vite fixture:

```bash
npm run build
npm run example:consumer:install
npm run example:consumer:typecheck
npm run example:consumer:build
```

Install the packed tarball in another app:

```bash
npm run build
npm pack --cache ./.npm-pack-cache
npm install /path/to/modeless-design-system/modeless-design-system-0.1.0.tgz
```

Import components, globals, and theme CSS:

```tsx
import { ModelessButton, ModelessPanel, ModelessTextField } from "@modeless/design-system";
import "@modeless/design-system/globals";
import "@modeless/design-system/styles";
```

`@modeless/design-system/globals` is compiled during `npm run build`, so packaged components render in a plain React/Vite app without requiring the consumer to configure Tailwind. Consumers still need their own styling pipeline for app-authored utility classes.

See `docs/package-usage.md` for the full consumer guide.

## Live Preview

The public consumer showcase deploys automatically from `main` through GitHub Pages:

[`https://modelessly.github.io/modeless-design-system/`](https://modelessly.github.io/modeless-design-system/)

The preview builds the permanent Vite consumer fixture against the freshly packed package, so it exercises the same public component and CSS imports an external builder uses. npm publication remains a separate release action.

## Public API Maturity

- **Stable:** core primitives such as `ModelessButton`, `ModelessPanel`, `SignalBadge`, `TerminalBlock`, `CommandSurface`, and `ArtifactCard`.
- **Beta:** Foundation Components such as text fields, dropzone, selects, selection controls, tabs, cards, lists, dialog, toast, progress, and state surfaces.
- **Experimental:** visualization and agentic commerce components.
- **Internal:** CVA variant helpers, shared frame helpers, commerce helper utilities, `cn()`, registry plumbing, and source-copy internals.

Public exports are guarded by `npm run public-api:check`, which reads built declaration files after `npm run build` and fails if helper internals leak or required exports disappear.

## What Is Not Ready Yet

- The package is not published to npm.
- Visualizations and agentic commerce components need stronger examples and accessibility guidance before they should be treated as stable.
- The source-copy registry path is secondary and still needs fuller dependency/CSS guidance.
- The package should stay pre-1.0 until package docs, release gates, and external consumption stay boring for a few cycles.

## Philosophy

Modeless Design System supports two adoption paths:

- package install for builders who want dependency management, types, and upgrades
- source/registry copy for teams who want to own and modify the code

The npm-style package artifact is dependency-shaped: it ships `dist`, docs, README, changelog, license, and package metadata. It does not ship `src` or `registry` by default.
