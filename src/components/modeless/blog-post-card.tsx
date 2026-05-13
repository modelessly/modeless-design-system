import * as React from "react";
import { cn } from "../../lib/utils";
import { SignalBadge } from "./signal-badge";

export interface BlogPostCardProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
  type: "daily prompt" | "weekly essay" | "field note" | "release note";
  generatedBy?: string;
  editedBy?: string;
  date: string;
  excerpt: string;
  status?: "live" | "beta" | "archived" | "experimental" | "stable";
}

export function BlogPostCard({
  className,
  title,
  type,
  generatedBy,
  editedBy,
  date,
  excerpt,
  status = "stable",
  ...props
}: BlogPostCardProps) {
  return (
    <article className={cn("artifact-angle artifact-angle-frame grid gap-4 border border-border bg-card p-4", className)} {...props}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-micro text-muted-foreground">{date} / {type}</p>
          <h3 className="mt-2 max-w-xl font-display text-2xl uppercase leading-none">{title}</h3>
        </div>
        <SignalBadge variant={status}>{status}</SignalBadge>
      </div>
      <p className="text-sm leading-6 text-muted-foreground">{excerpt}</p>
      <dl className="grid grid-cols-2 gap-px border border-border bg-border text-micro">
        <div className="bg-background p-2">
          <dt className="text-muted-foreground">GENERATED</dt>
          <dd>{generatedBy ?? "human initiated"}</dd>
        </div>
        <div className="bg-background p-2">
          <dt className="text-muted-foreground">EDITED</dt>
          <dd>{editedBy ?? "studio desk"}</dd>
        </div>
      </dl>
    </article>
  );
}
