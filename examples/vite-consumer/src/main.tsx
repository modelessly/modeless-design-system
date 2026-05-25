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
  modelessColors,
  modelessTypography,
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
