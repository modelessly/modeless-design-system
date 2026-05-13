import * as React from "react";
import { Activity, Vote } from "lucide-react";
import { cn } from "../../../lib/utils";
import type { ModelessMotionIntensity } from "../../../tokens";
import { percent, toneColor, VisualizationFrame } from "./shared";

export type ProposalState = "draft" | "discussion" | "voting" | "quorum" | "passed" | "failed" | "queued" | "executed";

export interface GovernanceProposal {
  id: string;
  title: string;
  state: ProposalState;
  turnout: number;
  influence: number;
  sentiment: number;
  risk?: "low" | "medium" | "high";
}

export interface GovernancePulseBoardProps extends React.HTMLAttributes<HTMLDivElement> {
  proposals: GovernanceProposal[];
  participation: number;
  quorum: number;
  sentiment: number;
  risk: "low" | "medium" | "high";
  selectedProposal?: string;
  motion?: ModelessMotionIntensity;
}

export function GovernancePulseBoard({
  proposals,
  participation,
  quorum,
  sentiment,
  risk,
  selectedProposal,
  motion = "subtle",
  className,
  ...props
}: GovernancePulseBoardProps) {
  const selected = selectedProposal ?? proposals[0]?.id;

  return (
    <VisualizationFrame title="Governance Pulse Board" eyebrow={`dao health / risk ${risk}`} motion={motion} className={className} {...props}>
      <div className="grid gap-4 lg:grid-cols-[14rem_1fr]">
        <div className="grid gap-2">
          <Pulse label="participation" value={participation} />
          <Pulse label="quorum" value={quorum} />
          <Pulse label="sentiment" value={sentiment} />
          <div className="border border-border bg-background p-3">
            <div className="flex items-center gap-2 text-primary"><Activity aria-hidden={true} className="h-4 w-4" /><span className="text-micro">voter fatigue</span></div>
            <p className="mt-2 font-display text-3xl uppercase leading-none">{risk === "high" ? "Elevated" : risk === "medium" ? "Watch" : "Low"}</p>
          </div>
        </div>
        <div className="grid gap-2">
          {proposals.map((proposal, index) => {
            const active = proposal.id === selected;
            return (
              <article key={proposal.id} className={cn("grid gap-3 border bg-background p-3 md:grid-cols-[1fr_14rem]", active ? "border-primary" : "border-border")}>
                <div>
                  <div className="flex items-center gap-2">
                    <Vote aria-hidden={true} className="h-4 w-4" style={{ color: toneColor(proposal.risk) }} />
                    <p className="text-micro text-muted-foreground">{proposal.state}</p>
                  </div>
                  <h4 className="mt-2 font-display text-2xl uppercase leading-none">{proposal.title}</h4>
                </div>
                <div className="grid gap-1 text-micro text-muted-foreground">
                  {[
                    ["turnout", proposal.turnout],
                    ["influence", proposal.influence],
                    ["sentiment", proposal.sentiment],
                  ].map(([label, value]) => (
                    <div key={label as string} className="grid grid-cols-[4.5rem_1fr] items-center gap-2">
                      <span>{label}</span>
                      <div className="h-2 border border-border bg-card">
                        <div className={cn("h-full bg-primary", motion !== "off" && "motion-data-cell")} style={{ width: percent(Number(value)), "--motion-index": index } as React.CSSProperties} />
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </VisualizationFrame>
  );
}

function Pulse({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-border bg-background p-3">
      <p className="text-micro text-muted-foreground">{label}</p>
      <p className="font-display text-4xl uppercase leading-none">{value}%</p>
      <div className="mt-3 h-2 border border-border bg-card">
        <div className="h-full bg-primary" style={{ width: percent(value) }} />
      </div>
    </div>
  );
}
