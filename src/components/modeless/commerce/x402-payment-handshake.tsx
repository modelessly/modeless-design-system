import * as React from "react";
import { ArrowRight, KeyRound, Server, TerminalSquare, Wallet } from "lucide-react";
import { cn } from "../../../lib/utils";
import type { ModelessMotionIntensity } from "../../../tokens";
import { CommerceFrame, CommerceMetric, commerceTone } from "./shared";

export interface X402HandshakeStep {
  id: string;
  label: string;
  status: "challenge" | "signed" | "submitted" | "settled" | "failed";
  detail: string;
}

export interface X402PaymentHandshakeProps extends React.HTMLAttributes<HTMLDivElement> {
  resource: string;
  amount: string;
  chain: string;
  steps: X402HandshakeStep[];
  activeStep?: string;
  selectedStepId?: string;
  onSelectedStepChange?: (stepId: string) => void;
  motion?: ModelessMotionIntensity;
}

const statusTone = {
  challenge: "review",
  signed: "machine",
  submitted: "settled",
  settled: "success",
  failed: "risk",
} as const;

export function X402PaymentHandshake({
  resource,
  amount,
  chain,
  steps,
  activeStep,
  selectedStepId,
  onSelectedStepChange,
  motion = "subtle",
  className,
  ...props
}: X402PaymentHandshakeProps) {
  const active = activeStep ?? steps.find((step) => step.status !== "settled")?.id ?? steps.at(-1)?.id;
  const [internalStep, setInternalStep] = React.useState(active ?? steps[0]?.id);
  const selectedId = selectedStepId ?? internalStep;
  const selectedStep = steps.find((step) => step.id === selectedId);

  function selectStep(stepId: string) {
    setInternalStep(stepId);
    onSelectedStepChange?.(stepId);
  }

  return (
    <CommerceFrame title="x402 Payment Handshake" eyebrow={`${chain} / machine payment`} motion={motion} className={className} {...props}>
      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_13rem]">
        <div className="relative min-h-72 min-w-0 overflow-hidden border border-border bg-background p-3 sm:p-5">
          <div className="absolute inset-0 bg-grid-visualizer opacity-30" aria-hidden={true} />
          <div className="relative z-10 grid min-h-60 items-center gap-4">
            <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)]">
              <Node icon={TerminalSquare} label="client" tone="machine" />
              <ArrowRight aria-hidden={true} className={cn("mx-auto h-4 w-4 rotate-90 text-primary sm:rotate-0", motion !== "off" && "motion-connection")} />
              <Node icon={Server} label="resource" tone="settled" />
              <ArrowRight aria-hidden={true} className={cn("mx-auto h-4 w-4 rotate-90 text-primary sm:rotate-0", motion !== "off" && "motion-connection")} />
              <Node icon={Wallet} label="wallet" tone="safe" />
            </div>
            <div className="grid min-w-0 gap-2">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  type="button"
                  aria-pressed={step.id === selectedId}
                  onClick={() => selectStep(step.id)}
                  className={cn(
                    "grid min-w-0 gap-2 border border-border bg-card/90 p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:grid-cols-[7rem_minmax(0,1fr)]",
                    (step.id === active || step.id === selectedId) && "border-primary bg-primary/10",
                  )}
                >
                  <span className="font-mono text-xs uppercase" style={{ color: commerceTone(statusTone[step.status]) }}>{step.status}</span>
                  <div>
                    <p className="text-sm text-foreground [overflow-wrap:anywhere]">{step.label}</p>
                    <p className={cn("mt-1 text-xs leading-5 [overflow-wrap:anywhere]", step.id === selectedId ? "text-foreground/80" : "text-muted-foreground", motion !== "off" && (step.id === active || step.id === selectedId) && "motion-data-text")} style={{ "--motion-index": index } as React.CSSProperties}>
                      {step.detail}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
        <aside className="grid min-w-0 content-start gap-3">
          <CommerceMetric label="resource" value={resource} tone="settled" />
          <CommerceMetric label="price" value={amount} tone="safe" />
          <CommerceMetric label="chain" value={chain} tone="machine" />
          {selectedStep ? (
            <div className="border border-primary bg-primary/10 p-3">
              <p className="text-micro text-primary">handshake state</p>
              <p className="mt-1 text-sm text-foreground [overflow-wrap:anywhere]">{selectedStep.label}</p>
              <p className="mt-2 text-xs leading-5 text-foreground/80 [overflow-wrap:anywhere]">{selectedStep.detail}</p>
            </div>
          ) : null}
        </aside>
      </div>
    </CommerceFrame>
  );
}

function Node({
  icon: Icon,
  label,
  tone,
}: {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean; style?: React.CSSProperties }>;
  label: string;
  tone: "safe" | "review" | "risk" | "settled" | "machine" | "muted";
}) {
  return (
    <div className="artifact-angle artifact-angle-sm artifact-angle-frame grid min-h-20 min-w-0 place-items-center border border-border bg-background p-2 text-center sm:min-h-24 sm:p-3">
      <KeyRound aria-hidden={true} className="mb-1 h-3 w-3 text-muted-foreground" />
      <Icon aria-hidden={true} className="h-6 w-6" style={{ color: commerceTone(tone) }} />
      <p className="mt-2 font-mono text-[0.62rem] uppercase text-muted-foreground">{label}</p>
    </div>
  );
}
