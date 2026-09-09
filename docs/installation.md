# Installation

Modeless Design System currently supports two adoption paths:

- **Package install:** best for builders who want dependency management, types, and upgrades.
- **Copy source:** best for teams who want to own and modify every component.

The package is not published to npm. `npm install @modeless/design-system` will 404 until
publication resumes. Install from GitHub.

## Package Install From GitHub

This is the supported install today, and the one modeless.io uses:

```bash
npm install github:modelessly/modeless-design-system
```

The `prepare` script builds `dist` during installation, so no extra build step is needed.

Then import components and CSS:

```tsx
import { ModelessButton, ModelessPanel, ModelessTextField } from "@modeless/design-system";
import "@modeless/design-system/globals";
import "@modeless/design-system/styles";
```

See `docs/package-usage.md` for a complete Vite example.

## Local Demo

```bash
npm install
npm run dev
```

## Package Install From Local Tarball

From this repo:

```bash
npm run build
npm pack --cache ./.npm-pack-cache
```

In a clean React app:

```bash
npm install /path/to/modeless/modeless-design-system-0.1.0.tgz
```

Then import components and CSS:

```tsx
import { ModelessButton, ModelessPanel, ModelessTextField } from "@modeless/design-system";
import "@modeless/design-system/globals";
import "@modeless/design-system/styles";
```

See `docs/package-usage.md` for a complete Vite example.

## Future Npm Install

Once published, the public install shape will be:

```bash
npm install @modeless/design-system
```

```tsx
import { ModelessButton, ModelessPanel, ModelessTextField } from "@modeless/design-system";
import "@modeless/design-system/globals";
import "@modeless/design-system/styles";
```

## Copy Into A Project

This is a repository source-copy path, not the default npm package path.

Copy these folders into a React, Tailwind, and shadcn-style project:

- `src/components/modeless`
- `src/styles/modeless-theme.css`
- `src/tokens`
- `src/lib/utils.ts` if your project does not already have a compatible `cn()`

Then import the theme after your Tailwind globals:

```ts
import "../src/styles/globals.css";
import "../src/styles/modeless-theme.css";
```

## Tailwind

Package consumers do not need to run Tailwind for Modeless components to render. `@modeless/design-system/globals` is compiled during `npm run build`, and `@modeless/design-system/styles` provides the Modeless theme variables and artifact utilities.

If a consumer writes their own Tailwind utility classes, that app still needs its own Tailwind setup. The package CSS only covers the utilities used by Modeless Design System and the shared global/theme classes it ships.
