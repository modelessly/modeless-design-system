import * as React from "react";
import { Bot, CheckCircle2, PackageCheck, ReceiptText, UserCheck } from "lucide-react";
import { cn } from "../../../lib/utils";
import type { ModelessMotionIntensity } from "../../../tokens";
import { CommerceFrame, commerceTone } from "./shared";

export type CheckoutActor = "agent" | "merchant" | "user" | "processor";

export interface CheckoutSessionEvent {
  id: string;
  label: string;
  actor: CheckoutActor;
  state: "pending" | "active" | "complete" | "review";
  detail: string;
}

export interface AgenticCheckoutSessionProps extends React.HTMLAttributes<HTMLDivElement> {
  sessionId: string;
  merchant: string;
  total: string;
  events: CheckoutSessionEvent[];
  activeEvent?: string;
  selectedEventId?: string;
  onSelectedEventChange?: (eventId: string) => void;
  motion?: ModelessMotionIntensity;
}

const actorIcon = {
  agent: Bot,
  merchant: PackageCheck,
  user: UserCheck,
  processor: ReceiptText,
} satisfies Record<CheckoutActor, React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>>;

export function AgenticCheckoutSession({
  sessionId,
  merchant,
  total,
  events,
  activeEvent,
  selectedEventId,
  onSelectedEventChange,
  motion = "subtle",
  className,
  ...props
}: AgenticCheckoutSessionProps) {
  const active = activeEvent ?? events.find((event) => event.state === "active")?.id;
  const [internalEvent, setInternalEvent] = React.useState(active ?? events[0]?.id);
  const selectedId = selectedEventId ?? internalEvent;
  const selectedEvent = events.find((event) => event.id === selectedId);

  function selectEvent(eventId: string) {
    setInternalEvent(eventId);
    onSelectedEventChange?.(eventId);
  }

  return (
    <CommerceFrame title="Agentic Checkout Session" eyebrow={`${merchant} / ${sessionId}`} motion={motion} className={className} {...props}>
      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_14rem]">
        <div className="relative min-h-72 min-w-0 overflow-hidden border border-border bg-background p-3 sm:p-4">
          <div className="absolute inset-0 bg-grid-isometric opacity-40" aria-hidden={true} />
          <div className="relative z-10 grid min-w-0 gap-3">
            {events.map((event, index) => {
              const Icon = actorIcon[event.actor];
              const selected = event.id === active || event.id === selectedId;
              return (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => selectEvent(event.id)}
                  className={cn(
                    "grid min-w-0 gap-3 border border-border bg-card/90 p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:grid-cols-[2.75rem_minmax(0,1fr)_auto] sm:items-center",
                    selected && "border-primary bg-primary/10",
                  )}
                >
                  <div
                    className={cn("grid h-10 w-10 place-items-center border", motion !== "off" && selected && "motion-data-node")}
                    style={{ borderColor: commerceTone(selected ? "safe" : "muted"), color: commerceTone(selected ? "safe" : "muted"), "--motion-index": index } as React.CSSProperties}
                  >
                    <Icon aria-hidden={true} className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-mono text-xs uppercase text-foreground [overflow-wrap:anywhere]">{event.label}</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground [overflow-wrap:anywhere]">{event.detail}</p>
                  </div>
                  <span className="border border-border bg-background px-2 py-1 text-micro text-muted-foreground">{event.state}</span>
                </button>
              );
            })}
          </div>
        </div>
        <aside className="grid min-w-0 content-start gap-3">
          <div className="artifact-angle artifact-angle-frame border border-primary bg-primary p-4 text-primary-foreground">
            <p className="text-micro opacity-70">session total</p>
            <p className="font-display text-5xl uppercase leading-none">{total}</p>
          </div>
          {selectedEvent ? (
            <div className="border border-primary bg-primary/10 p-3">
              <p className="text-micro text-primary">current inspection</p>
              <p className="mt-1 text-sm text-foreground">{selectedEvent.label}</p>
              <p className="mt-2 text-xs leading-5 text-foreground/80">{selectedEvent.actor} / {selectedEvent.state}</p>
            </div>
          ) : null}
          <div className="border border-border bg-background p-3">
            <CheckCircle2 aria-hidden={true} className="mb-2 h-4 w-4 text-primary" />
            <p className="text-xs leading-5 text-muted-foreground">Checkout state separates agent shopping intent, user approval, merchant fulfillment, and payment settlement.</p>
          </div>
        </aside>
      </div>
    </CommerceFrame>
  );
}
