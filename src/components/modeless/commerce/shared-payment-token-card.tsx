import * as React from "react";
import { Fingerprint, KeyRound, RotateCcw, ShieldCheck } from "lucide-react";
import { cn } from "../../../lib/utils";
import type { ModelessMotionIntensity } from "../../../tokens";
import { CommerceFrame, CommerceMetric, commerceTone } from "./shared";

export interface SharedPaymentTokenPermission {
  id: string;
  label: string;
  enabled: boolean;
  risk?: "safe" | "review" | "risk" | "machine";
}

export interface SharedPaymentTokenCardProps extends React.HTMLAttributes<HTMLDivElement> {
  tokenLabel: string;
  merchant: string;
  network: string;
  expiresAt: string;
  permissions: SharedPaymentTokenPermission[];
  selectedPermissionId?: string;
  onSelectedPermissionChange?: (permissionId: string) => void;
  motion?: ModelessMotionIntensity;
}

export function SharedPaymentTokenCard({
  tokenLabel,
  merchant,
  network,
  expiresAt,
  permissions,
  selectedPermissionId,
  onSelectedPermissionChange,
  motion = "subtle",
  className,
  ...props
}: SharedPaymentTokenCardProps) {
  const [internalPermission, setInternalPermission] = React.useState(permissions[0]?.id);
  const selectedId = selectedPermissionId ?? internalPermission;
  const selectedPermission = permissions.find((permission) => permission.id === selectedId);

  function selectPermission(permissionId: string) {
    setInternalPermission(permissionId);
    onSelectedPermissionChange?.(permissionId);
  }

  return (
    <CommerceFrame title="Shared Payment Token Card" eyebrow={`${network} / scoped credential`} motion={motion} className={className} {...props}>
      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_14rem]">
        <div className="artifact-angle artifact-angle-frame relative min-h-72 min-w-0 overflow-hidden border border-border bg-background p-5">
          <div className="absolute inset-0 bg-grid-dotted opacity-50" aria-hidden={true} />
          <div className="relative z-10 grid min-h-60 content-between">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-micro text-muted-foreground">token reference</p>
              <h4 className="mt-2 break-words font-display text-4xl uppercase leading-none [overflow-wrap:anywhere]">{tokenLabel}</h4>
              </div>
              <div className={cn("grid h-14 w-14 place-items-center border border-primary bg-primary text-primary-foreground", motion !== "off" && "motion-data-node")}>
                <Fingerprint aria-hidden={true} className="h-7 w-7" />
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              <CommerceMetric label="merchant" value={merchant} tone="settled" />
              <CommerceMetric label="network" value={network} tone="machine" />
              <CommerceMetric label="expires" value={expiresAt} tone="review" />
            </div>
          </div>
        </div>
        <aside className="grid min-w-0 content-start gap-2">
          {selectedPermission ? (
            <div className="border border-primary bg-primary/10 p-3">
              <p className="text-micro text-primary">constraint</p>
              <p className="mt-1 text-sm text-foreground">{selectedPermission.label}</p>
              <p className="mt-2 text-xs leading-5 text-foreground/80">
                {selectedPermission.enabled ? "Enabled for this credential." : "Blocked by token scope."} Risk tone: {selectedPermission.risk ?? "safe"}.
              </p>
            </div>
          ) : null}
          {permissions.map((permission, index) => (
            <button
              key={permission.id}
              type="button"
              aria-pressed={permission.id === selectedId}
              onClick={() => selectPermission(permission.id)}
              className={cn(
                "grid grid-cols-[auto_1fr_auto] items-center gap-2 border border-border bg-background p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                permission.id === selectedId && "border-primary bg-primary/10",
              )}
            >
              {permission.enabled ? <ShieldCheck aria-hidden={true} className="h-4 w-4 text-primary" /> : <KeyRound aria-hidden={true} className="h-4 w-4 text-muted-foreground" />}
              <span className="text-xs text-foreground">
                {permission.label}
                {/* The icon and swatch below are decorative, so grant state and risk are
                    carried here as text for assistive technology. */}
                <span className="sr-only">
                  {permission.enabled ? `, granted, risk ${permission.risk ?? "safe"}` : ", not granted"}
                </span>
              </span>
              <span
                className={cn("h-2 w-6", motion !== "off" && permission.enabled && "motion-data-cell")}
                style={{ background: permission.enabled ? commerceTone(permission.risk ?? "safe") : "hsl(var(--border))", "--motion-index": index } as React.CSSProperties}
                aria-hidden={true}
              />
            </button>
          ))}
          <div className="mt-2 border border-border bg-background p-3">
            <RotateCcw aria-hidden={true} className="mb-2 h-4 w-4 text-primary" />
            <p className="text-xs leading-5 text-muted-foreground">Token can be revoked without exposing the underlying payment method.</p>
          </div>
        </aside>
      </div>
    </CommerceFrame>
  );
}
