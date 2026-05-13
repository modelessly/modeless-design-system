import * as React from "react";
import { cn } from "../../lib/utils";

export interface SpecimenCardProps extends React.HTMLAttributes<HTMLElement> {
  label: string;
  value?: React.ReactNode;
  meta?: React.ReactNode;
  swatch?: string;
  inverted?: boolean;
}

export function SpecimenCard({ className, label, value, meta, swatch, inverted = false, children, ...props }: SpecimenCardProps) {
  return (
    <article
      className={cn(
        "artifact-angle artifact-angle-sm artifact-angle-frame border border-border bg-card p-3 text-card-foreground",
        inverted && "surface-print border-artifact",
        className,
      )}
      {...props}
    >
      {swatch && <div className="mb-3 h-14 border border-current/25" style={{ background: swatch }} />}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-micro text-muted-foreground">{label}</p>
          {value && <div className="mt-2 font-display text-2xl uppercase leading-none">{value}</div>}
        </div>
        {meta && <div className="text-right text-micro text-muted-foreground">{meta}</div>}
      </div>
      {children && <div className="mt-3 text-sm leading-5 text-muted-foreground">{children}</div>}
    </article>
  );
}
