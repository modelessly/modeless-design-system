import * as React from "react";
import { createRoot, type Root } from "react-dom/client";
import {
  ModelessButton,
  ModelessCard,
  ModelessCardContent,
  ModelessCardFooter,
  ModelessCardHeader,
  ModelessCheckbox,
  ModelessDialog,
  ModelessDivider,
  ModelessDropzone,
  ModelessGlobe,
  ModelessList,
  ModelessListItem,
  ModelessPanel,
  ModelessProgress,
  ModelessSegmentedControl,
  ModelessSelect,
  ModelessSwitch,
  ModelessTabs,
  ModelessTextArea,
  ModelessTextField,
  ModelessToast,
  SignalBadge,
  CanvasSurface,
  modelessColors,
  modelessVisualizationColors,
  modelessTypography,
  type CanvasFrameInfo,
  type ModelessMotionIntensity,
} from "@modeless/design-system";
import "@modeless/design-system/globals";
import "@modeless/design-system/styles";

const motion: ModelessMotionIntensity = "subtle";

const tabOptions = [
  { label: "General", value: "general" },
  { label: "Delivery", value: "delivery" },
  { label: "Audit", value: "audit" },
];

const cadenceOptions = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Manual", value: "manual" },
];

function ConsumerExample() {
  const [activeTab, setActiveTab] = React.useState("general");
  const [cadence, setCadence] = React.useState("weekly");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [toastVisible, setToastVisible] = React.useState(false);
  const [automationEnabled, setAutomationEnabled] = React.useState(true);
  const [budgetAlerts, setBudgetAlerts] = React.useState(true);
  const [fileName, setFileName] = React.useState<string>();
  const [taskState, setTaskState] = React.useState<"waiting" | "loaded" | "processing" | "complete">("waiting");

  const loadFiles = (files: File[]) => {
    setFileName(files[0]?.name);
    setTaskState("loaded");
  };

  const showToast = () => {
    setToastVisible(true);
    window.setTimeout(() => setToastVisible(false), 2800);
  };

  return (
    <main className="modeless-theme min-h-screen bg-background p-4 text-foreground md:p-8">
      <div className="mx-auto grid max-w-6xl gap-5">
        <header className="grid gap-4 border-b border-border pb-5 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="text-label text-muted-foreground">external builder smoke test</p>
            <h1 className="mt-3 font-display text-4xl uppercase leading-none md:text-6xl">Operations Settings</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
              A standalone Vite app consuming Modeless Design System through package imports, CSS exports, token exports, and generated TypeScript declarations.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 md:justify-end">
            <SignalBadge variant="live">package linked</SignalBadge>
            <SignalBadge variant="experimental">vite consumer</SignalBadge>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <StatusCard label="Sync health" value="96%" meta="12 integrations current" tone="success" />
          <StatusCard label="Queue depth" value="18" meta="4 need review" tone="default" />
          <StatusCard label="Monthly budget" value="$42.8k" meta="72% of limit" tone="warning" />
        </section>

        <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <ModelessGlobe
            seed="consumer-global-trust"
            label="Global trust and provenance globe"
            description="Trust, identity, and provenance shells remain readable as a static frame when reduced motion is enabled."
            variant="trust"
            motion={motion}
            metadata={
              <div className="grid grid-cols-3 gap-2">
                <MiniMetric label="regions" value="6" />
                <MiniMetric label="layers" value="3" />
                <MiniMetric label="freshness" value="12m" />
              </div>
            }
          />
          <SignalPressureStudy />
        </section>

        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <ModelessCard>
            <ModelessCardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-micro text-muted-foreground">control plane</p>
                  <h2 className="mt-1 font-display text-3xl uppercase leading-none">Workspace Settings</h2>
                </div>
                <ModelessSegmentedControl aria-label="Automation cadence" value={cadence} onValueChange={setCadence} options={cadenceOptions} />
              </div>
            </ModelessCardHeader>
            <ModelessCardContent className="grid gap-5">
              <ModelessTabs value={activeTab} onValueChange={setActiveTab} tabs={tabOptions}>
                {activeTab === "general" ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    <ModelessTextField label="Workspace name" defaultValue="Northstar Ops" required />
                    <ModelessSelect
                      label="Default environment"
                      defaultValue="production"
                      options={[
                        { label: "Production", value: "production" },
                        { label: "Staging", value: "staging" },
                        { label: "Sandbox", value: "sandbox" },
                      ]}
                    />
                    <div className="md:col-span-2">
                      <ModelessTextArea label="Operator note" defaultValue="Escalate payment and privacy policy changes before enabling autonomous delivery." />
                    </div>
                  </div>
                ) : null}

                {activeTab === "delivery" ? (
                  <div className="grid gap-4">
                    <ModelessSwitch
                      checked={automationEnabled}
                      onChange={(event) => setAutomationEnabled(event.currentTarget.checked)}
                      label="Automated delivery"
                      description="Let agents publish approved status updates on the selected cadence."
                    />
                    <ModelessCheckbox
                      checked={budgetAlerts}
                      onChange={(event) => setBudgetAlerts(event.currentTarget.checked)}
                      label="Budget alerts"
                      description="Notify operators when spend crosses a configured threshold."
                    />
                    <ModelessProgress label={`Delivery readiness / ${cadence}`} value={automationEnabled ? 82 : 48} tone={automationEnabled ? "default" : "warning"} />
                  </div>
                ) : null}

                {activeTab === "audit" ? (
                  <ModelessList>
                    <ModelessListItem heading="Policy review" description="Completed 8 minutes ago" trailing={<SignalBadge variant="success">passed</SignalBadge>} />
                    <ModelessListItem heading="Token scope check" description="Waiting on finance approval" trailing={<SignalBadge variant="beta">review</SignalBadge>} />
                    <ModelessListItem heading="Export retention" description="No files generated yet" trailing={<SignalBadge variant="archived">empty</SignalBadge>} />
                  </ModelessList>
                ) : null}
              </ModelessTabs>
            </ModelessCardContent>
            <ModelessCardFooter className="flex flex-wrap justify-end gap-2">
              <ModelessButton variant="outline" onClick={() => setDialogOpen(true)}>
                Review changes
              </ModelessButton>
              <ModelessButton variant="signal" onClick={showToast}>
                Save settings
              </ModelessButton>
            </ModelessCardFooter>
          </ModelessCard>

          <div className="grid gap-5">
            <ModelessPanel title="Package Surface" eyebrow="@modeless/design-system" motion={motion} actions={<SignalBadge variant="live">public API</SignalBadge>}>
              <div className="grid gap-4">
                <p className="text-sm leading-6 text-muted-foreground">
                  Components, theme variables, utility classes, tokens, and the <code className="font-mono text-primary">ModelessMotionIntensity</code> type are imported from the package contract.
                </p>
                <ModelessDivider label="tokens" />
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <TokenSwatch label="acid lime" value={modelessColors.acidLime} />
                  <TokenSwatch label="completion green" value={modelessColors.completionGreen} />
                  <TokenSwatch label="warning" value={modelessColors.warningOrange} />
                  <TokenSwatch label="viz mint" value={modelessVisualizationColors.activeMint} />
                </div>
                <p className="font-mono text-xs text-muted-foreground">Typography token: {modelessTypography.mono}</p>
              </div>
            </ModelessPanel>

            <ModelessPanel
              title="Local Import"
              eyebrow="task lifecycle"
              actions={
                <SignalBadge variant={taskState === "processing" ? "live" : taskState === "complete" ? "success" : taskState === "loaded" ? "ready" : "archived"}>
                  {taskState}
                </SignalBadge>
              }
            >
              <div className="grid gap-4">
                <ModelessDropzone
                  label="Source file"
                  description="Drag a local document here or choose a file. Accepted: PDF, CSV."
                  accept=".pdf,.csv"
                  fileName={fileName}
                  state={fileName ? "loaded" : "idle"}
                  disabled={taskState === "processing"}
                  onSelect={loadFiles}
                  onDrop={loadFiles}
                />
                <ModelessProgress
                  label="Import task"
                  value={taskState === "complete" ? 100 : taskState === "processing" ? 64 : 0}
                  tone={taskState === "complete" ? "success" : taskState === "processing" ? "default" : "muted"}
                />
                <div className="flex flex-wrap gap-2">
                  <ModelessButton
                    variant="signal"
                    disabled={!fileName || taskState === "processing" || taskState === "complete"}
                    onClick={() => setTaskState("processing")}
                  >
                    Start import
                  </ModelessButton>
                  <ModelessButton
                    variant="outline"
                    disabled={taskState !== "processing"}
                    onClick={() => setTaskState("complete")}
                  >
                    Mark complete
                  </ModelessButton>
                </div>
              </div>
            </ModelessPanel>
          </div>
        </div>
      </div>

      <ModelessDialog
        open={dialogOpen}
        heading="Review settings"
        description="This confirms the package dialog can be controlled from consumer state."
        onOpenChange={setDialogOpen}
        footer={
          <>
            <ModelessButton variant="ghost" onClick={() => setDialogOpen(false)}>
              Cancel
            </ModelessButton>
            <ModelessButton
              variant="signal"
              onClick={() => {
                setDialogOpen(false);
                showToast();
              }}
            >
              Confirm
            </ModelessButton>
          </>
        }
      >
        <div className="grid gap-3 text-sm leading-6 text-muted-foreground">
          <p>Cadence is set to {cadence}. Automation is {automationEnabled ? "enabled" : "paused"}.</p>
          <ModelessProgress label="Approval confidence" value={91} />
        </div>
      </ModelessDialog>

      {toastVisible ? (
        <div className="fixed bottom-4 right-4 z-50 w-[min(24rem,calc(100vw-2rem))]">
          <ModelessToast heading="Settings saved" description="Consumer state updated through packaged Modeless Design System controls." tone="success" />
        </div>
      ) : null}
    </main>
  );
}

function SignalPressureStudy() {
  const render = React.useCallback((info: CanvasFrameInfo) => {
    const { ctx, w, h, t, palette, reducedMotion } = info;
    const time = reducedMotion ? 7.5 : t;
    const cx = w / 2;
    const cy = h / 2;
    const bg = ctx.createRadialGradient(cx, cy, Math.min(w, h) * 0.05, cx, cy, Math.max(w, h) * 0.75);
    bg.addColorStop(0, "hsl(152 20% 10%)");
    bg.addColorStop(1, "hsl(0 0% 3%)");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    ctx.lineWidth = 1;
    for (let row = 0; row < 7; row++) {
      const y = (row + 1) * (h / 8);
      ctx.strokeStyle = `hsl(${palette.structure.graphite} / 0.24)`;
      ctx.beginPath();
      ctx.moveTo(w * 0.08, y);
      ctx.lineTo(w * 0.92, y);
      ctx.stroke();
    }

    for (let trace = 0; trace < 4; trace++) {
      ctx.strokeStyle = `hsl(${trace === 2 ? palette.warning.amber : palette.active.mint} / ${trace === 2 ? 0.46 : 0.34})`;
      ctx.lineWidth = trace === 2 ? 1.8 : 1.2;
      ctx.beginPath();
      for (let i = 0; i < 88; i++) {
        const x = w * 0.08 + (i / 87) * w * 0.84;
        const pressure = Math.sin(i * 0.21 + time * (0.42 + trace * 0.08) + trace);
        const y = h * (0.34 + trace * 0.1) + pressure * h * (0.03 + trace * 0.01);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    for (let i = 0; i < 22; i++) {
      const progress = (i / 21 + time * 0.025) % 1;
      const x = w * 0.08 + progress * w * 0.84;
      const y = h * (0.28 + ((i * 17) % 43) / 100);
      ctx.fillStyle = `hsl(${i % 5 === 0 ? palette.warning.amber : palette.active.lime} / ${i % 5 === 0 ? 0.76 : 0.5})`;
      ctx.beginPath();
      ctx.arc(x, y, i % 5 === 0 ? 2.5 : 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  return (
    <section
      className="artifact-angle artifact-angle-frame border-border bg-card text-card-foreground"
      role="img"
      aria-label="Signal pressure field"
      aria-describedby="signal-pressure-description"
    >
      <div className="relative aspect-[4/3] min-h-64 overflow-hidden">
        <CanvasSurface render={render} cost="light" />
      </div>
      <div className="grid gap-3 border-t border-border p-4">
        <p id="signal-pressure-description" className="text-sm leading-6 text-muted-foreground">
          Non-geographic trace study showing freshness, active flow, and pressure without using a globe.
        </p>
        <div className="grid grid-cols-3 gap-2 text-xs leading-5 text-muted-foreground">
          <MiniMetric label="pressure" value="amber" />
          <MiniMetric label="motion" value="subtle" />
          <MiniMetric label="mode" value="canvas" />
        </div>
      </div>
    </section>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border bg-background p-2">
      <p className="text-micro text-muted-foreground">{label}</p>
      <p className="mt-1 font-mono text-xs text-foreground">{value}</p>
    </div>
  );
}

function StatusCard({ label, value, meta, tone }: { label: string; value: string; meta: string; tone: "default" | "success" | "warning" }) {
  return (
    <ModelessCard variant={tone === "warning" ? "warning" : "default"}>
      <ModelessCardContent className="grid gap-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-micro text-muted-foreground">{label}</p>
          <span className={tone === "success" ? "text-success" : tone === "warning" ? "text-warning" : "text-muted-foreground"}>●</span>
        </div>
        <p className="font-display text-4xl uppercase leading-none">{value}</p>
        <p className="text-xs leading-5 text-muted-foreground">{meta}</p>
      </ModelessCardContent>
    </ModelessCard>
  );
}

function TokenSwatch({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 border border-border bg-background p-2">
      <span className="h-5 w-5 border border-border" style={{ backgroundColor: value }} />
      <span className="font-mono text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

const root =
  ((globalThis as typeof globalThis & { __modelessConsumerRoot?: Root }).__modelessConsumerRoot ??= createRoot(rootElement));

root.render(
  <React.StrictMode>
    <ConsumerExample />
  </React.StrictMode>,
);
