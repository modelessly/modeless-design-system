# Installation

Modeless UI currently supports two adoption paths:

- **Package install:** best for builders who want dependency management, types, and upgrades.
- **Copy source:** best for teams who want to own and modify every component.

The package is currently tested locally as `modeless-ui`. The intended public package name is `@modeless/ui`.

## Local Demo

```bash
npm install
npm run dev
```

## Package Install From Local Tarball

From this repo:

```bash
npm run build:ui
npm pack --cache ./.npm-pack-cache
```

In a clean React app:

```bash
npm install /path/to/modeless/modeless-ui-0.1.0.tgz
```

Then import components and CSS:

```tsx
import { ModelessButton, ModelessPanel, ModelessTextField } from "modeless-ui";
import "modeless-ui/globals";
import "modeless-ui/styles";
```

See `design-system/docs/package-usage.md` for a complete Vite example.

## Future GitHub Install

Once the repository is public and the package boundary is stable enough for early adopters:

```bash
npm install github:modelessly/modeless#main
```

The `prepare` script builds `design-system/dist` during installation.

## Future Npm Install

The target public shape is:

```bash
npm install @modeless/ui
```

```tsx
import { ModelessButton, ModelessPanel, ModelessTextField } from "@modeless/ui";
import "@modeless/ui/globals";
import "@modeless/ui/styles";
```

## Copy Into A Project

This is a repository source-copy path, not the default npm package path.

Copy these folders into a React, Tailwind, and shadcn-style project:

- `design-system/src/components/modeless`
- `design-system/src/styles/modeless-theme.css`
- `design-system/src/tokens`
- `design-system/src/lib/utils.ts` if your project does not already have a compatible `cn()`

Then import the theme after your Tailwind globals:

```ts
import "../design-system/src/styles/globals.css";
import "../design-system/src/styles/modeless-theme.css";
```

## Tailwind

Package consumers do not need to run Tailwind for Modeless components to render. `modeless-ui/globals` is compiled during `npm run build:ui`, and `modeless-ui/styles` provides the Modeless theme variables and artifact utilities.

If a consumer writes their own Tailwind utility classes, that app still needs its own Tailwind setup. The package CSS only covers the utilities used by Modeless UI and the shared global/theme classes it ships.
