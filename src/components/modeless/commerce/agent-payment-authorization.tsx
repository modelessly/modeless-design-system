import * as React from "react";
import { CheckCircle2, LockKeyhole, ShieldAlert, UserRound } from "lucide-react";
import { cn } from "../../../lib/utils";
import type { ModelessMotionIntensity } from "../../../tokens";
import { CommerceFrame, CommerceMetric, commerceTone } from "./shared";

export type AgentAuthorizationState = "requested" | "reviewing" | "approved" | "denied" | "expired";

export interface AgentPaymentAuthorizationStep {
  id: string;
  label: string;
  actor: "agent" | "human" | "merchant" | "system";
  state: AgentAuthorizationState;
  detail?: string;
}

export interface AgentPaymentAuthorizationProps extends React.HTMLAttributes<HTMLDivElement> {
  merchant: string;
  agentName: string;
  amount: string;
  currency?: string;
  state?: AgentAuthorizationState;
  riskScore?: number;
  steps: AgentPaymentAuthorizationStep[];
  selectedStepId?: string;
  onSelectedStepChange?: (stepId: string) => void;
  motion?: ModelessMotionIntensity;
}

const stateMeta = {
  requested: { label: "Requested", tone: "review" },
  reviewing: { label: "Reviewing", tone: "review" },
  approved: { label: "Approved", tone: "safe" },
  denied: { label: "Denied", tone: "risk" },
  expired: { label: "Expired", tone: "muted" },
} as const;

export function AgentPaymentAuthorization({
  merchant,
  agentName,
  amount,
  currency = "$",
  state = "reviewing",
  riskScore = 34,
  steps,
  selectedStepId,
  onSelectedStepChange,
  motion = "subtle",
  className,
  ...props
}: AgentPaymentAuthorizationProps) {
  const meta = stateMeta[state];
  const [internalStep, setInternalStep] = React.useState(steps.find((step) => step.state === state)?.id ?? steps[0]?.id);
  const selectedId = selectedStepId ?? internalStep;
  const selectedStep = steps.find((step) => step.id === selectedId) ?? steps[0];

  function selectStep(stepId: string) {
    setInternalStep(stepId);
    onSelectedStepChange?.(stepId);
  }

  return (
    <CommerceFrame title="Agent Payment Authorization" eyebrow={`${agentName} / ${meta.label}`} motion={motion} className={className} {...props}>
      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_14rem]">
        <div className="relative min-h-64 min-w-0 overflow-hidden border border-border bg-grid-thin p-3 sm:p-4">
          <div className="absolute left-4 top-4 right-4 grid grid-cols-[auto_1fr_auto] items-center gap-3">
            <div className="grid h-10 w-10 place-items-center border border-primary bg-primary text-primary-foreground">
              <UserRound aria-hidden={true} className="h-5 w-5" />
            </div>
            <div className="h-px bg-border" />
            <div className="grid h-10 w-10 place-items-center border border-border bg-background text-muted-foreground">
              <LockKeyhole aria-hidden={true} className="h-5 w-5" />
            </div>
          </div>
          <svg viewBox="0 0 620 280" className="h-full min-h-64 w-full" role="img" aria-label="Agent payment authorization flow">
            <path
              className={cn(motion !== "off" && "motion-trace-draw")}
              d="M 84 158 C 178 60, 276 60, 334 138 S 468 238, 548 134"
              fill="none"
              stroke={commerceTone(meta.tone)}
              strokeWidth="2"
              strokeDasharray="9 8"
              strokeOpacity="0.8"
            />
            {steps.map((step, index) => {
              const x = 72 + index * (476 / Math.max(steps.length - 1, 1));
              const y = index % 2 === 0 ? 154 : 100;
              const active = step.id === selectedId || step.state === state;
              return (
                <g key={step.id} className={cn(motion !== "off" && active && "motion-data-node")} style={{ "--motion-index": index } as React.CSSProperties}>
                  <rect x={x - 46} y={y - 25} width="92" height="50" fill={active ? "hsl(var(--primary) / 0.16)" : "hsl(var(--background) / 0.94)"} stroke={step.id === selectedId ? "hsl(var(--primary))" : commerceTone(stateMeta[step.state].tone)} strokeWidth={step.id === selectedId ? 2 : 1} />
                  <text x={x - 34} y={y - 4} fill="hsl(var(--foreground))" fontFamily="monospace" fontSize="9">
                    {step.actor.toUpperCase()}
                  </text>
                  <text x={x - 34} y={y + 13} fill="hsl(var(--muted-foreground))" fontFamily="monospace" fontSize="8">
                    {stateMeta[step.state].label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        <aside className="grid min-w-0 content-start gap-3">
          <CommerceMetric label="merchant" value={merchant} tone="settled" />
          <CommerceMetric label="authorized" value={`${currency}${amount}`} tone={meta.tone} />
          {selectedStep ? (
            <div className="border border-primary bg-primary/10 p-3">
              <p className="text-micro text-primary">inspecting</p>
              <p className="mt-1 text-sm text-foreground">{selectedStep.label}</p>
              <p className="mt-2 text-xs leading-5 text-foreground/80">{selectedStep.detail ?? stateMeta[selectedStep.state].label}</p>
            </div>
          ) : null}
          <div className="grid gap-1.5" role="group" aria-label="Inspect authorization steps">
            {steps.map((step) => (
              <button
                key={step.id}
                type="button"
                aria-pressed={step.id === selectedId}
                onClick={() => selectStep(step.id)}
                className={cn(
                  "grid grid-cols-[1fr_auto] items-center gap-2 border border-border bg-background px-2 py-2 text-left text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  step.id === selectedId && "border-primary text-primary",
                )}
              >
                <span className="truncate">{step.label}</span>
                <span className="text-micro text-muted-foreground">{step.actor}</span>
              </button>
            ))}
          </div>
          <div className="border border-border bg-background p-3">
            <div className="flex items-center gap-2">
              {riskScore > 60 ? <ShieldAlert aria-hidden={true} className="h-4 w-4 text-destructive" /> : <CheckCircle2 aria-hidden={true} className="h-4 w-4 text-primary" />}
              <p className="text-micro text-muted-foreground">risk score</p>
            </div>
            <div className="mt-3 h-3 border border-border bg-card">
              <div className={cn("h-full", motion !== "off" && "motion-data-cell")} style={{ width: `${riskScore}%`, background: commerceTone(riskScore > 60 ? "risk" : riskScore > 35 ? "review" : "safe") }} />
            </div>
            <p className="mt-2 font-mono text-xs text-muted-foreground">{riskScore}/100 requires {riskScore > 50 ? "human review" : "bounded approval"}</p>
          </div>
        </aside>
      </div>
    </CommerceFrame>
  );
}
