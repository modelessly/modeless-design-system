import * as React from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "../../lib/utils";
import { ModelessButton } from "./modeless-button";
import { SignalBadge } from "./signal-badge";

type ArtifactStatus = "live" | "ready" | "beta" | "archived" | "experimental" | "warning" | "success" | "error" | "stable" | "deprecated";

export interface ArtifactCardProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
  codename?: string;
  version?: string;
  status?: ArtifactStatus;
  description: string;
  tags?: string[];
  updatedAt?: string;
  actions?: React.ReactNode;
  showStatusStrip?: boolean;
}

export function ArtifactCard({
  className,
  title,
  codename,
  version,
  status = "experimental",
  description,
  tags = [],
  updatedAt,
  actions,
  showStatusStrip = true,
  ...props
}: ArtifactCardProps) {
  return (
    <article
      className={cn(
        "artifact-angle artifact-angle-frame group crosshair-corners relative overflow-hidden border border-border bg-card text-card-foreground transition-colors hover:border-primary/70",
        className,
      )}
      {...props}
    >
      {showStatusStrip && <div aria-hidden="true" className="h-2 border-b border-border artifact-label-strip" />}
      <div className="grid gap-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-micro text-muted-foreground">{codename ?? "artifact"} {version ? `/ ${version}` : ""}</p>
            <h3 className="mt-1 font-display text-2xl uppercase leading-none glitch-offset">{title}</h3>
          </div>
          <SignalBadge variant={status}>{status}</SignalBadge>
        </div>
        <p className="max-w-prose text-sm leading-6 text-muted-foreground">{description}</p>
        <div className="grid grid-cols-2 gap-px border border-border bg-border text-micro">
          <div className="bg-background px-2 py-1 text-muted-foreground">UPDATED</div>
          <div className="bg-background px-2 py-1 text-right">{updatedAt ?? "UNSTAMPED"}</div>
          <div className="bg-background px-2 py-1 text-muted-foreground">TAGS</div>
          <div className="bg-background px-2 py-1 text-right">{tags.length}</div>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span key={tag} className="border border-border bg-muted px-2 py-1 text-micro text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between gap-3">
          {actions ?? (
            <ModelessButton variant="outline" size="sm">
              inspect <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
            </ModelessButton>
          )}
          <span aria-hidden="true" className="h-7 w-7 border border-border bg-grid-dotted" />
        </div>
      </div>
    </article>
  );
}
