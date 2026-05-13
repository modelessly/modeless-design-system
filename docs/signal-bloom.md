# SignalBloom

`SignalBloom` is a universal severity morphology visualization. It renders events, entities, risks, delays, anomalies, incidents, states, or threshold breaches as organic bloom glyphs.

It is not train-specific, energy-specific, API-specific, agent-specific, or commerce-specific. Domain meaning belongs in data passed to `items`.

## When To Use

Use `SignalBloom` when a product needs to scan many operational signals and quickly inspect:

- intensity or magnitude
- degradation or abnormality
- disruption, resolution, staleness, or unknown state
- source freshness
- confidence and completeness
- grouped signals across an operational surface

Example domains include API incidents, transit delays, agent workflow anomalies, queue backlogs, logistics exceptions, energy price spikes, infrastructure outages, fraud alerts, support escalation, procurement risk, sensor threshold breaches, model confidence drops, payment failures, marketplace trust events, security warnings, and freshness problems.

## When Not To Use

Do not use `SignalBloom` when users need:

- exact time-series trend analysis
- accounting-grade totals
- stacked composition math
- precise rank comparison
- a table-first audit workflow
- decorative ornament without data meaning

Every visible bloom feature must map to severity, value, state, freshness, confidence, group, trend, source, or selection.

## Data Model

```ts
type SignalBloomDatum = {
  id: string;
  label: string;
  value?: number;
  unit?: string;
  severity?: "none" | "low" | "medium" | "high" | "critical";
  state?: "normal" | "watch" | "active" | "degraded" | "disrupted" | "resolved" | "stale" | "unknown";
  group?: string;
  description?: string;
  cause?: string;
  trend?: "up" | "down" | "flat" | "volatile" | "unknown";
  confidence?: {
    freshness?: number;
    sourceReliability?: number;
    completeness?: number;
    overall?: number;
  };
  source?: {
    label: string;
    url?: string;
    updatedAt?: string;
    freshness?: "live" | "near_real_time" | "hourly" | "daily" | "delayed" | "static" | "simulated" | "unknown";
    license?: string;
    confidence?: SignalBloomConfidence;
  };
  metadata?: Record<string, string | number | boolean | null | undefined>;
};
```

## Visual Encoding

- Bloom size: severity plus optional numeric value.
- Bloom distortion: abnormality, volatility, disruption, and criticality.
- Stem/core: the existence of the item itself.
- Opacity and confidence mark: confidence, completeness, and reliability.
- Hollow ring: resolved state.
- Crosshatch: stale state.
- Dotted or incomplete outline: unknown state.
- Fragmented structure: critical severity.
- Outline and details panel: selection.
- Group sections: `groupBy`.

Color supports the read, but shape, stroke, pattern, text, outline, and metadata carry meaning too.

## Props

Key props:

- `items`: universal `SignalBloomDatum[]`.
- `variant`: `field`, `row`, `cluster`, `radial`, or `compact`.
- `density`: `compact`, `default`, or `dense`.
- `scale`: `linear`, `sqrt`, or `log`.
- `sortBy`: `severity`, `value`, `state`, `group`, `label`, or `none`.
- `groupBy`: `group`, `severity`, `state`, `source`, or `none`.
- `selectedItemId` / `onSelectedItemChange`: controlled selection.
- `showLabels`, `showValues`, `showLegend`, `showSummary`, `showDetails`, `showConfidence`, `showSources`: display controls.
- `motion`: `off`, `subtle`, `live`, or `high`.
- `loading`, `emptyMessage`: required states.

## Accessibility

`SignalBloom` uses a semantic section and summary. Each bloom item is keyboard focusable and exposes a text equivalent for label, severity, state, value, source, and freshness.

Selection is visible through focus, outline, and the details panel. Important details are not hover-only. Motion is never the only carrier of state.

## Motion Behavior

- `off`: no component animation; all labels, states, summaries, source metadata, and details remain visible.
- `subtle`: slow breathing for active non-stale signals.
- `live`: pulsing only when `source.freshness` is `live` or `near_real_time`.
- `high`: stronger demo motion, still restrained and non-strobing.

All modes obey `prefers-reduced-motion`. Text does not animate.

## Data Honesty And Freshness

Do not imply live data unless the source freshness is `live` or `near_real_time`. Stale, delayed, static, simulated, or unknown sources should remain visibly marked through state, source footer, confidence, and details.

The component does not fetch data, store API keys, or know about domain APIs.

## Mapping Domain Data

Map each domain event into `SignalBloomDatum`:

- `label`: human-readable entity or event title.
- `value` and `unit`: delay minutes, affected count, price, error rate, confidence score, risk score, or age.
- `severity`: derived from thresholds.
- `state`: current operational state.
- `group`: region, subsystem, queue, workflow stage, source, or category.
- `cause`: optional normalized reason.
- `trend`: direction or volatility.
- `source`: provider label, freshness, update time, license, and confidence.
- `metadata`: adapter-specific supporting facts.

## Mock Specimens

The design-system page includes four specimens using the same component:

- Generic Incident Field
- Train Delay Bloom
- Agent Workflow Anomalies
- Energy Price / Grid Pressure

The train specimen uses rail labels only in mock data. The component itself has no transport naming or assumptions.

## Future Adapter Opportunities

Adapters should live outside the component. Good future names:

- `normalizeTrafikverketRailEventsToSignalBloom()`
- `normalizeTrafikverketRoadEventsToSignalBloom()`
- `normalizeGtfsRealtimeAlertsToSignalBloom()`
- `normalizeTrafiklabDeparturesToSignalBloom()`
- `normalizeTransitDelayEventsToSignalBloom()`
- `normalizeESettPricesToSignalBloom()`
- `normalizeESettBalanceVolumesToSignalBloom()`
- `normalizeESettGridAreaSignalsToSignalBloom()`
- `normalizeSvkElectricityStatsToSignalBloom()`
- `normalizeSvkSystemStatusToSignalBloom()`
- `normalizeScbMunicipalityContextToSignalBloom()`
- `enrichSignalBloomWithScbRegionContext()`

Source notes for future work:

- Trafikverket Open API can support road incidents, rail disruptions, train delays, traffic events, roadworks, accidents, and disturbances. It requires an API key. Docs: `https://www.trafikverket.se/e-tjanster/trafikverkets-oppna-api-for-trafikinformation/`, `https://www.trafiklab.se/api/other-apis/trafikverket/`, `https://api.trafikinfo.trafikverket.se/v2/data.json`, `https://api.trafikinfo.trafikverket.se/v2/data.xml`.
- Trafiklab APIs can support scheduled and realtime public transport, GTFS Sweden, GTFS-RT vehicle positions, trip updates, and service alerts. Docs: `https://www.trafiklab.se/api/`, `https://www.trafiklab.se/api/gtfs-datasets/gtfs-sweden/`, `https://www.trafiklab.se/api/gtfs-datasets/gtfs-sweden/realtime-specification/`, `https://www.trafiklab.se/api/our-apis/trafiklab-realtime-apis/`.
- eSett Open Data can support Nordic electricity market, balance, metering-grid-area, price, volume, and settlement data. Docs: `https://opendata.esett.com/`, `https://opendata.esett.com/api_info`, `https://api.opendata.esett.com/`, `https://www.esett.com/esett-api/`.
- Svenska kraftnat data can support electricity statistics, system status, consumption, production, and import/export context. Some measured hourly statistics can be delayed, so do not present them as live. Docs: `https://www.svk.se/en/stakeholders-portal/electricity-market/statistics/`, `https://www.svk.se/om-kraftsystemet/kraftsystemdata/`.
- SCB is useful for static regional enrichment and grouping, not live signal freshness. Docs: `https://www.scb.se/en/services/open-data-api/`.
