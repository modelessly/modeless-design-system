# External Builder Validation

Date: 2026-05-11

## Goal

Validate the Modeless Design System package experience from a fresh downstream app using the documented package-style contract:

- `@modeless/design-system`
- `@modeless/design-system/globals`
- `@modeless/design-system/styles`

This test intentionally did not use the checked-in `examples/vite-consumer` fixture.

## Fixture

Temporary app:

```txt
/private/tmp/modeless-external-builder-validation
```

Installed package:

```txt
/Users/allensmith/Library/Mobile Documents/com~apple~CloudDocs/_GitHub/modeless/modeless-design-system-0.1.0.tgz
```

The app is a compact operations settings dashboard with:

- text field, textarea, select, checkbox, switch
- segmented control
- tabs
- panel, card, list, divider, progress
- dialog and toast
- token and type imports
- ordinary app-authored CSS instead of a Tailwind config

## Commands

From the Modeless repo:

```bash
npm pack --cache ./.npm-pack-cache
```

From the consumer app:

```bash
npm install
npm run typecheck
npm run build
npm run dev -- --host 127.0.0.1 --port 5179
```

## Results

Passed:

- Installed the packed tarball into a fresh app.
- Consumer install completed with zero vulnerabilities reported by npm.
- Consumer TypeScript check passed.
- Consumer production build passed.
- Browser smoke passed at `http://127.0.0.1:5179/`.
- App rendered the Modeless Design System screen.
- Dialog opened and confirmed.
- Toast rendered after confirmation.
- Tabs changed visible content.
- No browser console errors were recorded.

## Friction

TypeScript caught three incorrect assumptions in the first consumer pass:

- `ModelessSegmentedControl` requires an accessible label through `aria-label`.
- `ModelessProgress` currently accepts `default`, `warning`, or `muted`; it does not accept `success`.
- `ModelessTabs` expects tab metadata plus children, not per-tab `content` objects.

These were good failures: the package types were available, clear enough to correct the app, and did not require private imports.

## Finding

The package is usable by a fresh React/Vite app using the public package surface and ordinary app CSS. The main improvement opportunity is documentation: component examples should more explicitly show required accessibility props and the exact `ModelessTabs` composition model.
