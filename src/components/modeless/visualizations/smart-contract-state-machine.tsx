import * as React from "react";
import { KeyRound, Lock, RadioTower } from "lucide-react";
import { cn } from "../../../lib/utils";
import type { ModelessMotionIntensity } from "../../../tokens";
import { toneColor, VisualizationFrame } from "./shared";

export interface ContractState {
  id: string;
  label: string;
  tone?: "low" | "warning" | "high" | "system";
}

export interface ContractTransition {
  from: string;
  to: string;
  label: string;
}

export interface ContractFunction {
  name: string;
  access: "public" | "owner" | "role" | "paused";
  risk?: "low" | "medium" | "high";
}

export interface ContractEvent {
  label: string;
  time: string;
  actor: string;
}

export interface SmartContractStateMachineProps extends React.HTMLAttributes<HTMLDivElement> {
  states: ContractState[];
  currentState: string;
  transitions: ContractTransition[];
  functions: ContractFunction[];
  permissions: string[];
  recentEvents: ContractEvent[];
  motion?: ModelessMotionIntensity;
}

export function SmartContractStateMachine({
  states,
  currentState,
  transitions,
  functions,
  permissions,
  recentEvents,
  motion = "subtle",
  className,
  ...props
}: SmartContractStateMachineProps) {
  const angle = (Math.PI * 2) / states.length;
  const points = states.map((state, index) => ({
    ...state,
    x: 300 + Math.cos(index * angle - Math.PI / 2) * 185,
    y: 190 + Math.sin(index * angle - Math.PI / 2) * 128,
  }));

  return (
    <VisualizationFrame title="Smart Contract State Machine" eyebrow={`current / ${currentState}`} motion={motion} className={className} {...props}>
      <div className="grid gap-4 xl:grid-cols-[1fr_18rem]">
        <svg className="min-h-80 w-full bg-grid-thin" viewBox="0 0 600 380" role="img" aria-label="Smart contract state machine">
          {transitions.map((transition) => {
            const from = points.find((point) => point.id === transition.from);
            const to = points.find((point) => point.id === transition.to);
            if (!from || !to) return null;
            return <path key={`${transition.from}-${transition.to}`} className={cn(motion !== "off" && "motion-connection")} d={`M ${from.x} ${from.y} L ${to.x} ${to.y}`} stroke="hsl(var(--border))" strokeWidth="2" strokeDasharray="6 8" />;
          })}
          {points.map((state, index) => {
            const active = state.id === currentState;
            return (
              <g key={state.id} className={cn(active && motion !== "off" && "motion-data-node")} style={{ "--motion-index": index } as React.CSSProperties}>
                <rect x={state.x - 58} y={state.y - 24} width="116" height="48" fill={active ? "hsl(var(--primary) / 0.18)" : "hsl(var(--background) / 0.94)"} stroke={toneColor(state.tone)} strokeWidth={active ? 2 : 1} />
                <text x={state.x} y={state.y + 4} textAnchor="middle" fill="hsl(var(--foreground))" fontFamily="monospace" fontSize="11">{state.label}</text>
              </g>
            );
          })}
        </svg>
        <aside className="grid content-start gap-3">
          <div className="border border-border bg-background p-3">
            <div className="mb-3 flex items-center gap-2 text-primary"><Lock aria-hidden={true} className="h-4 w-4" /><span className="text-micro">callable functions</span></div>
            <div className="grid gap-1">
              {functions.map((fn) => (
                <div key={fn.name} className="grid grid-cols-[1fr_4rem] gap-2 border border-border p-2 text-xs">
                  <span>{fn.name}</span>
                  <span className="text-muted-foreground">{fn.access}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="border border-border bg-background p-3">
            <div className="mb-2 flex items-center gap-2 text-primary"><KeyRound aria-hidden={true} className="h-4 w-4" /><span className="text-micro">permissions</span></div>
            <p className="text-xs leading-5 text-muted-foreground">{permissions.join(" / ")}</p>
          </div>
          <div className="border border-border bg-background p-3">
            <div className="mb-2 flex items-center gap-2 text-primary"><RadioTower aria-hidden={true} className="h-4 w-4" /><span className="text-micro">recent events</span></div>
            {recentEvents.slice(0, 3).map((event) => (
              <p key={`${event.time}-${event.label}`} className="text-xs leading-5 text-muted-foreground">{event.time} / {event.label} / {event.actor}</p>
            ))}
          </div>
        </aside>
      </div>
    </VisualizationFrame>
  );
}
