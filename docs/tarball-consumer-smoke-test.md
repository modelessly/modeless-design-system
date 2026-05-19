# Tarball Consumer Smoke Test

Date: 2026-05-11

## Goal

Verify that the packed `@modeless/design-system` artifact works in a fresh external Vite app without a consumer Tailwind configuration.

## Fixture

Temporary app:

```txt
/private/tmp/modeless-tarball-consumer
```

Installed package:

```txt
modeless-design-system-0.1.0.tgz
```

The fixture imports:

```ts
import { ModelessButton, ModelessCard, ModelessDialog, ModelessPanel, ModelessToast } from "@modeless/design-system";
import "@modeless/design-system/globals";
import "@modeless/design-system/styles";
```

The fixture does not include a Tailwind config.

## Commands

```bash
npm run build
npm pack --cache ./.npm-pack-cache
npm install
npm run typecheck
npm run build
npm run dev -- --host 127.0.0.1 --port 5178
```

The consumer app commands were run from `/private/tmp/modeless-tarball-consumer`.

## Results

Passed:

- Packed artifact included compiled `dist/styles/globals.css`.
- `dist/styles/globals.css` did not contain raw `@tailwind` directives.
- Fresh consumer install completed with zero vulnerabilities reported by npm.
- Consumer TypeScript check passed.
- Consumer production build passed.
- Browser smoke passed at `http://127.0.0.1:5178/`.
- Dialog opened and closed.
- Toast rendered after button interaction.
- No Vite error overlay was detected.

## Finding

The packed package is now usable as an external dependency for a plain Vite app that imports `@modeless/design-system/globals` and `@modeless/design-system/styles`. Consumers only need their own Tailwind setup if they write app-specific Tailwind utilities outside the packaged Modeless Design System CSS.
