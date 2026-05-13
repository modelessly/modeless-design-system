import type * as React from "react";
import { ArrowRight, ExternalLink, FileLock2, Sparkles, Table2 } from "lucide-react";
import { cn } from "../../lib/utils";
import type { ModelessMotionIntensity } from "../../tokens";
import { GenerativeField } from "./generative-field";
import { modelessButtonVariants } from "./modeless-button";
import { ModelessPanel } from "./modeless-panel";
import { SignalBadge } from "./signal-badge";

export type ProductStatus =
  | "live"
  | "prototype"
  | "in-development"
  | "private-build"
  | "concept"
  | "open-source-soon";

export type ProductAccent = "privacy" | "finance" | "design" | "workflow" | "experimental" | "infrastructure";

export interface ProductCardData {
  title: string;
  slug: string;
  status: ProductStatus;
  category: string;
  summary: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  externalUrl?: string;
  tags: string[];
  maturityLevel: number;
  accent: ProductAccent;
}

export const productStatusMeta: Record<ProductStatus, { label: string; description: string }> = {
  live: { label: "Live", description: "Available to use now" },
  prototype: { label: "Prototype", description: "Working concept or early usable version" },
  "in-development": { label: "In development", description: "Actively being built" },
  "private-build": { label: "Private build", description: "Currently built for personal or limited use" },
  concept: { label: "Concept", description: "Defined idea, not yet public" },
  "open-source-soon": { label: "Open source soon", description: "Planned for public release" },
};

const statusVariant: Record<ProductStatus, React.ComponentProps<typeof SignalBadge>["variant"]> = {
  live: "live",
  prototype: "beta",
  "in-development": "experimental",
  "private-build": "warning",
  concept: "stable",
  "open-source-soon": "experimental",
};

const accentClass: Record<ProductAccent, string> = {
  privacy: "text-[hsl(var(--product-privacy))]",
  finance: "text-[hsl(var(--product-finance))]",
  design: "text-[hsl(var(--product-design))]",
  workflow: "text-[hsl(var(--product-workflow))]",
  experimental: "text-[hsl(var(--product-experimental))]",
  infrastructure: "text-[hsl(var(--product-infrastructure))]",
};

export function SectionHeader({ label, title, copy }: { label: string; title: string; copy?: string }) {
  return (
    <div className="border-b border-border p-4 md:p-6">
      <p className="text-micro text-muted-foreground">{label}</p>
      <h2 className="mt-2 max-w-[calc(100vw-2rem)] whitespace-normal break-words font-display text-3xl uppercase leading-none md:max-w-none md:text-5xl">{title}</h2>
      {copy ? <p className="mt-4 max-w-[calc(100vw-2rem)] text-sm leading-6 text-muted-foreground md:max-w-3xl">{copy}</p> : null}
    </div>
  );
}

export function ProductCard({
  product,
  href = product.externalUrl || product.primaryCtaHref || `/products/${product.slug}`,
  motion = "subtle",
}: {
  product: ProductCardData;
  href?: string;
  motion?: ModelessMotionIntensity;
}) {
  const external = /^https?:\/\//.test(href);

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      aria-label={`View ${product.title}`}
      className={cn("artifact-angle artifact-angle-frame live-surface group relative flex min-h-[25rem] flex-col overflow-hidden border border-border bg-card text-card-foreground transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background", `modeless-motion-${motion}`)}
    >
      <div className="relative h-32 overflow-hidden border-b border-border bg-background">
        <ProductVisual product={product} motion={motion} />
        <div className="absolute right-3 top-3">
          <ProductStatusBadge status={product.status} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div>
          <ProductCategoryLabel category={product.category} accent={product.accent} />
          <h3 className="mt-2 font-display text-3xl uppercase leading-none glitch-offset">{product.title}</h3>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">{product.summary}</p>
        <div className="mt-auto grid gap-4">
          <ProductMaturityMeter level={product.maturityLevel} motion={motion} />
          <TagList tags={product.tags} />
          <div className="flex items-center justify-between border-t border-border pt-3 text-micro text-muted-foreground">
            <span>{external ? "External site" : productStatusMeta[product.status].description}</span>
            {external ? (
              <ExternalLink aria-hidden="true" className="h-4 w-4 text-primary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            ) : (
              <ArrowRight aria-hidden="true" className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
            )}
          </div>
        </div>
      </div>
    </a>
  );
}

function ProductVisual({ product, motion }: { product: ProductCardData; motion: ModelessMotionIntensity }) {
  if (product.slug === "forgetmesweden") return <RedactionRegistryVisual motion={motion} />;
  if (product.slug === "dynomite") return <FormulaExtractionVisual motion={motion} />;
  if (product.slug === "polaris") return <ScenarioStarfieldVisual motion={motion} />;
  if (product.slug === "modeless-design-system") return <ComponentBlueprintVisual motion={motion} />;

  return (
    <GenerativeField
      variant={product.accent === "workflow" ? "visualizer" : product.accent === "design" ? "ascii" : "feed"}
      className="h-full min-h-0 border-0 opacity-75"
      seedLabel={product.category.toUpperCase()}
      animated
      motion={motion}
    />
  );
}

function VisualShell({ children, label, tone, motion }: { children: React.ReactNode; label: string; tone: string; motion: ModelessMotionIntensity }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden bg-grid-thin p-3", `modeless-motion-${motion}`)}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,hsl(var(--primary)/0.16),transparent_34%),radial-gradient(circle_at_78%_42%,hsl(var(--accent)/0.18),transparent_34%)]" />
      <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(115deg,transparent_0%,transparent_44%,hsl(var(--foreground)/0.12)_50%,transparent_56%,transparent_100%)] [background-size:240%_240%]" />
      <div className="relative h-full">
        <p className={cn("absolute left-1 top-0 z-10 font-mono text-[0.58rem] uppercase tracking-[0.18em]", tone)}>{label}</p>
        {children}
      </div>
    </div>
  );
}

function RedactionRegistryVisual({ motion }: { motion: ModelessMotionIntensity }) {
  const rows = [
    ["NAMN", "████████", "ID-427"],
    ["ADRESS", "██████ 12", "MASK"],
    ["TELE", "███ ██ ██", "DROP"],
    ["PERSON", "████████", "LOCK"],
  ];

  return (
    <VisualShell label="redaction registry" tone="text-[hsl(var(--product-privacy))]" motion={motion}>
      <div className="absolute left-2 top-6 grid w-[66%] gap-1">
        {rows.map((row, index) => (
          <div key={row[0]} className="grid grid-cols-[3.2rem_1fr_2.4rem] border border-border/80 bg-background/76 font-mono text-[0.56rem] leading-none text-muted-foreground">
            <span className="border-r border-border/70 px-1.5 py-1.5 text-[hsl(var(--product-privacy))]">{row[0]}</span>
            <span className="border-r border-border/70 px-1.5 py-1.5 text-foreground/80">{row[1]}</span>
            <span className={cn("px-1 py-1.5 text-right", index === 3 ? "text-primary" : "text-muted-foreground")}>{row[2]}</span>
          </div>
        ))}
      </div>
      <div className="absolute right-4 top-6 h-20 w-16 border border-[hsl(var(--product-privacy)/0.7)] bg-[hsl(var(--product-privacy)/0.08)]">
        <div className="absolute left-5 top-2 h-5 w-6 rounded-t-full border-2 border-primary border-b-0" />
        <FileLock2 aria-hidden="true" className="absolute left-5 top-8 h-6 w-6 text-primary" />
        <div className="absolute bottom-2 left-2 right-2 h-1 bg-[hsl(var(--product-privacy)/0.7)]" />
      </div>
      <div className="absolute bottom-3 left-3 right-3 flex gap-1">
        {[36, 18, 54, 28, 44, 12, 60].map((width, index) => (
          <span key={index} className="h-1 bg-foreground/75" style={{ width }} />
        ))}
      </div>
    </VisualShell>
  );
}

function FormulaExtractionVisual({ motion }: { motion: ModelessMotionIntensity }) {
  const cells = Array.from({ length: 24 });
  const nodes = [
    { x: 176, y: 34, label: "schema" },
    { x: 224, y: 64, label: "flow" },
    { x: 174, y: 94, label: "app" },
  ];

  return (
    <VisualShell label="formula extraction graph" tone="text-[hsl(var(--product-workflow))]" motion={motion}>
      <div className="absolute left-2 top-7 grid w-32 grid-cols-6 gap-px">
        {cells.map((_, index) => (
          <span
            key={index}
            className={cn("h-4 border border-border/70 bg-background/70", [2, 8, 9, 15].includes(index) && "bg-[hsl(var(--product-workflow)/0.28)] border-[hsl(var(--product-workflow)/0.75)]")}
          />
        ))}
      </div>
      <p className="absolute left-4 top-[4.7rem] border border-[hsl(var(--product-workflow)/0.7)] bg-background/90 px-2 py-1 font-mono text-[0.56rem] text-[hsl(var(--product-workflow))]">=SUM(IF())</p>
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 320 128" aria-hidden="true">
        <path d="M120 42 C145 35, 152 32, 176 34" fill="none" stroke="hsl(var(--product-workflow))" strokeWidth="1.5" strokeDasharray="4 4" />
        <path d="M120 62 C150 62, 180 62, 224 64" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5" />
        <path d="M120 82 C148 94, 152 98, 174 94" fill="none" stroke="hsl(var(--radar-blue))" strokeWidth="1.5" strokeDasharray="7 5" />
        {nodes.map((node) => (
          <g key={node.label}>
            <rect x={node.x} y={node.y - 10} width="62" height="20" fill="hsl(var(--background) / 0.88)" stroke="hsl(var(--border))" />
            <circle cx={node.x} cy={node.y} r="3" fill="hsl(var(--primary))" />
            <text x={node.x + 10} y={node.y + 3} fill="hsl(var(--foreground))" fontSize="8" fontFamily="monospace">{node.label}</text>
          </g>
        ))}
      </svg>
    </VisualShell>
  );
}

function ScenarioStarfieldVisual({ motion }: { motion: ModelessMotionIntensity }) {
  const points = [
    { x: 44, y: 88 },
    { x: 82, y: 62 },
    { x: 126, y: 72 },
    { x: 174, y: 48 },
    { x: 224, y: 66 },
    { x: 268, y: 38 },
  ];

  return (
    <VisualShell label="scenario navigation starfield" tone="text-[hsl(var(--product-finance))]" motion={motion}>
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 320 128" aria-hidden="true">
        <path d="M44 88 C82 38, 132 34, 268 38" fill="none" stroke="hsl(var(--product-finance))" strokeWidth="1.5" />
        <path d="M44 88 C96 86, 142 96, 268 74" fill="none" stroke="hsl(var(--radar-blue))" strokeWidth="1.2" strokeDasharray="6 5" />
        <path d="M44 88 C98 105, 178 112, 268 96" fill="none" stroke="hsl(var(--electric-purple))" strokeWidth="1.2" strokeDasharray="2 5" />
        <g transform="translate(166 52)">
          <path d="M0 -20 L5 -5 L20 0 L5 5 L0 20 L-5 5 L-20 0 L-5 -5 Z" fill="hsl(var(--primary))" opacity="0.9" />
          <circle r="28" fill="none" stroke="hsl(var(--primary) / 0.28)" />
          <circle r="42" fill="none" stroke="hsl(var(--border))" strokeDasharray="3 5" />
        </g>
        {points.map((point, index) => (
          <circle key={index} cx={point.x} cy={point.y} r={index === points.length - 1 ? 4 : 2.5} fill={index === points.length - 1 ? "hsl(var(--primary))" : "hsl(var(--foreground))"} />
        ))}
      </svg>
      <div className="absolute bottom-3 left-3 right-3 grid grid-cols-3 gap-1 font-mono text-[0.54rem] text-muted-foreground">
        <span>BASELINE</span>
        <span>RETIRE</span>
        <span className="text-primary">2058</span>
      </div>
    </VisualShell>
  );
}

function ComponentBlueprintVisual({ motion }: { motion: ModelessMotionIntensity }) {
  const frames = [
    "left-4 top-8 h-8 w-20",
    "left-28 top-6 h-12 w-16",
    "left-48 top-9 h-7 w-24",
    "left-7 top-20 h-8 w-28",
    "left-44 top-20 h-9 w-20",
  ];

  return (
    <VisualShell label="component blueprint wall" tone="text-[hsl(var(--product-design))]" motion={motion}>
      {frames.map((frame, index) => (
        <div key={frame} className={cn("artifact-angle artifact-angle-sm artifact-angle-frame absolute border border-[hsl(var(--product-design)/0.65)] bg-background/78 p-1", frame)}>
          <div className="h-1 w-1/2 bg-[hsl(var(--product-design)/0.8)]" />
          <div className="mt-2 grid gap-1">
            <span className="h-1 bg-foreground/65" />
            <span className="h-1 w-2/3 bg-border" />
          </div>
          {index === 1 ? <Sparkles aria-hidden="true" className="absolute bottom-1 right-1 h-3 w-3 text-primary" /> : null}
          {index === 3 ? <Table2 aria-hidden="true" className="absolute bottom-1 right-1 h-3 w-3 text-[hsl(var(--radar-blue))]" /> : null}
        </div>
      ))}
      <div className="absolute bottom-3 right-4 grid grid-cols-5 gap-1">
        {["bg-primary", "bg-[hsl(var(--radar-blue))]", "bg-[hsl(var(--electric-purple))]", "bg-[hsl(var(--signal-pink))]", "bg-foreground"].map((item) => (
          <span key={item} className={cn("h-3 w-3 border border-border", item)} />
        ))}
      </div>
    </VisualShell>
  );
}

export function ProductStatusBadge({ status }: { status: ProductStatus }) {
  return <SignalBadge variant={statusVariant[status]}>{productStatusMeta[status].label}</SignalBadge>;
}

export function ProductCategoryLabel({ category, accent }: { category: string; accent: ProductAccent }) {
  return <p className={cn("text-micro", accentClass[accent])}>{category}</p>;
}

export function ProductMaturityMeter({ level, motion = "subtle" }: { level: number; motion?: ModelessMotionIntensity }) {
  const boundedLevel = Math.max(0, Math.min(5, Math.round(level)));

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-micro text-muted-foreground">
        <span>Maturity</span>
        <span>{boundedLevel}/5</span>
      </div>
      <div className="grid grid-cols-5 gap-1" aria-label={`Maturity level ${boundedLevel} of 5`}>
        {Array.from({ length: 5 }).map((_, index) => (
          <span
            key={index}
            className={cn("h-2 border border-border", `modeless-motion-${motion}`, index < boundedLevel ? "motion-data-cell bg-primary" : "bg-muted")}
            style={{ "--motion-index": index } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}

export function TagList({ tags }: { tags: string[] }) {
  if (!tags.length) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <span key={tag} className="border border-border bg-muted px-2 py-1 text-micro text-muted-foreground">
          {tag}
        </span>
      ))}
    </div>
  );
}

export function ProductCTACluster({ product }: { product: ProductCardData }) {
  const primaryExternal = /^https?:\/\//.test(product.primaryCtaHref);
  const secondaryExternal = /^https?:\/\//.test(product.secondaryCtaHref);

  return (
    <div className="flex flex-wrap gap-3">
      <a
        href={product.primaryCtaHref}
        target={primaryExternal ? "_blank" : undefined}
        rel={primaryExternal ? "noopener noreferrer" : undefined}
        className={modelessButtonVariants({ variant: "signal" })}
      >
        {product.primaryCtaLabel}
        {primaryExternal ? <ExternalLink aria-hidden="true" className="h-4 w-4" /> : <ArrowRight aria-hidden="true" className="h-4 w-4" />}
      </a>
      <a
        href={product.secondaryCtaHref}
        target={secondaryExternal ? "_blank" : undefined}
        rel={secondaryExternal ? "noopener noreferrer" : undefined}
        className={modelessButtonVariants({ variant: "outline" })}
      >
        {product.secondaryCtaLabel}
        {secondaryExternal ? <ExternalLink aria-hidden="true" className="h-4 w-4" /> : <ArrowRight aria-hidden="true" className="h-4 w-4" />}
      </a>
    </div>
  );
}

export function StatusLegend({ statuses }: { statuses?: ProductStatus[] }) {
  const items = statuses ?? (Object.keys(productStatusMeta) as ProductStatus[]);

  return (
    <ModelessPanel title="Status Legend" eyebrow="product states">
      <div className="grid gap-2">
        {items.map((status) => (
          <div key={status} className="grid gap-2 border border-border bg-background p-3 sm:grid-cols-[12rem_1fr]">
            <ProductStatusBadge status={status} />
            <p className="text-sm text-muted-foreground">{productStatusMeta[status].description}</p>
          </div>
        ))}
      </div>
    </ModelessPanel>
  );
}
