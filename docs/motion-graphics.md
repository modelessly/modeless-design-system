# Motion Graphics

Modeless motion graphics should feel alive, technical, and controlled. They should behave like an instrument panel, not a promotional animation.

## Intensity Scale

```tsx
<GenerativeField motion="subtle" />
```

Supported values:

- `off`
- `subtle`
- `live`
- `high`

## Defaults

Use `subtle` unless there is a clear reason not to.

Use `live` for:

- hero visualizations
- active inspection surfaces
- primary product graphics
- selected or current workflow states

Use `high` for:

- demos
- controlled experiments
- motion studies

Do not use `high` as a default for production pages.

## Timing

Recommended ranges:

- interface transition: `120ms` to `700ms`
- telemetry pulse: `9s` to `14s`
- route trace: `22s` to `32s`
- ambient drift: `24s` to `36s`
- grid gravity/wave: `60s` or slower

## Easing

Use:

- `ease-in-out` for ambient telemetry
- `cubic-bezier(0.2, 0.8, 0.2, 1)` for interface reveals
- `linear` only for orbital or directional motion where constant speed is meaningful

Avoid:

- bouncy easing
- aggressive elastic motion
- fast stepped flicker

## Reduced Motion

All motion classes must obey:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.001ms !important;
  }
}
```

## Forbidden Effects

- audio
- strobe
- jitter
- rapid scanline flicker
- fake loading loops with no state change
- motion that moves text while reading
- motion that implies real-time data when the data is static
