# Decisions

## Framework

The workspace did not contain an existing application or package, only the visual reference image. I scaffolded a Vite React + TypeScript project because it is lightweight, easy to run locally, and compatible with shadcn-style source components.

## Routing

The demo uses a tiny pathname switch instead of adding a router dependency. This keeps the package small while still supporting the requested demo paths.

## Distribution

The repository is structured as a library-demo hybrid. `design-system/src/components/modeless` is the source users can copy, while Vite runs the documentation/demo app.

## Assets

No moodboard image or copyrighted visual reference is used in the interface. Generative visuals are SVG/CSS-based.

## Fonts

The system uses web-safe fallback stacks first. CSS variables make it easy to swap in IBM Plex Mono, JetBrains Mono, Geist, Inter, or a licensed display face later.

## Corner Geometry

Cards and content sections now use upper-left and lower-right 45 degree cuts through the shared `artifact-angle` utility. Background grids do not use this geometry because they are atmospheric surfaces rather than content containers.

## Animated Grid Exploration

The grid system includes a subtle stationary-grid dark wave, isometric perspective, ASCII texture, and visualizer-style backgrounds. The grid itself does not translate; a blurred dark field and a masked duplicate grid layer move slowly to imply gravity-like distortion about once per minute. These are CSS-first so they remain copyable into shadcn-style projects without adding animation dependencies.
