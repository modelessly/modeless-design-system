# Operational Workflows

This guidance covers long-running local and background work such as imports, exports, builds, dataset preparation, media processing, and attachment uploads. The pattern was validated in a local-first desktop processing utility and intentionally contains no product-specific workflow.

## Task State Mapping

Compose operational status from existing primitives rather than creating a separate lifecycle component. This keeps task logic in the application while `SignalBadge`, `ModelessProgress`, buttons, toast, and `ModelessDropzone` provide a consistent visual language.

| Lifecycle state | Badge / surface treatment | Progress | Controls |
| --- | --- | --- | --- |
| Waiting / idle | `archived` or muted copy | `muted`, `0` | Select/import enabled; run disabled until input exists. |
| Loaded / ready | `SignalBadge variant="ready"` | `muted`, `0` | Run enabled; source may be replaced. |
| Processing / active | `SignalBadge variant="live"` | default tone, acid lime | Disable source and destination changes; keep cancel available when supported. |
| Complete / successful | `SignalBadge variant="success"` | `tone="success"`, usually `100` | Static result actions enabled; permit a new run. |
| Warning | `SignalBadge variant="warning"` | `tone="warning"` when progress remains meaningful | Explain recovery path. |
| Error / cancelled | `SignalBadge variant="error"` or error surface | stop or remove progress | Restore editable controls and offer retry. |

Acid lime means active, selected, connected, or live. Completion green means finished successfully. A completed task must not pulse or retain active-lime status just because it reached 100%.

```tsx
<SignalBadge variant={running ? "live" : done ? "success" : "archived"}>
  {running ? "processing" : done ? "complete" : "waiting"}
</SignalBadge>
<ModelessProgress
  label="Import task"
  value={done ? 100 : running ? progress : 0}
  tone={done ? "success" : running ? "default" : "muted"}
/>
<ModelessButton disabled={running}>Choose source</ModelessButton>
```

## Motion

- Active work may apply a quiet pulse or changing status text to an indicator or progress fill.
- Do not flash, fade, or animate the clipped frame border. Stable geometry keeps operational layouts legible.
- Loaded, complete, warning, and error states are static unless new work begins.
- Under `prefers-reduced-motion: reduce`, preserve labels and tones and remove nonessential movement.

## Local File Import

`ModelessDropzone` is a Foundation Component for local sources. It supports picker selection and native file drag/drop without assuming a file domain.

```tsx
<ModelessDropzone
  label="Source file"
  description="Drag a local document here or choose a file. Accepted: PDF, CSV."
  accept=".pdf,.csv"
  fileName={fileName}
  state={error ? "error" : fileName ? "loaded" : "idle"}
  error={error}
  disabled={running}
  onSelect={handleFiles}
  onDrop={handleFiles}
/>
```

Usage requirements:

- Label the source and state accepted types in text; do not rely only on the file dialog filter.
- Validate both selected and dropped files in application code, then provide an actionable `error`.
- Disable source replacement while active work depends on the selected file.
- Use `fileName` for the selected local item; do not imply the file has been uploaded when processing is local.
- The file picker remains keyboard-operable through the native input; drag/drop is an additional pointer path.

## Destination Folder Composition

A destination path does not need a new component yet. Compose a read-only `ModelessTextField` with an adjacent `ModelessButton`; the application owns the desktop folder picker and permission handling.

```tsx
<div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
  <ModelessTextField
    label="Destination folder"
    value={destinationPath || "Default location"}
    description="Output stays on this device."
    readOnly
    disabled={running}
  />
  <ModelessButton variant="outline" disabled={running} onClick={chooseFolder}>
    Choose folder
  </ModelessButton>
</div>
```

Show the default location before selection, show the chosen path afterward, and disable both field and chooser while a running task must retain a stable output destination. A dedicated path component would become worthwhile only if several consumers need shared native-picker integration, truncation disclosure, or permission/error behavior.

## Clipped Frames

`artifact-angle-frame` is the shared angled-border utility for panels, cards, dialogs, terminal blocks, and the dropzone. It draws full-length horizontal and vertical 1px edges beneath the clipped polygon and adds the two angled strokes; clipping, rather than fractional segment endpoints, determines joins. This avoids small gaps at the bottom or corner joins as element widths round differently between rendering engines.

Visual checks after geometry changes should cover:

- Chrome and Safari on macOS when available.
- Narrow and wide panels, including widths that produce fractional layout pixels.
- Default, terminal, warning, success, and focus/hover border tones.
- Retina/high-DPI display output where practical.

## Implementation Note

A local-first desktop processing utility commonly combines a source drop area, a destination folder field, an active progress readout, and a final confirmation. Modeless should express that workflow through generic operational primitives: local import is not tied to media, successful completion is not liveness, and desktop paths are not upload fields. This composition also applies to dataset imports, archive exports, offline conversions, and local build tasks.
