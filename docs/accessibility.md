# Accessibility

Modeless Design System keeps the visual density without treating usability as optional.

## Contrast

The default theme uses bone text on off-black surfaces and acid-lime or orange accents. When customizing variables, test text contrast on card, terminal, artifact, and popover surfaces.

## Keyboard Focus

Interactive components use visible `focus-visible` rings. Do not remove focus states when composing new variants.

## Motion

Animation utilities are disabled to near-zero duration under `prefers-reduced-motion: reduce`.

Motion should feel like slow telemetry, not an alarm. Prefer long easing curves, low opacity changes, and organic drift. Avoid rapid flicker, hard strobing, jitter, autoplay audio, or effects that block reading.

Visualization components must remain understandable when motion is disabled. Use text labels, legends, shape, and structure; never rely on animation alone to communicate state.

## Readability

Use dense metadata styles for labels and short interface text only. Body text should remain `text-sm` or larger with comfortable line-height.

## ARIA

Icon-only buttons need `aria-label`. Decorative glyphs should be hidden from assistive technology unless they are interactive.
