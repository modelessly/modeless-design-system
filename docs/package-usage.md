# Package Usage

This guide describes the external-builder experience for Modeless Design System. The package builds as `@modeless/design-system`.

## Current Local Package Test

Build and pack the design system package from the Modeless repo:

```bash
npm run build
npm pack --cache ./.npm-pack-cache
```

Install the generated tarball in another React app:

```bash
npm install /path/to/modeless-design-system/modeless-design-system-0.1.0.tgz
```

Import components, CSS, and tokens:

```tsx
import {
  ModelessButton,
  ModelessCard,
  ModelessCardContent,
  ModelessCardHeader,
  ModelessPanel,
  ModelessTextField,
  SignalBadge,
  modelessColors,
  type ModelessMotionIntensity,
} from "@modeless/design-system";
import "@modeless/design-system/globals";
import "@modeless/design-system/styles";

const motion: ModelessMotionIntensity = "subtle";

export function Example() {
  return (
    <main className="modeless-theme min-h-screen bg-background p-6 text-foreground">
      <ModelessPanel title="External Consumer" eyebrow="@modeless/design-system" motion={motion} actions={<SignalBadge variant="live">installed</SignalBadge>}>
        <p className="text-sm leading-6 text-muted-foreground">Modeless Design System is installed from a packed package.</p>
        <div className="mt-5 flex gap-3">
          <ModelessButton variant="signal">Primary action</ModelessButton>
          <ModelessButton variant="outline">Secondary action</ModelessButton>
        </div>
      </ModelessPanel>

      <ModelessCard className="mt-4">
        <ModelessCardHeader>
          <h2 className="font-display text-3xl uppercase leading-none">Foundation Form</h2>
        </ModelessCardHeader>
        <ModelessCardContent>
          <ModelessTextField label="Product name" defaultValue="Modeless Design System" description={`Accent token: ${modelessColors.acidLime}`} />
        </ModelessCardContent>
      </ModelessCard>
    </main>
  );
}
```

## CSS Import Order

Import globals first, then the theme:

```ts
import "@modeless/design-system/globals";
import "@modeless/design-system/styles";
```

`globals` ships compiled Tailwind base/utilities from the package build. `styles` provides Modeless theme variables, artifact geometry, grid utilities, and motion classes.

Apply `modeless-theme` when you want to scope the visual language to part of an app:

```tsx
<section className="modeless-theme bg-background text-foreground">
  {/* Modeless Design System */}
</section>
```

The theme also defines variables on `:root`, so full-app usage works too.

## Peer Dependencies

Consumers need React and React DOM:

```json
{
  "peerDependencies": {
    "react": ">=18",
    "react-dom": ">=18"
  }
}
```

The package also depends on:

- `class-variance-authority`
- `clsx`
- `lucide-react`
- `tailwind-merge`

## Tailwind Expectations

Packaged Modeless components do not require the consumer app to run Tailwind. `npm run build` compiles `src/styles/globals.css` through Tailwind/PostCSS before publishing it to `dist/styles/globals.css`.

Important conventions:

- External apps should still import both `@modeless/design-system/globals` and `@modeless/design-system/styles`.
- Component-authored utility classes are covered by the compiled package CSS.
- Consumer-authored Tailwind utility classes still require the consumer's own Tailwind setup.
- Semantic classes such as `bg-background`, `text-foreground`, `bg-card`, `border-border`, and `text-muted-foreground` are available through the packaged CSS.
- Typography classes such as `font-display`, `text-label`, and `text-micro` are available through the packaged CSS.
- motion and artifact classes come from `@modeless/design-system/styles`.

## Maturity

- **Stable:** core primitives such as `ModelessButton`, `ModelessPanel`, `SignalBadge`, `TerminalBlock`, `CommandSurface`, and `ArtifactCard`.
- **Beta:** Foundation Components such as fields, selection controls, tabs, cards, lists, progress, dialog, toast, and state components.
- **Experimental:** visualizations and agentic commerce components.

See `docs/modeless-design-system-package-boundary.md` for the current export boundary.

## Verified Consumer Test

The current package has been verified in a clean temporary Vite React app:

- install packed tarball
- import components from `@modeless/design-system`
- import `@modeless/design-system/globals`
- import `@modeless/design-system/styles`
- import tokens and types
- run TypeScript
- run Vite production build
- render the page in the browser

## Permanent Example App

The repo includes `examples/vite-consumer`, a minimal Vite app that installs `@modeless/design-system` from the repo root and imports components, CSS exports, tokens, and types like an outside builder.

```bash
npm run build
npm run example:consumer:install
npm run example:consumer:typecheck
npm run example:consumer:build
```

This fixture should eventually run in CI after the package build.

## Release Gate

Run the local package verification gate before publishing or asking external builders to test a new package artifact:

```bash
npm run verify
```

This checks generated API docs, TypeScript, package build, package dry-run contents, and the checked-in Vite consumer example.

The release gate also runs `npm run public-api:check`, which verifies built declaration files for forbidden helper leaks and required baseline exports.

## Package Contents

The package tarball is intentionally dependency-shaped. It ships `dist`, documentation, README, changelog, license, and package metadata. It does not ship `src` or `registry` by default.

Use the package when you want typed imports, CSS entrypoints, and upgradeable dependency management. Use the repository source/registry path when you want to copy and own components directly.

## Tarball Smoke Test

The packed package has also been verified in a fresh temporary Vite app without a consumer Tailwind config. See `docs/tarball-consumer-smoke-test.md`.

## External Builder Validation

A separate fresh-app validation built a compact operations settings dashboard from the packed package using ordinary app CSS and only public package imports. See `docs/external-builder-validation.md`.
