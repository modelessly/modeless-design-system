import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

const publicDeclarationFiles = [
  "dist/index.d.ts",
  "dist/components/modeless/index.d.ts",
  "dist/components/modeless/visualizations/index.d.ts",
  "dist/components/modeless/commerce/index.d.ts",
  "dist/tokens/index.d.ts",
  "dist/tokens/colors.d.ts",
  "dist/tokens/typography.d.ts",
  "dist/tokens/motion.d.ts",
];

const forbiddenPublicNames = [
  "modelessButtonVariants",
  "modelessPanelVariants",
  "modelessCardVariants",
  "glyphGridVariants",
  "generativeFieldVariants",
  "VisualizationFrame",
  "VisualizationBaseProps",
  "toneColor",
  "scoreTone",
  "percent",
  "CommerceFrame",
  "CommerceFrameProps",
  "CommerceMetric",
  "clampPercent",
  "commerceTone",
  "cn",
];

const requiredExports = {
  "dist/index.d.ts": ['export * from "./components/modeless"', 'export * from "./tokens"'],
  "dist/components/modeless/index.d.ts": [
    "ModelessButton",
    "ModelessPanel",
    "ModelessTextField",
    "ModelessDropzone",
    "ModelessDialog",
    "ProductCard",
    "productStatusMeta",
    "ModelessMotionIntensity",
    'export * from "./visualizations"',
    'export * from "./commerce"',
  ],
  "dist/components/modeless/visualizations/index.d.ts": [
    "AgentTraceMap",
    "PromptStackVisualizer",
    "ContextWindowHeatmap",
    "ConfidenceGradientMatrix",
    "HumanAIHandoffTimeline",
    "TokenEconomyMeter",
    "OnChainFlowGraph",
    "SmartContractStateMachine",
    "GovernancePulseBoard",
    "TrustSurfaceMap",
    "SignalBloom",
    "CanvasSurface",
    "useCanvasAnimation",
    "ModelessGlobe",
    "ModelessVisualizationPalette",
    "modelessVisualizationPalette",
    "resolveModelessVisualizationPalette",
  ],
  "dist/components/modeless/commerce/index.d.ts": [
    "AgentPaymentAuthorization",
    "ScopedSpendControl",
    "SharedPaymentTokenCard",
    "AgenticCheckoutSession",
    "X402PaymentHandshake",
    "AgentReceipt",
    "DelegatedPaymentTimeline",
    "CommerceTrustBoundary",
    "ProductFeedReadinessPanel",
    "MachinePaymentMeter",
  ],
  "dist/tokens/index.d.ts": ['export * from "./colors"', 'export * from "./typography"', 'export * from "./motion"'],
  "dist/tokens/colors.d.ts": ["modelessColors", "modelessVisualizationColors", "semanticColors"],
  "dist/tokens/typography.d.ts": ["modelessTypography"],
  "dist/tokens/motion.d.ts": ["ModelessMotionIntensity", "modelessMotion"],
};

const failures = [];
const fileContents = new Map();

for (const relativePath of publicDeclarationFiles) {
  const absolutePath = path.join(root, relativePath);
  try {
    fileContents.set(relativePath, await fs.readFile(absolutePath, "utf8"));
  } catch (error) {
    failures.push(`Missing public declaration file: ${relativePath} (${error.message})`);
  }
}

for (const [relativePath, contents] of fileContents) {
  for (const name of forbiddenPublicNames) {
    const pattern = new RegExp(`\\b${name}\\b`);
    if (pattern.test(contents)) {
      failures.push(`Forbidden public API name "${name}" appears in ${relativePath}`);
    }
  }
}

for (const [relativePath, expectedExports] of Object.entries(requiredExports)) {
  const contents = fileContents.get(relativePath);
  if (!contents) continue;

  for (const expectedExport of expectedExports) {
    if (!contents.includes(expectedExport)) {
      failures.push(`Expected public export "${expectedExport}" was not found in ${relativePath}`);
    }
  }
}

if (failures.length > 0) {
  console.error("Public API check failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Public API check passed for ${publicDeclarationFiles.length} declaration files.`);
