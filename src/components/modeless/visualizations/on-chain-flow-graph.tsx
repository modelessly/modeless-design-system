import * as React from "react";
import { Landmark, Link2, ShieldAlert, Wallet } from "lucide-react";
import { cn } from "../../../lib/utils";
import type { ModelessMotionIntensity } from "../../../tokens";
import { toneColor, VisualizationFrame } from "./shared";

export type ChainNodeType = "wallet" | "contract" | "bridge" | "exchange" | "protocol";

export interface ChainNode {
  id: string;
  label: string;
  type: ChainNodeType;
  risk?: "low" | "medium" | "high";
  x: number;
  y: number;
  value?: string;
}

export interface ChainEdge {
  id: string;
  from: string;
  to: string;
  amount: string;
  gas?: string;
  risk?: "low" | "medium" | "high";
}

export interface OnChainFlowGraphProps extends React.HTMLAttributes<HTMLDivElement> {
  nodes: ChainNode[];
  edges: ChainEdge[];
  selectedNode?: string;
  timeRange?: string;
  showRisk?: boolean;
  showGas?: boolean;
  animate?: boolean;
  motion?: ModelessMotionIntensity;
}

const nodeIcon = { wallet: Wallet, contract: Link2, bridge: Link2, exchange: Landmark, protocol: ShieldAlert };

export function OnChainFlowGraph({
  nodes,
  edges,
  selectedNode,
  timeRange = "24h",
  showRisk = true,
  showGas = true,
  animate = true,
  motion = "subtle",
  className,
  ...props
}: OnChainFlowGraphProps) {
  const selected = selectedNode ?? nodes[0]?.id;

  return (
    <VisualizationFrame title="On-Chain Flow Graph" eyebrow={`chain flow / ${timeRange}`} motion={motion} className={className} {...props}>
      <div className="grid gap-4 lg:grid-cols-[1fr_12rem]">
        <svg className="min-h-80 w-full bg-grid-isometric" viewBox="0 0 640 360" role="img" aria-label="On-chain asset flow between wallets contracts and protocols">
          {edges.map((edge, index) => {
            const from = nodes.find((node) => node.id === edge.from);
            const to = nodes.find((node) => node.id === edge.to);
            if (!from || !to) return null;
            const color = showRisk ? toneColor(edge.risk) : "hsl(var(--primary))";
            return (
              <g key={edge.id}>
                <path
                  d={`M ${from.x} ${from.y} C ${(from.x + to.x) / 2} ${from.y - 70}, ${(from.x + to.x) / 2} ${to.y + 70}, ${to.x} ${to.y}`}
                  fill="none"
                  stroke={color}
                  strokeOpacity="0.7"
                  strokeWidth="2"
                />
                {animate && motion !== "off" ? (
                  <circle r="4" fill={color} className="motion-orbital" style={{ "--motion-index": index } as React.CSSProperties}>
                    <animateMotion dur={`${7 + index * 1.5}s`} repeatCount="indefinite" path={`M ${from.x} ${from.y} C ${(from.x + to.x) / 2} ${from.y - 70}, ${(from.x + to.x) / 2} ${to.y + 70}, ${to.x} ${to.y}`} />
                  </circle>
                ) : null}
              </g>
            );
          })}
          {nodes.map((node) => {
            const Icon = nodeIcon[node.type];
            const active = node.id === selected;
            return (
              <g key={node.id}>
                <circle cx={node.x} cy={node.y} r={active ? 34 : 26} fill="hsl(var(--background) / 0.92)" stroke={showRisk ? toneColor(node.risk) : "hsl(var(--border))"} strokeWidth={active ? 2 : 1} />
                <Icon aria-hidden={true} x={node.x - 9} y={node.y - 9} width="18" height="18" className="text-primary" />
                <text x={node.x} y={node.y + 48} textAnchor="middle" fill="hsl(var(--foreground))" fontFamily="monospace" fontSize="10">{node.label}</text>
              </g>
            );
          })}
        </svg>
        <aside className="grid content-start gap-2">
          {edges.slice(0, 4).map((edge) => (
            <div key={edge.id} className="border border-border bg-background p-2">
              <p className="text-micro text-muted-foreground">{edge.from} to {edge.to}</p>
              <p className="font-mono text-sm text-primary">{edge.amount}</p>
              {showGas ? <p className="text-micro text-muted-foreground">gas {edge.gas}</p> : null}
            </div>
          ))}
        </aside>
      </div>
    </VisualizationFrame>
  );
}
