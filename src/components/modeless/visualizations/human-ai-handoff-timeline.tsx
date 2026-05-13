import * as React from "react";
import { Bot, CheckCircle2, RotateCcw, UserRound, Workflow, XCircle } from "lucide-react";
import { cn } from "../../../lib/utils";
import type { ModelessMotionIntensity } from "../../../tokens";
import { toneColor, VisualizationFrame } from "./shared";

export type HandoffActor = "ai" | "human" | "system";
export type HandoffEventType = "generated" | "reviewed" | "edited" | "automated" | "escalated" | "approved" | "rejected" | "retried";

export interface HandoffEvent {
  id: string;
  label: string;
  actor: HandoffActor;
  type: HandoffEventType;
  duration?: string;
  detail?: string;
}

export interface HumanAIHandoffTimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  events: HandoffEvent[];
  orientation?: "horizontal" | "vertical";
  actorFilter?: HandoffActor | "all";
  currentEvent?: string;
  showDurations?: boolean;
  motion?: ModelessMotionIntensity;
}

const actorIcon = { ai: Bot, human: UserRound, system: Workflow };
const eventIcon = { approved: CheckCircle2, rejected: XCircle, retried: RotateCcw };

export function HumanAIHandoffTimeline({
  events,
  orientation = "horizontal",
  actorFilter = "all",
  currentEvent,
  showDurations = true,
  motion = "subtle",
  className,
  ...props
}: HumanAIHandoffTimelineProps) {
  const visibleEvents = actorFilter === "all" ? events : events.filter((event) => event.actor === actorFilter);
  const current = currentEvent ?? visibleEvents[Math.min(2, visibleEvents.length - 1)]?.id;

  return (
    <VisualizationFrame title="Human-AI Handoff Timeline" eyebrow={`handoff / ${actorFilter}`} motion={motion} className={className} {...props}>
      <div className={cn("relative", orientation === "vertical" ? "grid gap-3" : "overflow-x-auto")}>
        <div className={cn(orientation === "vertical" ? "grid gap-3" : "grid min-w-[48rem] grid-cols-8 gap-2")}>
          {visibleEvents.map((event, index) => {
            const ActorIcon = actorIcon[event.actor];
            const EventIcon = eventIcon[event.type as keyof typeof eventIcon];
            const active = event.id === current;
            return (
              <div key={event.id} className={cn("relative border bg-background p-3", active ? "border-primary" : "border-border")}>
                {index < visibleEvents.length - 1 ? (
                  <span
                    className={cn(
                      "absolute bg-border",
                      orientation === "vertical" ? "bottom-[-13px] left-6 h-3 w-px" : "right-[-9px] top-8 h-px w-2",
                      motion !== "off" && "motion-connection",
                    )}
                  />
                ) : null}
                <div className="flex items-center justify-between gap-2">
                  <ActorIcon aria-hidden={true} className="h-4 w-4" style={{ color: toneColor(event.actor) }} />
                  {EventIcon ? <EventIcon aria-hidden={true} className="h-4 w-4 text-primary" /> : <span className="h-2 w-2 bg-primary" />}
                </div>
                <p className="mt-4 text-micro text-muted-foreground">{event.actor} / {event.type}</p>
                <h4 className="mt-1 font-display text-xl uppercase leading-none">{event.label}</h4>
                {showDurations && event.duration ? <p className="mt-2 font-mono text-xs text-primary">{event.duration}</p> : null}
                {event.detail ? <p className="mt-2 text-xs leading-5 text-muted-foreground">{event.detail}</p> : null}
              </div>
            );
          })}
        </div>
      </div>
    </VisualizationFrame>
  );
}
