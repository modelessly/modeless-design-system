import * as React from "react";
import { CheckCircle2, FileCheck2, ShieldCheck } from "lucide-react";
import { cn } from "../../../lib/utils";
import type { ModelessMotionIntensity } from "../../../tokens";
import { CommerceFrame, CommerceMetric, commerceTone } from "./shared";

export interface AgentReceiptLineItem {
  id: string;
  label: string;
  amount: string;
  source?: "agent" | "human" | "merchant" | "system";
}

export interface AgentReceiptEvidence {
  id: string;
  label: string;
  status: "captured" | "verified" | "missing" | "review";
}

export interface AgentReceiptProps extends React.HTMLAttributes<HTMLDivElement> {
  receiptId: string;
  merchant: string;
  agentName: string;
  amount: string;
  status?: "settled" | "pending" | "review" | "failed";
  lineItems: AgentReceiptLineItem[];
  evidence: AgentReceiptEvidence[];
  motion?: ModelessMotionIntensity;
}

const statusTone = {
  settled: "safe",
  pending: "review",
  review: "machine",
  failed: "risk",
} as const;

const evidenceTone = {
  captured: "settled",
  verified: "safe",
  missing: "risk",
  review: "review",
} as const;

export function AgentReceipt({
  receiptId,
  merchant,
  agentName,
  amount,
  status = "settled",
  lineItems,
  evidence,
  motion = "subtle",
  className,
  ...props
}: AgentReceiptProps) {
  return (
    <CommerceFrame title="Agent Receipt" eyebrow={`${agentName} / ${status}`} motion={motion} className={className} {...props}>
      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_14rem]">
        <div className="artifact-angle artifact-angle-frame relative min-h-72 min-w-0 overflow-hidden border border-border bg-background p-4">
          <div className="absolute inset-0 bg-grid-dotted opacity-40" aria-hidden={true} />
          <div className="relative z-10 grid gap-4">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-4">
              <div>
                <p className="text-micro text-muted-foreground">receipt id</p>
                <h4 className="mt-1 break-words font-display text-4xl uppercase leading-none [overflow-wrap:anywhere]">{receiptId}</h4>
              </div>
              <div
                className={cn("grid h-14 w-14 place-items-center border", motion !== "off" && "motion-data-node")}
                style={{ borderColor: commerceTone(statusTone[status]), color: commerceTone(statusTone[status]) }}
              >
                <FileCheck2 aria-hidden={true} className="h-7 w-7" />
              </div>
            </div>
            <div className="grid gap-2">
              {lineItems.map((item, index) => (
                <div key={item.id} className="grid grid-cols-[1fr_auto] gap-3 border border-border bg-card/90 p-3">
                  <div className="min-w-0">
                    <p className="text-sm text-foreground [overflow-wrap:anywhere]">{item.label}</p>
                    <p className="mt-1 text-micro text-muted-foreground">{item.source ?? "agent"} line item</p>
                  </div>
                  <p className={cn("font-mono text-xs text-primary", motion !== "off" && "motion-data-text")} style={{ "--motion-index": index } as React.CSSProperties}>
                    {item.amount}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <aside className="grid min-w-0 content-start gap-3">
          <CommerceMetric label="merchant" value={merchant} tone="settled" />
          <CommerceMetric label="total" value={amount} tone={statusTone[status]} />
          <div className="border border-border bg-background p-3">
            <div className="flex items-center gap-2">
              <ShieldCheck aria-hidden={true} className="h-4 w-4 text-primary" />
              <p className="text-micro text-muted-foreground">evidence chain</p>
            </div>
            <div className="mt-3 grid gap-2">
              {evidence.map((item, index) => (
                <div key={item.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-2">
                  <span
                    className={cn("h-2 w-2", motion !== "off" && "motion-data-cell")}
                    style={{ background: commerceTone(evidenceTone[item.status]), "--motion-index": index } as React.CSSProperties}
                    aria-hidden={true}
                  />
                  <span className="text-xs text-foreground">{item.label}</span>
                  <span className="text-micro text-muted-foreground">{item.status}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="border border-primary bg-primary/10 p-3">
            <CheckCircle2 aria-hidden={true} className="mb-2 h-4 w-4 text-primary" />
            <p className="text-xs leading-5 text-foreground/80">Receipt preserves the agent action, approval evidence, merchant response, and settlement state.</p>
          </div>
        </aside>
      </div>
    </CommerceFrame>
  );
}
