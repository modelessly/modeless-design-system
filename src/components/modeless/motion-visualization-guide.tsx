import * as React from "react";
import { Activity, Eye, GitBranch, RadioTower, ShieldAlert, Waves } from "lucide-react";
import { cn } from "../../lib/utils";
import type { ModelessMotionIntensity } from "../../tokens";
import { GenerativeField } from "./generative-field";
import { ModelessPanel } from "./modeless-panel";
import { SectionHeader } from "./product-primitives";

export interface MotionVisualizationGuideProps extends React.HTMLAttributes<HTMLElement> {
  motion?: ModelessMotionIntensity;
}

const principles = [
  ["System State", "Motion should explain whether something is idle, active, resolving, risky, or complete."],
  ["Provenance", "Data visualizations should show where information came from, not only what it says."],
  ["Uncertainty", "Probabilistic systems need confidence, freshness, review, and risk surfaces."],
  ["Trust Boundaries", "Show where external control, irreversible action, or human approval enters the system."],
] as const;

const primitives = [
  { name: "Pulse", icon: Activity, className: "motion-pulse", purpose: "active signal, heartbeat, state confirmation", duration: "9s to 14s" },
  { name: "Trace", icon: GitBranch, className: "motion-trace-draw", purpose: "execution paths, provenance, transaction routes", duration: "22s to 32s" },
  { name: "Drift", icon: Waves, className: "motion-drift", purpose: "ambient system presence and live surfaces", duration: "24s to 36s" },
  { name: "Orbit", icon: RadioTower, className: "motion-orbital", purpose: "network motion, decentralized systems, satellite context", duration: "42s" },
] as const;

const taxonomy = [
  ["Agentic workflow", "agent traces, handoffs, tool calls, decision forks"],
  ["Prompt and context", "prompt stacks, context heatmaps, retrieval health"],
  ["Confidence and review", "claim matrices, source strength, human approval"],
  ["AI economics", "token cost, caching, savings, efficiency"],
  ["Protocol systems", "on-chain flow, contract states, governance pulse"],
  ["Trust surfaces", "risk zones, external dependencies, irreversible actions"],
] as const;

const usageRules = [
  "Default to subtle motion for product surfaces.",
  "Use live motion only for primary inspection or hero graphics.",
  "Use high motion for controlled demos, never as a production default.",
  "Represent risk with labels and structure, not color alone.",
  "Never use surprise audio, rapid flicker, jitter loops, or animation that blocks reading.",
] as const;

export function MotionVisualizationGuide({ motion = "subtle", className, ...props }: MotionVisualizationGuideProps) {
  return (
    <section className={cn("border-b border-border bg-border p-px", className)} {...props}>
      <SectionHeader
        label="motion and visualization guide"
        title="Motion Graphics And Data Visualization System"
        copy="Modeless motion is a language for system state, provenance, uncertainty, trust, and time. The goal is not spectacle; it is a living technical instrument that remains readable."
      />

      <div className="grid gap-px bg-border lg:grid-cols-[0.95fr_1.05fr]">
        <ModelessPanel title="Motion Philosophy" eyebrow="principles" motion={motion}>
          <div className="grid gap-3">
            {principles.map(([title, copy]) => (
              <div key={title} className="border border-border bg-background p-3">
                <p className="text-micro text-muted-foreground">{title}</p>
                <p className="mt-1 max-w-[calc(100vw-2rem)] text-sm leading-6 text-muted-foreground lg:max-w-none">{copy}</p>
              </div>
            ))}
          </div>
        </ModelessPanel>
        <GenerativeField variant="waveform" seedLabel="MOTION / TELEMETRY LANGUAGE" className="min-h-[420px] border-0" motion={motion} />
      </div>

      <div className="grid gap-px bg-border md:grid-cols-2 xl:grid-cols-4">
        {primitives.map(({ name, icon: Icon, className: primitiveClass, purpose, duration }, index) => (
          <ModelessPanel key={name} title={name} eyebrow="motion primitive" motion={motion}>
            <div className="grid min-h-32 place-items-center border border-border bg-background">
              <div className={cn("grid h-16 w-16 place-items-center border border-primary bg-primary/10 text-primary", motion !== "off" && primitiveClass)} style={{ "--motion-index": index } as React.CSSProperties}>
                <Icon aria-hidden={true} className="h-6 w-6" />
              </div>
            </div>
            <p className="mt-3 max-w-[calc(100vw-2rem)] text-sm leading-6 text-muted-foreground md:max-w-none">{purpose}</p>
            <p className="mt-2 text-micro text-muted-foreground">duration / {duration}</p>
          </ModelessPanel>
        ))}
      </div>

      <div className="grid gap-px bg-border lg:grid-cols-[1fr_1fr]">
        <ModelessPanel title="Visualization Taxonomy" eyebrow="families" motion={motion}>
          <div className="grid gap-2">
            {taxonomy.map(([title, copy]) => (
              <div key={title} className="grid gap-2 border border-border bg-background p-3 sm:grid-cols-[12rem_1fr]">
                <p className="text-micro text-primary">{title}</p>
                <p className="max-w-[calc(100vw-2rem)] text-sm leading-6 text-muted-foreground sm:max-w-none">{copy}</p>
              </div>
            ))}
          </div>
        </ModelessPanel>
        <ModelessPanel title="Usage Rules" eyebrow="guardrails" motion={motion}>
          <div className="grid gap-2">
            {usageRules.map((rule, index) => (
              <div key={rule} className="flex gap-3 border border-border bg-background p-3">
                {index < 3 ? <Eye aria-hidden={true} className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> : <ShieldAlert aria-hidden={true} className="mt-0.5 h-4 w-4 shrink-0 text-warning" />}
                <p className="max-w-[calc(100vw-3rem)] text-sm leading-6 text-muted-foreground sm:max-w-none">{rule}</p>
              </div>
            ))}
          </div>
        </ModelessPanel>
      </div>
    </section>
  );
}
