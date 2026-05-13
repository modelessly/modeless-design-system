# Tarball Consumer Smoke Test

Date: 2026-05-11

## Goal

Verify that the packed `modeless-ui` artifact works in a fresh external Vite app without a consumer Tailwind configuration.

## Fixture

Temporary app:

```txt
/private/tmp/modeless-tarball-consumer
```

Installed package:

```txt
modeless-ui-0.1.0.tgz
```

The fixture imports:

```ts
import { ModelessButton, ModelessCard, ModelessDialog, ModelessPanel, ModelessToast } from "modeless-ui";
import "modeless-ui/globals";
import "modeless-ui/styles";
```

The fixture does not include a Tailwind config.

## Commands

```bash
npm run build:ui
npm pack --cache ./.npm-pack-cache
npm install
npm run typecheck
npm run build
npm run dev -- --host 127.0.0.1 --port 5178
```

The consumer app commands were run from `/private/tmp/modeless-tarball-consumer`.

## Results

Passed:

- Packed artifact included compiled `design-system/dist/styles/globals.css`.
- `design-system/dist/styles/globals.css` did not contain raw `@tailwind` directives.
- Fresh consumer install completed with zero vulnerabilities reported by npm.
- Consumer TypeScript check passed.
- Consumer production build passed.
- Browser smoke passed at `http://127.0.0.1:5178/`.
- Dialog opened and closed.
- Toast rendered after button interaction.
- No Vite error overlay was detected.

## Finding

The packed package is now usable as an external dependency for a plain Vite app that imports `modeless-ui/globals` and `modeless-ui/styles`. Consumers only need their own Tailwind setup if they write app-specific Tailwind utilities outside the packaged Modeless UI CSS.
