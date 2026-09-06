export type ModelessVisualizationPalette = {
  background: string;
  foreground: string;
  muted: string;
  border: string;
  structure: {
    leaf: string;
    cyan: string;
    graphite: string;
  };
  active: {
    lime: string;
    mint: string;
    electricBlue: string;
  };
  warning: {
    amber: string;
    warmYellow: string;
  };
  risk: {
    rose: string;
    coral: string;
    redOrange: string;
  };
  trust: {
    violet: string;
    blueViolet: string;
  };
  provenance: {
    blue: string;
    grayLavender: string;
  };
};

const TOKENS = {
  background: "--off-black",
  foreground: "--bone",
  muted: "--concrete",
  border: "--border",
  structureLeaf: "--viz-structure-leaf",
  structureCyan: "--viz-structure-cyan",
  structureGraphite: "--viz-structure-graphite",
  activeLime: "--viz-active-lime",
  activeMint: "--viz-active-mint",
  activeElectricBlue: "--viz-active-electric-blue",
  warningAmber: "--viz-warning-amber",
  warningWarmYellow: "--viz-warning-warm-yellow",
  riskRose: "--viz-risk-rose",
  riskCoral: "--viz-risk-coral",
  riskRedOrange: "--viz-risk-red-orange",
  trustViolet: "--viz-trust-violet",
  trustBlueViolet: "--viz-trust-blue-violet",
  provenanceBlue: "--viz-provenance-blue",
  provenanceGrayLavender: "--viz-provenance-gray-lavender",
} as const;

export const modelessVisualizationPalette: ModelessVisualizationPalette = {
  background: "0 0% 3%",
  foreground: "43 52% 87%",
  muted: "0 0% 55%",
  border: "0 0% 22%",
  structure: {
    leaf: "100 40% 68%",
    cyan: "190 46% 66%",
    graphite: "210 6% 42%",
  },
  active: {
    lime: "82 66% 66%",
    mint: "165 34% 62%",
    electricBlue: "214 84% 66%",
  },
  warning: {
    amber: "44 64% 70%",
    warmYellow: "54 78% 72%",
  },
  risk: {
    rose: "344 50% 75%",
    coral: "8 66% 68%",
    redOrange: "15 82% 62%",
  },
  trust: {
    violet: "266 38% 74%",
    blueViolet: "246 52% 72%",
  },
  provenance: {
    blue: "212 34% 68%",
    grayLavender: "246 15% 66%",
  },
};

function tokenValue(name: string, fallback: string): string {
  if (typeof window === "undefined" || typeof document === "undefined") return fallback;
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

export function resolveModelessVisualizationPalette(): ModelessVisualizationPalette {
  const p = modelessVisualizationPalette;
  return {
    background: tokenValue(TOKENS.background, p.background),
    foreground: tokenValue(TOKENS.foreground, p.foreground),
    muted: tokenValue(TOKENS.muted, p.muted),
    border: tokenValue(TOKENS.border, p.border),
    structure: {
      leaf: tokenValue(TOKENS.structureLeaf, p.structure.leaf),
      cyan: tokenValue(TOKENS.structureCyan, p.structure.cyan),
      graphite: tokenValue(TOKENS.structureGraphite, p.structure.graphite),
    },
    active: {
      lime: tokenValue(TOKENS.activeLime, p.active.lime),
      mint: tokenValue(TOKENS.activeMint, p.active.mint),
      electricBlue: tokenValue(TOKENS.activeElectricBlue, p.active.electricBlue),
    },
    warning: {
      amber: tokenValue(TOKENS.warningAmber, p.warning.amber),
      warmYellow: tokenValue(TOKENS.warningWarmYellow, p.warning.warmYellow),
    },
    risk: {
      rose: tokenValue(TOKENS.riskRose, p.risk.rose),
      coral: tokenValue(TOKENS.riskCoral, p.risk.coral),
      redOrange: tokenValue(TOKENS.riskRedOrange, p.risk.redOrange),
    },
    trust: {
      violet: tokenValue(TOKENS.trustViolet, p.trust.violet),
      blueViolet: tokenValue(TOKENS.trustBlueViolet, p.trust.blueViolet),
    },
    provenance: {
      blue: tokenValue(TOKENS.provenanceBlue, p.provenance.blue),
      grayLavender: tokenValue(TOKENS.provenanceGrayLavender, p.provenance.grayLavender),
    },
  };
}

export function hsl(triple: string, alpha = 1): string {
  return alpha >= 1 ? `hsl(${triple})` : `hsl(${triple} / ${alpha})`;
}

export function parseHslTriple(triple: string): [number, number, number] {
  const m = triple.match(/([\d.]+)\s+([\d.]+)%\s+([\d.]+)%/);
  return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : [0, 0, 100];
}

export function mixHsl(a: string, b: string, k: number): string {
  const t = Math.max(0, Math.min(1, k));
  const [ah, as, al] = parseHslTriple(a);
  const [bh, bs, bl] = parseHslTriple(b);
  const h = ah + (bh - ah) * t;
  const s = as + (bs - as) * t;
  const l = al + (bl - al) * t;
  return `${h.toFixed(1)} ${s.toFixed(1)}% ${l.toFixed(1)}%`;
}
