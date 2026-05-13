# Material 3 Gap Audit

This audit compares the current Modeless component set with Google Material 3 as a maturity benchmark. Material 3 is not the target aesthetic. It is useful here because it separates practical app UI into durable component categories: action, containment, navigation, selection, and text input. Current M3 references also commonly include communication/feedback components.

## Current Modeless Inventory

Modeless currently has strong coverage in:

- Brand/product surfaces: `ProductHero`, `ProductCard`, `ProductStatusBadge`, `ProductMaturityMeter`, `TagList`, `ProductCTACluster`, `StatusLegend`.
- Artifact surfaces: `ModelessPanel`, `ArtifactCard`, `SpecimenCard`, `TerminalBlock`, `CommandSurface`.
- Motion/generative surfaces: `GenerativeField`, `GlyphGrid`, `MotionVisualizationGuide`.
- Advanced visualizations: `AgentTraceMap`, `PromptStackVisualizer`, `ContextWindowHeatmap`, `ConfidenceGradientMatrix`, `HumanAIHandoffTimeline`, `TokenEconomyMeter`, `OnChainFlowGraph`, `SmartContractStateMachine`, `GovernancePulseBoard`, `TrustSurfaceMap`, `SignalBloom`.
- Agentic commerce: authorization, spend, checkout, receipt, payment handshakes, trust boundaries, feed readiness, and machine-payment operations.

The gap is between primitive styling and experimental domain components. Modeless needs a middle layer of ordinary application controls.

## Priority Legend

- `P0`: needed for a working design-system foundation.
- `P1`: needed for common product/app workflows.
- `P2`: useful, but can follow after the foundation stabilizes.
- `Covered`: already has a reasonable Modeless equivalent.
- `Partial`: exists only as a bespoke/page-specific pattern or narrow component.
- `Not priority`: not aligned with the current web/product scope.

## Mapping

| Material 3 area | M3 component | Current Modeless equivalent | Status | Priority | Notes |
| --- | --- | --- | --- | --- | --- |
| Action | Button: filled / tonal / outlined / text / elevated | `ModelessButton` variants | Partial | P0 | Good start, but variants do not map to a documented emphasis scale. Add disabled/loading/icon-only/full-width states. |
| Action | Icon button | Button with lucide icon manually composed | Partial | P0 | Needed as a first-class `IconButton` with sizes, labels, tooltips, pressed state, and destructive variant. |
| Action | Floating action button / extended FAB | None | Missing | P2 | Not core for Modeless web surfaces, but useful for tool canvases and mobile. |
| Action | Segmented button | None | Missing | P0 | Needed for mode switches, density controls, visualization state, and filters. |
| Action | Split button / button group | None | Missing | P1 | Useful for primary action plus menu, export actions, and command alternatives. |
| Containment | Card: elevated / filled / outlined | `ArtifactCard`, `ProductCard`, `SpecimenCard`, `ModelessPanel` | Partial | P0 | Existing cards are domain-specific. Add generic `Card`, `CardHeader`, `CardContent`, `CardFooter`, `CardMedia`. |
| Containment | List row: one-line / two-line / three-line / leading icon/avatar / trailing action | None | Missing | P0 | This is one of the largest practical gaps. Needed for settings, logs, search results, navigation, and command output. |
| Containment | Divider | Border utilities only | Missing | P0 | Add a semantic `Divider` with orientation, inset, label, and artifact styling. |
| Containment | Bottom sheet | None | Missing | P1 | Useful on mobile and inspection workflows. Could be `Sheet` with side/bottom placement. |
| Containment | Side sheet | Page-specific side panels | Partial | P1 | Rail inspector and details panels repeat this need. Add `SideSheet`/`InspectorPanel`. |
| Containment | Carousel | None | Missing | P2 | Not essential unless product gallery/storytelling surfaces grow. |
| Containment | Data table | None | Missing | P1 | Needed for admin/ops views; keep restrained and dense, not decorative. |
| Communication | Badge | `SignalBadge`, `ProductStatusBadge` | Covered | Covered | Good coverage, though a generic `Badge` would reduce product-specific reuse pressure. |
| Communication | Dialog | None | Missing | P0 | Required for confirmation, destructive actions, command review, and details. Needs accessibility/focus trap. |
| Communication | Snackbar / toast | None | Missing | P0 | Needed for save states, copy feedback, background task results. |
| Communication | Tooltip | None | Missing | P0 | Required for icon-only controls and dense toolbars. |
| Communication | Progress indicator: linear / circular | Ad hoc bars in components | Partial | P0 | Add generic progress for loading, confidence, quota, completion. |
| Communication | Banner | None | Missing | P1 | Useful for persistent warnings, source freshness, beta notices. |
| Navigation | Top app bar | `ModelessShell` header/nav | Partial | P0 | Current shell is site-specific. Add reusable `TopBar`/`AppBar` with title, nav icon, actions, compact/large variants. |
| Navigation | Bottom app bar / navigation bar | None | Missing | P2 | Mobile app-like surfaces may need it later. |
| Navigation | Navigation drawer | None | Missing | P1 | Needed for larger app/admin shells. |
| Navigation | Navigation rail | None | Missing | P1 | Strong fit for Modeless desktop tools. |
| Navigation | Tabs: primary / secondary | None | Missing | P0 | Required for settings, details, docs, inspectors, and dashboard sections. |
| Navigation | Menus | `CommandSurface` is command-search style only | Partial | P0 | Need generic `Menu`, `DropdownMenu`, `ContextMenu`, option groups, check/radio items. |
| Navigation | Search | `FilterBar` page-local | Partial | P0 | Add `SearchField` and optionally `SearchCommand` for command palettes. |
| Navigation | Breadcrumbs | None | Missing | P1 | Useful for docs/product/detail navigation. |
| Selection | Checkbox | None | Missing | P0 | Required for forms, tables, batch actions, settings. |
| Selection | Radio button | None | Missing | P0 | Required for exclusive choices and form groups. |
| Selection | Switch | None | Missing | P0 | Required for settings and binary feature flags. |
| Selection | Chips: assist / filter / input / suggestion | `TagList`, `SignalBadge` | Partial | P0 | Add interactive `Chip` family; `TagList` should remain display-only. |
| Selection | Slider | None | Missing | P1 | Needed for numeric settings, thresholds, visualization tuning. |
| Selection | Menu select / dropdown | Native `select` in `FilterBar` | Partial | P0 | Add styled `Select` for forms and filters. |
| Selection | Date picker | None | Missing | P2 | Useful later; high implementation complexity. |
| Selection | Time picker | None | Missing | P2 | Same as date picker. |
| Text input | Text field: filled / outlined | Page-local native input styles | Missing | P0 | Add `TextField` with label, help, error, icon, disabled, required, and validation state. |
| Text input | Text area / multiline | None | Missing | P0 | Needed for prompts, comments, descriptions, feedback. |
| Text input | Password / sensitive input | None | Missing | P1 | Useful for local-only keys and credentials; must include visibility controls and safety copy. |
| Text input | Form field / form group | None | Missing | P0 | Needed as the compositional layer around controls. |
| Layout/adaptive | Responsive grid / stack primitives | Tailwind utilities only | Missing | P1 | Not a Material component, but needed for consistency. Add `Stack`, `Cluster`, `Grid`, `Inset` only if they do not fight Tailwind. |
| Feedback state | Empty state | `SignalBloomEmpty` internal only | Partial | P0 | Add generic `EmptyState` for tables, lists, filters, and panels. |
| Feedback state | Loading skeleton | `SignalBloom` internal only | Partial | P0 | Add `Skeleton`, `LoadingBlock`, or `LoadingState`. |
| Feedback state | Error state | Page-local copy only | Missing | P0 | Add reusable `ErrorState` with retry action and source/error metadata. |

## Recommended Build Order

### Phase 1: App Foundation

Build the core middle layer:

- `TextField`
- `TextArea`
- `FormField`
- `Checkbox`
- `RadioGroup`
- `Switch`
- `Select`
- `SegmentedControl`
- `Tabs`
- `Tooltip`
- `Dialog`
- `Toast`
- `Progress`
- `List`
- `Divider`
- `Card`
- `EmptyState`
- `LoadingState`
- `ErrorState`

These unlock most ordinary app screens.

### Phase 2: Navigation And Dense Tools

Build the shell/navigation layer:

- `AppBar`
- `NavigationRail`
- `NavigationDrawer`
- `SearchField`
- `Menu`
- `DropdownMenu`
- `Breadcrumbs`
- `DataTable`
- `InspectorPanel` or `SideSheet`

These make Modeless suitable for dashboards, editors, operations views, and internal tools.

### Phase 3: Advanced Interaction

Build only after real use cases appear:

- `FAB`
- `BottomNavigation`
- `BottomSheet`
- `Carousel`
- `DatePicker`
- `TimePicker`
- `Slider`
- `SplitButton`

## Proposed Modeless Naming

Avoid copying Material names when the Modeless version has a different purpose, but keep conventional names where users expect them.

Recommended names:

- `ModelessCard`
- `ModelessList`
- `ModelessListItem`
- `ModelessTextField`
- `ModelessTextArea`
- `ModelessFormField`
- `ModelessCheckbox`
- `ModelessRadioGroup`
- `ModelessSwitch`
- `ModelessSelect`
- `ModelessSegmentedControl`
- `ModelessTabs`
- `ModelessDialog`
- `ModelessToast`
- `ModelessTooltip`
- `ModelessProgress`
- `ModelessAppBar`
- `ModelessNavigationRail`
- `ModelessNavigationDrawer`
- `ModelessMenu`
- `ModelessDataTable`
- `ModelessEmptyState`
- `ModelessLoadingState`
- `ModelessErrorState`

## Key Design Direction

The missing components should not become Material replicas. They should adopt Modeless visual language:

- artifact-angle geometry where it helps frame content
- square/technical controls rather than pill-heavy Material shapes
- visible focus states and keyboard-first behavior
- restrained motion only for state change, source freshness, or system activity
- text-first accessibility
- dense but readable layouts for operational tools

The goal is Material-level coverage with Modeless-level character.
