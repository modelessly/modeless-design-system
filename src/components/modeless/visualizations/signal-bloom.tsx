import * as React from "react";
import { AlertTriangle, CircleDashed, Info, Radio, ShieldCheck } from "lucide-react";
import { cn } from "../../../lib/utils";
import type { ModelessMotionIntensity } from "../../../tokens";
import { percent, VisualizationFrame } from "./shared";

export type SignalBloomSeverity = "none" | "low" | "medium" | "high" | "critical";

export type SignalBloomState =
  | "normal"
  | "watch"
  | "active"
  | "degraded"
  | "disrupted"
  | "resolved"
  | "stale"
  | "unknown";

export type SignalBloomFreshness = "live" | "near_real_time" | "hourly" | "daily" | "delayed" | "static" | "simulated" | "unknown";

export type SignalBloomConfidence = {
  freshness?: number;
  sourceReliability?: number;
  completeness?: number;
  overall?: number;
};

export type SignalBloomSource = {
  label: string;
  url?: string;
  updatedAt?: string;
  freshness?: SignalBloomFreshness;
  license?: string;
  confidence?: SignalBloomConfidence;
};

export type SignalBloomDatum = {
  id: string;
  label: string;
  value?: number;
  unit?: string;
  severity?: SignalBloomSeverity;
  state?: SignalBloomState;
  group?: string;
  description?: string;
  cause?: string;
  trend?: "up" | "down" | "flat" | "volatile" | "unknown";
  confidence?: SignalBloomConfidence;
  source?: SignalBloomSource;
  metadata?: Record<string, string | number | boolean | null | undefined>;
};

export type SignalBloomProps = React.HTMLAttributes<HTMLDivElement> & {
  items: SignalBloomDatum[];
  variant?: "field" | "row" | "cluster" | "radial" | "compact";
  density?: "compact" | "default" | "dense";
  scale?: "linear" | "sqrt" | "log";
  sortBy?: "severity" | "value" | "state" | "group" | "label" | "none";
  groupBy?: "group" | "severity" | "state" | "source" | "none";
  selectedItemId?: string;
  onSelectedItemChange?: (id: string | null) => void;
  showLabels?: boolean;
  showValues?: boolean;
  showLegend?: boolean;
  showSummary?: boolean;
  showDetails?: boolean;
  showConfidence?: boolean;
  showSources?: boolean;
  motion?: ModelessMotionIntensity;
  loading?: boolean;
  emptyMessage?: string;
};

const severityRank: Record<SignalBloomSeverity, number> = {
  none: 0,
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

const stateRank: Record<SignalBloomState, number> = {
  normal: 0,
  resolved: 1,
  watch: 2,
  active: 3,
  degraded: 4,
  stale: 5,
  disrupted: 6,
  unknown: 7,
};

const severityLabel: Record<SignalBloomSeverity, string> = {
  none: "none",
  low: "low",
  medium: "medium",
  high: "high",
  critical: "critical",
};

const stateLabel: Record<SignalBloomState, string> = {
  normal: "normal",
  watch: "watch",
  active: "active",
  degraded: "degraded",
  disrupted: "disrupted",
  resolved: "resolved",
  stale: "stale",
  unknown: "unknown",
};

const freshnessLabel: Record<SignalBloomFreshness, string> = {
  live: "live",
  near_real_time: "near real time",
  hourly: "hourly",
  daily: "daily",
  delayed: "delayed",
  static: "static",
  simulated: "simulated",
  unknown: "unknown",
};

const severityTone: Record<SignalBloomSeverity, string> = {
  none: "hsl(var(--muted-foreground))",
  low: "hsl(var(--primary))",
  medium: "hsl(var(--radar-blue))",
  high: "hsl(var(--warning))",
  critical: "hsl(var(--signal-pink))",
};

const stateOutline: Record<SignalBloomState, string | undefined> = {
  normal: undefined,
  watch: "2 3",
  active: undefined,
  degraded: "7 3",
  disrupted: "4 2 1 2",
  resolved: undefined,
  stale: "1 4",
  unknown: "2 5",
};

export function SignalBloom({
  items,
  variant = "field",
  density = "default",
  scale = "sqrt",
  sortBy = "severity",
  groupBy = "none",
  selectedItemId,
  onSelectedItemChange,
  showLabels = true,
  showValues = true,
  showLegend = true,
  showSummary = true,
  showDetails = true,
  showConfidence = true,
  showSources = true,
  motion = "subtle",
  loading,
  emptyMessage = "No signals to show.",
  className,
  ...props
}: SignalBloomProps) {
  const headingId = React.useId();
  const summaryId = React.useId();
  const [internalSelectedId, setInternalSelectedId] = React.useState<string | null>(items[0]?.id ?? null);
  const selectedId = selectedItemId !== undefined ? selectedItemId : internalSelectedId;

  React.useEffect(() => {
    if (!items.length) {
      setInternalSelectedId(null);
      return;
    }
    if (selectedItemId === undefined && selectedId && !items.some((item) => item.id === selectedId)) {
      setInternalSelectedId(items[0]?.id ?? null);
    }
  }, [items, selectedId, selectedItemId]);

  const orderedItems = React.useMemo(() => sortItems(items, sortBy), [items, sortBy]);
  const groups = React.useMemo(() => groupItems(orderedItems, groupBy), [orderedItems, groupBy]);
  const selectedItem = items.find((item) => item.id === selectedId) ?? null;
  const summary = getSummary(items);

  const updateSelected = (id: string | null) => {
    if (selectedItemId === undefined) setInternalSelectedId(id);
    onSelectedItemChange?.(id);
  };

  if (loading) {
    return (
      <VisualizationFrame title="Signal Bloom" eyebrow="severity morphology / loading" motion={motion} className={className} {...props}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-busy="true" aria-live="polite">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="artifact-angle artifact-angle-sm artifact-angle-frame border border-border bg-background p-3">
              <div className={cn("mx-auto h-20 w-20 rounded-full border border-border bg-muted", motion !== "off" && "motion-data-node")} style={{ "--motion-index": index } as React.CSSProperties} />
              <div className="mt-3 h-3 w-2/3 bg-muted" />
              <div className="mt-2 h-2 w-1/2 bg-muted" />
            </div>
          ))}
        </div>
      </VisualizationFrame>
    );
  }

  if (!items.length) {
    return (
      <VisualizationFrame title="Signal Bloom" eyebrow="severity morphology / empty" motion={motion} className={className} {...props}>
        <div className="grid min-h-48 place-items-center border border-dashed border-border bg-background p-6 text-center">
          <div>
            <CircleDashed aria-hidden={true} className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 font-display text-2xl uppercase leading-none">{emptyMessage}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Provide universal event data to render severity, state, confidence, and freshness.</p>
          </div>
        </div>
      </VisualizationFrame>
    );
  }

  return (
    <VisualizationFrame
      title="Signal Bloom"
      eyebrow={`${variant} / ${items.length} signals`}
      motion={motion}
      className={cn("signal-bloom", className)}
      aria-labelledby={headingId}
      aria-describedby={summaryId}
      {...props}
    >
      <div className="grid gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 id={headingId} className="sr-only">Signal Bloom</h3>
            {showSummary ? <SignalBloomSummary items={items} summaryId={summaryId} /> : <p id={summaryId} className="sr-only">{summary.screenReader}</p>}
          </div>
          {showLegend ? <SignalBloomLegend /> : null}
        </div>

        <div className={cn("grid gap-4", showDetails && "xl:grid-cols-[1fr_18rem]")}>
          <div className="grid gap-3">
            {groups.map((group) => (
              <section key={group.label} className="border border-border bg-background p-3" aria-label={`${group.label} group`}>
                {groupBy !== "none" ? (
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2">
                    <h4 className="font-display text-xl uppercase leading-none">{group.label}</h4>
                    <span className="text-micro text-muted-foreground">{group.items.length} signals</span>
                  </div>
                ) : null}
                <div className={getLayoutClass(variant, density)} role="list" aria-label="Signal bloom items">
                  {group.items.map((item, index) => (
                    <SignalBloomItem
                      key={item.id}
                      item={item}
                      index={index}
                      selected={item.id === selectedId}
                      onSelect={() => updateSelected(item.id === selectedId ? null : item.id)}
                      showLabels={showLabels}
                      showValues={showValues}
                      showConfidence={showConfidence}
                      motion={motion}
                      scale={scale}
                      density={density}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>

          {showDetails ? <SignalBloomDetails item={selectedItem} showConfidence={showConfidence} showSources={showSources} onClear={() => updateSelected(null)} /> : null}
        </div>

        {showSources ? <SignalBloomSourceFooter items={items} /> : null}
      </div>
    </VisualizationFrame>
  );
}

function SignalBloomSummary({ items, summaryId }: { items: SignalBloomDatum[]; summaryId: string }) {
  const summary = getSummary(items);
  return (
    <div id={summaryId} className="grid gap-2 sm:grid-cols-4">
      <SummaryCell label="signals" value={String(items.length)} />
      <SummaryCell label="critical / high" value={`${summary.critical} / ${summary.high}`} />
      <SummaryCell label="stale or unknown" value={String(summary.staleOrUnknown)} />
      <SummaryCell label="avg confidence" value={`${Math.round(summary.averageConfidence * 100)}%`} />
      <p className="sr-only">{summary.screenReader}</p>
    </div>
  );
}

function SummaryCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border bg-card px-3 py-2">
      <p className="text-micro text-muted-foreground">{label}</p>
      <p className="font-display text-2xl uppercase leading-none">{value}</p>
    </div>
  );
}

function SignalBloomLegend() {
  return (
    <div className="grid min-w-56 grid-cols-2 gap-1 text-micro text-muted-foreground" aria-label="Signal bloom legend">
      {(["none", "low", "medium", "high", "critical"] as SignalBloomSeverity[]).map((severity) => (
        <div key={severity} className="flex items-center gap-1.5">
          <span className={cn("h-2.5 w-2.5 border", severity === "critical" ? "rotate-45" : "rounded-full")} style={{ borderColor: severityTone[severity], background: `color-mix(in srgb, ${severityTone[severity]} 42%, transparent)` }} />
          {severityLabel[severity]}
        </div>
      ))}
      <div className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full border border-muted-foreground opacity-45" />
        resolved
      </div>
    </div>
  );
}

function SignalBloomItem({
  item,
  index,
  selected,
  onSelect,
  showLabels,
  showValues,
  showConfidence,
  motion,
  scale,
  density,
}: {
  item: SignalBloomDatum;
  index: number;
  selected: boolean;
  onSelect: () => void;
  showLabels: boolean;
  showValues: boolean;
  showConfidence: boolean;
  motion: ModelessMotionIntensity;
  scale: SignalBloomProps["scale"];
  density: SignalBloomProps["density"];
}) {
  const severity = item.severity ?? "none";
  const state = item.state ?? "unknown";
  const confidence = confidenceScore(item.confidence ?? item.source?.confidence);
  const freshness = item.source?.freshness ?? "unknown";
  const isLive = freshness === "live" || freshness === "near_real_time";
  const canPulse = motion !== "off" && state !== "stale" && state !== "resolved" && state !== "unknown" && (motion === "high" || (motion === "live" && isLive) || motion === "subtle");
  const label = describeItem(item);

  return (
    <button
      type="button"
      role="listitem"
      aria-pressed={selected}
      aria-label={label}
      onClick={onSelect}
      className={cn(
        "group grid min-w-0 gap-2 border bg-card p-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        selected ? "border-primary shadow-[0_0_0_1px_hsl(var(--primary)/0.45),0_0_28px_hsl(var(--primary)/0.12)]" : "border-border hover:border-primary/70",
        density === "compact" && "p-1.5",
      )}
    >
      <div className="relative mx-auto aspect-square w-full max-w-28">
        <SignalBloomGlyph item={item} index={index} selected={selected} confidence={confidence} scale={scale} pulsing={canPulse} />
        {showConfidence ? <SignalBloomConfidenceMark value={confidence} className="absolute right-0 top-0" /> : null}
      </div>
      {showLabels || showValues ? (
        <div className="min-w-0">
          {showLabels ? <p className="truncate text-xs font-medium text-foreground">{item.label}</p> : null}
          <p className="mt-0.5 flex flex-wrap items-center gap-1 text-micro text-muted-foreground">
            <span>{severityLabel[severity]}</span>
            <span aria-hidden={true}>/</span>
            <span>{stateLabel[state]}</span>
            {showValues && item.value !== undefined ? (
              <>
                <span aria-hidden={true}>/</span>
                <span>{formatValue(item)}</span>
              </>
            ) : null}
          </p>
        </div>
      ) : null}
    </button>
  );
}

function SignalBloomGlyph({
  item,
  index,
  selected,
  confidence,
  scale,
  pulsing,
}: {
  item: SignalBloomDatum;
  index: number;
  selected: boolean;
  confidence: number;
  scale: SignalBloomProps["scale"];
  pulsing: boolean;
}) {
  const severity = item.severity ?? "none";
  const state = item.state ?? "unknown";
  const radius = glyphRadius(item, scale);
  const tone = severityTone[severity];
  const opacity = state === "resolved" ? 0.34 : state === "stale" ? 0.42 : 0.48 + confidence * 0.42;
  const path = bloomPath(radius, severity, state, item.trend);
  const patternId = React.useId().replace(/:/g, "");
  const isHollow = state === "resolved";
  const isStale = state === "stale";
  const isUnknown = state === "unknown";

  return (
    <svg viewBox="0 0 120 120" role="img" aria-label={describeItem(item)} className="h-full w-full overflow-visible">
      <defs>
        <pattern id={`${patternId}-hatch`} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="7" stroke="hsl(var(--muted-foreground))" strokeWidth="1" opacity="0.55" />
        </pattern>
      </defs>
      <line x1="60" y1="104" x2="60" y2={64 - radius * 0.24} stroke="hsl(var(--border))" strokeWidth="1.4" strokeLinecap="round" aria-hidden={true} />
      <g className={pulsing ? "motion-data-node" : undefined} style={{ "--motion-index": index } as React.CSSProperties}>
        <path
          d={path}
          fill={isHollow ? "transparent" : isStale ? `url(#${patternId}-hatch)` : tone}
          fillOpacity={isHollow ? 0 : opacity}
          stroke={tone}
          strokeWidth={selected || severity === "critical" ? 3 : 1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={stateOutline[state]}
        />
        {severity === "critical" ? (
          <>
            <path d="M60 21 L65 38 L55 38 Z" fill="hsl(var(--background))" stroke={tone} strokeWidth="1.5" opacity="0.86" />
            <path d="M91 55 L75 61 L77 50 Z" fill="hsl(var(--background))" stroke={tone} strokeWidth="1.5" opacity="0.74" />
            <path d="M35 77 L47 68 L49 82 Z" fill="hsl(var(--background))" stroke={tone} strokeWidth="1.5" opacity="0.72" />
          </>
        ) : null}
        {isUnknown ? (
          <circle cx="60" cy="60" r={Math.max(9, radius * 0.34)} fill="transparent" stroke="hsl(var(--foreground))" strokeWidth="1.4" strokeDasharray="1 4" opacity="0.72" />
        ) : null}
        <circle cx="60" cy="60" r={Math.max(5, radius * 0.18)} fill="hsl(var(--background))" stroke={tone} strokeWidth="1.5" />
        {selected ? <circle cx="60" cy="60" r={radius + 12} fill="transparent" stroke="hsl(var(--primary))" strokeWidth="1.4" strokeDasharray="3 4" /> : null}
      </g>
      <circle cx="60" cy="104" r="3.5" fill={tone} opacity={state === "resolved" ? 0.36 : 0.82} aria-hidden={true} />
    </svg>
  );
}

function SignalBloomConfidenceMark({ value, className }: { value: number; className?: string }) {
  const rounded = Math.round(value * 100);
  return (
    <span className={cn("grid h-7 w-7 place-items-center border border-border bg-background font-mono text-[0.58rem] text-muted-foreground", className)} title={`Confidence ${rounded}%`}>
      {rounded}
    </span>
  );
}

function SignalBloomDetails({
  item,
  showConfidence,
  showSources,
  onClear,
}: {
  item: SignalBloomDatum | null;
  showConfidence: boolean;
  showSources: boolean;
  onClear: () => void;
}) {
  if (!item) {
    return (
      <aside className="border border-border bg-card p-4">
        <Info aria-hidden={true} className="h-5 w-5 text-muted-foreground" />
        <p className="mt-3 font-display text-2xl uppercase leading-none">No selection</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Select a signal to inspect its state, source, confidence, and metadata.</p>
      </aside>
    );
  }

  const severity = item.severity ?? "none";
  const state = item.state ?? "unknown";
  const confidence = confidenceScore(item.confidence ?? item.source?.confidence);

  return (
    <aside className="grid content-start gap-3 border border-primary/60 bg-card p-4" aria-label={`Selected signal details for ${item.label}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-micro text-muted-foreground">selected signal</p>
          <h4 className="mt-1 font-display text-2xl uppercase leading-none">{item.label}</h4>
        </div>
        <button type="button" onClick={onClear} className="border border-border px-2 py-1 text-micro text-muted-foreground hover:border-primary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          clear
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2 text-micro">
        <DetailCell label="severity" value={severityLabel[severity]} />
        <DetailCell label="state" value={stateLabel[state]} />
        {item.value !== undefined ? <DetailCell label="value" value={formatValue(item)} /> : null}
        {item.trend ? <DetailCell label="trend" value={item.trend} /> : null}
      </div>
      {item.description || item.cause ? (
        <div className="border-l border-border pl-3 text-sm leading-6 text-muted-foreground">
          {item.description ? <p>{item.description}</p> : null}
          {item.cause ? <p className="mt-2 text-xs leading-5">Cause: {item.cause}</p> : null}
        </div>
      ) : null}
      {showConfidence ? (
        <div className="grid gap-2">
          <div className="flex items-center gap-2 text-primary">
            <ShieldCheck aria-hidden={true} className="h-4 w-4" />
            <span className="text-micro">confidence</span>
          </div>
          <ConfidenceBars confidence={item.confidence ?? item.source?.confidence} fallback={confidence} />
        </div>
      ) : null}
      {showSources && item.source ? <SourceBlock source={item.source} /> : null}
      {item.metadata ? (
        <dl className="grid gap-1 border-t border-border pt-3 text-micro text-muted-foreground">
          {Object.entries(item.metadata).map(([key, value]) => value !== undefined && value !== null ? (
            <div key={key} className="flex justify-between gap-3">
              <dt>{key}</dt>
              <dd className="text-right text-foreground">{String(value)}</dd>
            </div>
          ) : null)}
        </dl>
      ) : null}
    </aside>
  );
}

function DetailCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border bg-background p-2">
      <p className="text-muted-foreground">{label}</p>
      <p className="mt-1 text-foreground">{value}</p>
    </div>
  );
}

function ConfidenceBars({ confidence, fallback }: { confidence?: SignalBloomConfidence; fallback: number }) {
  const entries = [
    ["overall", confidence?.overall ?? fallback],
    ["freshness", confidence?.freshness],
    ["source", confidence?.sourceReliability],
    ["complete", confidence?.completeness],
  ] as const;

  return (
    <div className="grid gap-1">
      {entries.map(([label, value]) => value !== undefined ? (
        <div key={label} className="grid grid-cols-[4.5rem_1fr_2.25rem] items-center gap-2 text-micro text-muted-foreground">
          <span>{label}</span>
          <span className="h-2 border border-border bg-background">
            <span className="block h-full bg-primary" style={{ width: percent(Math.round(value * 100)), opacity: 0.38 + value * 0.62 }} />
          </span>
          <span className="text-right">{Math.round(value * 100)}</span>
        </div>
      ) : null)}
    </div>
  );
}

function SourceBlock({ source }: { source: SignalBloomSource }) {
  const freshness = source.freshness ?? "unknown";
  return (
    <div className="grid gap-2 border border-border bg-background p-3 text-xs leading-5 text-muted-foreground">
      <div className="flex items-center gap-2 text-foreground">
        {freshness === "live" || freshness === "near_real_time" ? <Radio aria-hidden={true} className="h-4 w-4 text-primary" /> : <AlertTriangle aria-hidden={true} className="h-4 w-4 text-muted-foreground" />}
        {source.url ? (
          <a href={source.url} target="_blank" rel="noopener noreferrer" className="underline decoration-border underline-offset-4 hover:text-primary">
            {source.label}
          </a>
        ) : (
          <span>{source.label}</span>
        )}
      </div>
      <p>Freshness: {freshnessLabel[freshness]}</p>
      {source.updatedAt ? <p>Updated: {source.updatedAt}</p> : null}
      {source.license ? <p>License: {source.license}</p> : null}
    </div>
  );
}

function SignalBloomSourceFooter({ items }: { items: SignalBloomDatum[] }) {
  const sources = uniqueSources(items);
  if (!sources.length) return null;

  return (
    <footer className="flex flex-wrap gap-2 border-t border-border pt-3 text-micro text-muted-foreground" aria-label="Signal bloom data sources">
      {sources.map((source) => (
        <span key={`${source.label}-${source.freshness ?? "unknown"}`} className="border border-border bg-background px-2 py-1">
          {source.label} / {freshnessLabel[source.freshness ?? "unknown"]}
        </span>
      ))}
    </footer>
  );
}

function getLayoutClass(variant: NonNullable<SignalBloomProps["variant"]>, density: NonNullable<SignalBloomProps["density"]>) {
  if (variant === "row") return "grid grid-flow-col auto-cols-[minmax(7rem,1fr)] gap-2 overflow-x-auto pb-1";
  if (variant === "compact") return "grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6";
  if (variant === "radial") return "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5";
  if (variant === "cluster") return "grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4";
  return cn("grid gap-2", density === "dense" ? "grid-cols-3 sm:grid-cols-4 lg:grid-cols-6" : density === "compact" ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4");
}

function sortItems(items: SignalBloomDatum[], sortBy: NonNullable<SignalBloomProps["sortBy"]>) {
  const sorted = [...items];
  switch (sortBy) {
    case "severity":
      return sorted.sort((a, b) => severityRank[b.severity ?? "none"] - severityRank[a.severity ?? "none"]);
    case "value":
      return sorted.sort((a, b) => (b.value ?? -Infinity) - (a.value ?? -Infinity));
    case "state":
      return sorted.sort((a, b) => stateRank[b.state ?? "unknown"] - stateRank[a.state ?? "unknown"]);
    case "group":
      return sorted.sort((a, b) => (a.group ?? "").localeCompare(b.group ?? ""));
    case "label":
      return sorted.sort((a, b) => a.label.localeCompare(b.label));
    default:
      return sorted;
  }
}

function groupItems(items: SignalBloomDatum[], groupBy: NonNullable<SignalBloomProps["groupBy"]>) {
  if (groupBy === "none") return [{ label: "all signals", items }];
  const map = new Map<string, SignalBloomDatum[]>();
  for (const item of items) {
    const key =
      groupBy === "group"
        ? item.group ?? "ungrouped"
        : groupBy === "severity"
          ? item.severity ?? "none"
          : groupBy === "state"
            ? item.state ?? "unknown"
            : item.source?.label ?? "unsourced";
    map.set(key, [...(map.get(key) ?? []), item]);
  }
  return Array.from(map, ([label, groupItems]) => ({ label, items: groupItems }));
}

function glyphRadius(item: SignalBloomDatum, scale: SignalBloomProps["scale"]) {
  const severity = item.severity ?? "none";
  const value = Math.max(0, item.value ?? severityRank[severity] * 24);
  const scaled = scale === "log" ? Math.log10(value + 1) / 2 : scale === "linear" ? value / 100 : Math.sqrt(value) / 10;
  return Math.max(13, Math.min(39, 13 + severityRank[severity] * 4.8 + scaled * 18));
}

function bloomPath(radius: number, severity: SignalBloomSeverity, state: SignalBloomState, trend: SignalBloomDatum["trend"]) {
  const points = severity === "critical" ? 16 : severity === "high" ? 14 : severity === "medium" ? 12 : 10;
  const distortion = state === "disrupted" ? 0.42 : severity === "critical" ? 0.36 : trend === "volatile" ? 0.28 : state === "unknown" ? 0.2 : 0.12;
  const missingArc = state === "unknown" ? 2 : 0;
  const commands: string[] = [];

  for (let i = 0; i < points - missingArc; i += 1) {
    const angle = (-90 + (360 / points) * i) * (Math.PI / 180);
    const pulse = i % 2 === 0 ? 1 : 0.72;
    const drift = 1 + Math.sin(i * 1.7 + severityRank[severity]) * distortion;
    const pointRadius = radius * pulse * drift;
    const x = 60 + Math.cos(angle) * pointRadius;
    const y = 60 + Math.sin(angle) * pointRadius;
    commands.push(`${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`);
  }

  return `${commands.join(" ")} ${state === "unknown" ? "" : "Z"}`;
}

function confidenceScore(confidence?: SignalBloomConfidence) {
  if (!confidence) return 0.64;
  if (confidence.overall !== undefined) return clamp01(confidence.overall);
  const values = [confidence.freshness, confidence.sourceReliability, confidence.completeness].filter((value): value is number => typeof value === "number");
  if (!values.length) return 0.64;
  return clamp01(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function formatValue(item: SignalBloomDatum) {
  if (item.value === undefined) return "";
  return `${item.value.toLocaleString()}${item.unit ? ` ${item.unit}` : ""}`;
}

function describeItem(item: SignalBloomDatum) {
  const severity = item.severity ?? "none";
  const state = item.state ?? "unknown";
  const parts = [
    item.label,
    `severity ${severityLabel[severity]}`,
    `state ${stateLabel[state]}`,
    item.value !== undefined ? `value ${formatValue(item)}` : null,
    item.source ? `source ${item.source.label}` : null,
    item.source?.freshness ? `freshness ${freshnessLabel[item.source.freshness]}` : null,
  ];
  return parts.filter(Boolean).join(", ");
}

function getSummary(items: SignalBloomDatum[]) {
  const critical = items.filter((item) => item.severity === "critical").length;
  const high = items.filter((item) => item.severity === "high").length;
  const staleOrUnknown = items.filter((item) => item.state === "stale" || item.state === "unknown" || item.source?.freshness === "delayed" || item.source?.freshness === "unknown").length;
  const averageConfidence = items.reduce((sum, item) => sum + confidenceScore(item.confidence ?? item.source?.confidence), 0) / Math.max(1, items.length);
  return {
    critical,
    high,
    staleOrUnknown,
    averageConfidence,
    screenReader: `${items.length} signals. ${critical} critical, ${high} high severity, ${staleOrUnknown} stale or unknown, average confidence ${Math.round(averageConfidence * 100)} percent.`,
  };
}

function uniqueSources(items: SignalBloomDatum[]) {
  const map = new Map<string, SignalBloomSource>();
  for (const item of items) {
    if (!item.source) continue;
    map.set(`${item.source.label}-${item.source.freshness ?? "unknown"}`, item.source);
  }
  return Array.from(map.values());
}
