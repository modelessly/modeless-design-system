import * as React from "react";
import { Bot, Building2, CreditCard, UserCheck } from "lucide-react";
import { cn } from "../../../lib/utils";
import type { ModelessMotionIntensity } from "../../../tokens";
import { CommerceFrame, commerceTone } from "./shared";

export interface DelegatedPaymentEvent {
  id: string;
  label: string;
  actor: "agent" | "human" | "merchant" | "processor";
  time: string;
  state: "complete" | "active" | "review" | "blocked";
  detail: string;
}

export interface DelegatedPaymentTimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  events: DelegatedPaymentEvent[];
  currentEvent?: string;
  motion?: ModelessMotionIntensity;
}

const actorIcon = {
  agent: Bot,
  human: UserCheck,
  merchant: Building2,
  processor: CreditCard,
} satisfies Record<DelegatedPaymentEvent["actor"], React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>>;

const eventTone = {
  complete: "success",
  active: "machine",
  review: "review",
  blocked: "risk",
} as const;

export function DelegatedPaymentTimeline({
  events,
  currentEvent,
  motion = "subtle",
  className,
  ...props
}: DelegatedPaymentTimelineProps) {
  const current = currentEvent ?? events.find((event) => event.state === "active")?.id;

  return (
    <CommerceFrame title="Delegated Payment Timeline" eyebrow="human / agent / processor" motion={motion} className={className} {...props}>
      <div className="relative min-h-72 overflow-hidden border border-border bg-background p-4">
        <div className="absolute inset-x-8 top-1/2 hidden h-px bg-border md:block" aria-hidden={true} />
        <div className="grid gap-3 md:grid-cols-4">
          {events.map((event, index) => {
            const Icon = actorIcon[event.actor];
            const selected = event.id === current;
            return (
              <article key={event.id} className={cn("relative grid gap-3 border border-border bg-card/90 p-3", selected && "border-primary bg-primary/10")}>
                <div
                  className={cn("grid h-12 w-12 place-items-center border bg-background", motion !== "off" && selected && "motion-data-node")}
                  style={{ borderColor: commerceTone(eventTone[event.state]), color: commerceTone(eventTone[event.state]), "--motion-index": index } as React.CSSProperties}
                >
                  <Icon aria-hidden={true} className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-micro text-muted-foreground">{event.time} / {event.actor}</p>
                  <h4 className="mt-1 text-sm text-foreground">{event.label}</h4>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">{event.detail}</p>
                </div>
                <span className="w-fit border border-border bg-background px-2 py-1 text-micro" style={{ color: commerceTone(eventTone[event.state]) }}>
                  {event.state}
                </span>
              </article>
            );
          })}
        </div>
      </div>
    </CommerceFrame>
  );
}
