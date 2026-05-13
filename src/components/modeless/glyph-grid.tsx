import * as React from "react";
import { Asterisk, Box, CircleDot, Crosshair, Diamond, Eye, Hexagon, Orbit, Radio, Triangle } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const icons = [Asterisk, Eye, Crosshair, Box, Orbit, Radio, Triangle, Diamond, Hexagon, CircleDot];
const glyphs = ["+", "x", "::", "01", "R", "M", "[ ]", "/"];

export const glyphGridVariants = cva("artifact-angle artifact-angle-frame grid border border-border bg-card", {
  variants: {
    density: {
      low: "grid-cols-4",
      medium: "grid-cols-6",
      high: "grid-cols-8",
    },
    variant: {
      default: "text-foreground",
      signal: "text-primary",
      blueprint: "text-[hsl(var(--radar-blue))]",
      artifact: "surface-print",
    },
  },
  defaultVariants: {
    density: "medium",
    variant: "default",
  },
});

export interface GlyphGridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glyphGridVariants> {
  interactive?: boolean;
}

export function GlyphGrid({ className, density, variant, interactive = false, ...props }: GlyphGridProps) {
  const count = density === "high" ? 48 : density === "low" ? 16 : 30;
  return (
    <div className={cn(glyphGridVariants({ density, variant }), className)} {...props}>
      {Array.from({ length: count }).map((_, index) => {
        const Icon = icons[index % icons.length];
        const glyph = glyphs[index % glyphs.length];
        return (
          <button
            key={index}
            type="button"
            tabIndex={interactive ? 0 : -1}
            aria-label={interactive ? `Glyph ${index + 1}` : undefined}
            aria-hidden={!interactive}
            className={cn(
              "flex aspect-square items-center justify-center border-b border-r border-border/80 bg-background/50 font-mono text-[0.65rem] transition-colors",
              interactive && "hover:bg-primary hover:text-primary-foreground focus-visible:z-10",
            )}
          >
            {index % 3 === 0 ? <Icon className="h-4 w-4" /> : glyph}
          </button>
        );
      })}
    </div>
  );
}
