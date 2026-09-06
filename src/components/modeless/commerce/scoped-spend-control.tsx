import * as React from "react";
import { Gauge, WalletCards } from "lucide-react";
import { cn } from "../../../lib/utils";
import type { ModelessMotionIntensity } from "../../../tokens";
import { CommerceFrame, CommerceMetric, clampPercent, commerceTone } from "./shared";

export interface SpendScope {
  id: string;
  label: string;
  limit: number;
  spent: number;
  tone?: "safe" | "review" | "risk" | "machine";
}

export interface ScopedSpendControlProps extends React.HTMLAttributes<HTMLDivElement> {
  agentName: string;
  period: string;
  totalLimit: number;
  totalSpent: number;
  currency?: string;
  scopes: SpendScope[];
  selectedScopeId?: string;
  onSelectedScopeChange?: (scopeId: string) => void;
  motion?: ModelessMotionIntensity;
}

export function ScopedSpendControl({
  agentName,
  period,
  totalLimit,
  totalSpent,
  currency = "$",
  scopes,
  selectedScopeId,
  onSelectedScopeChange,
  motion = "subtle",
  className,
  ...props
}: ScopedSpendControlProps) {
  const used = (totalSpent / Math.max(totalLimit, 1)) * 100;
  const [internalScope, setInternalScope] = React.useState(scopes[0]?.id);
  const selectedId = selectedScopeId ?? internalScope;
  const selectedScope = scopes.find((scope) => scope.id === selectedId);

  function selectScope(scopeId: string) {
    setInternalScope(scopeId);
    onSelectedScopeChange?.(scopeId);
  }

  return (
    <CommerceFrame title="Scoped Spend Control" eyebrow={`${agentName} / ${period}`} motion={motion} className={className} {...props}>
      <div className="grid min-w-0 gap-4 xl:grid-cols-[13rem_minmax(0,1fr)]">
        <div className="artifact-angle artifact-angle-frame grid place-items-center border border-border bg-background p-5">
          <div className="relative h-44 w-44">
            <svg viewBox="0 0 160 160" className="h-full w-full" role="img" aria-label="Scoped spend control radial meter">
              <circle cx="80" cy="80" r="58" fill="none" stroke="hsl(var(--border))" strokeWidth="12" />
              <circle
                className={cn(motion !== "off" && "motion-trace-draw")}
                cx="80"
                cy="80"
                r="58"
                fill="none"
                stroke={commerceTone(used > 80 ? "risk" : used > 58 ? "review" : "safe")}
                strokeWidth="12"
                strokeDasharray={`${Math.min(365, (used / 100) * 365)} 365`}
                transform="rotate(-90 80 80)"
              />
              <path d="M 80 24 L 94 80 L 80 136 L 66 80 Z" fill="hsl(var(--primary) / 0.12)" stroke="hsl(var(--border))" />
            </svg>
            <div className="absolute inset-0 grid place-items-center text-center">
              <div>
                <Gauge aria-hidden={true} className="mx-auto mb-2 h-5 w-5 text-primary" />
                <p className="font-display text-4xl uppercase leading-none">{Math.round(used)}%</p>
              </div>
            </div>
          </div>
          <p className="mt-3 text-center text-xs leading-5 text-muted-foreground">Budget permission is visible as a bounded operating envelope, not a blank check.</p>
        </div>
        <div className="grid min-w-0 gap-3">
          <div className="grid gap-px bg-border sm:grid-cols-3">
            <CommerceMetric label="spent" value={`${currency}${totalSpent}`} tone={used > 80 ? "risk" : "safe"} />
            <CommerceMetric label="limit" value={`${currency}${totalLimit}`} tone="settled" />
            <CommerceMetric label="remaining" value={`${currency}${Math.max(0, totalLimit - totalSpent)}`} tone="machine" />
          </div>
          {selectedScope ? (
            <div className="border border-primary bg-primary/10 p-3">
              <p className="text-micro text-primary">selected scope</p>
              <p className="mt-1 text-sm text-foreground">{selectedScope.label}</p>
              <p className="mt-1 font-mono text-xs text-foreground/80">
                {currency}{selectedScope.spent} spent from {currency}{selectedScope.limit} limit / {Math.round((selectedScope.spent / Math.max(selectedScope.limit, 1)) * 100)}% used
              </p>
            </div>
          ) : null}
          <div className="grid gap-2">
            {scopes.map((scope, index) => {
              const scopeUsed = (scope.spent / Math.max(scope.limit, 1)) * 100;
              return (
                <button
                  key={scope.id}
                  type="button"
                  aria-pressed={scope.id === selectedId}
                  onClick={() => selectScope(scope.id)}
                  className={cn(
                    "grid min-w-0 gap-2 border border-border bg-background p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:grid-cols-[minmax(6rem,8rem)_minmax(0,1fr)_minmax(4.5rem,auto)] sm:items-center",
                    scope.id === selectedId && "border-primary bg-primary/10",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <WalletCards aria-hidden={true} className="h-4 w-4 text-primary" />
                    <span className="text-xs text-foreground">{scope.label}</span>
                  </div>
                  <div className="h-5 border border-border bg-card">
                    <div
                      className={cn("h-full", motion !== "off" && "motion-data-cell")}
                      style={{ width: clampPercent(scopeUsed), background: commerceTone(scope.tone ?? (scopeUsed > 80 ? "risk" : scopeUsed > 58 ? "review" : "safe")), "--motion-index": index } as React.CSSProperties}
                    />
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">{currency}{scope.spent}/{scope.limit}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </CommerceFrame>
  );
}
