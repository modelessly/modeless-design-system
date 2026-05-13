import * as React from "react";
import { cn } from "../../lib/utils";
import { SignalBadge } from "./signal-badge";

export interface TerminalLine {
  label?: string;
  value: React.ReactNode;
  tone?: "default" | "muted" | "signal" | "warning" | "error";
}

export interface TerminalBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  lines: Array<string | TerminalLine>;
  prompt?: string;
  animated?: boolean;
  status?: "live" | "stable" | "warning" | "experimental";
}

const toneClass = {
  default: "text-terminal-foreground",
  muted: "text-muted-foreground",
  signal: "text-primary",
  warning: "text-warning",
  error: "text-destructive",
};

export function TerminalBlock({
  className,
  title = "terminal",
  lines,
  prompt = "modeless@studio",
  animated = false,
  status = "live",
  ...props
}: TerminalBlockProps) {
  return (
    <div className={cn("artifact-angle artifact-angle-frame terminal-glow overflow-hidden border border-terminal-foreground/30 bg-terminal", className)} {...props}>
      <div className="flex items-center justify-between border-b border-terminal-foreground/20 py-2 pl-[calc(var(--angle-cut)+0.5rem)] pr-3">
        <div className="text-micro text-terminal-foreground">{title}</div>
        <SignalBadge variant={status}>{status}</SignalBadge>
      </div>
      <div className="scanline-overlay grid gap-2 p-4 font-mono text-xs leading-5">
        {lines.map((line, index) => {
          const item = typeof line === "string" ? { value: line, tone: "default" as const } : line;
          return (
            <div
              key={`${String(item.value)}-${index}`}
              className={cn(animated && index === lines.length - 1 && "motion-pulse")}
            >
              <span className="text-muted-foreground">{prompt}:~$ </span>
              {item.label && <span className="text-muted-foreground">{item.label} </span>}
              <span className={toneClass[item.tone ?? "default"]}>{item.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
