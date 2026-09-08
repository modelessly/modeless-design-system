import * as React from "react";
import { Check, ChevronDown, Circle, FileUp, Info, Search, X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { ModelessButton, type ModelessButtonProps } from "./modeless-button";

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";
const controlBase = cn("border border-border bg-background font-mono text-sm text-foreground transition-colors placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50", focusRing);

export interface ModelessFormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
}

export function ModelessFormField({ label, description, error, required, className, children, ...props }: ModelessFormFieldProps) {
  return (
    <div className={cn("grid gap-1.5", className)} {...props}>
      {label ? (
        <div className="flex items-center gap-1 text-micro text-muted-foreground">
          <span>{label}</span>
          {required ? <span className="text-warning">*</span> : null}
        </div>
      ) : null}
      {children}
      {description && !error ? <p className="text-xs leading-5 text-muted-foreground">{description}</p> : null}
      {error ? <p className="text-xs leading-5 text-warning">{error}</p> : null}
    </div>
  );
}

export interface ModelessTextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

export const ModelessTextField = React.forwardRef<HTMLInputElement, ModelessTextFieldProps>(
  ({ label, description, error, leadingIcon, trailingIcon, className, required, ...props }, ref) => (
    <ModelessFormField label={label} description={description} error={error} required={required}>
      <span
        className={cn(
          // The inner input clears its own outline, so the wrapper carries the
          // focus ring; without this, focusing the field shows nothing.
          "flex h-11 items-center gap-2 border border-border bg-background px-3",
          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
          error && "border-warning",
        )}
      >
        {leadingIcon ? <span className="shrink-0 text-muted-foreground">{leadingIcon}</span> : null}
        <input ref={ref} required={required} className={cn("min-w-0 flex-1 bg-transparent font-mono text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50", className)} {...props} />
        {trailingIcon ? <span className="shrink-0 text-muted-foreground">{trailingIcon}</span> : null}
      </span>
    </ModelessFormField>
  ),
);
ModelessTextField.displayName = "ModelessTextField";

export type ModelessDropzoneState = "idle" | "dragging" | "loaded" | "error";

export interface ModelessDropzoneProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onDrop" | "onSelect"> {
  label: React.ReactNode;
  description?: React.ReactNode;
  accept?: string;
  fileName?: React.ReactNode;
  state?: ModelessDropzoneState;
  error?: React.ReactNode;
  disabled?: boolean;
  multiple?: boolean;
  onSelect?: (files: File[]) => void;
  onDrop?: (files: File[]) => void;
}

const dropzoneTone: Record<ModelessDropzoneState, string> = {
  idle: "border-border",
  dragging: "border-signal bg-signal/5",
  loaded: "border-success bg-success/5",
  error: "border-destructive bg-destructive/5",
};

export function ModelessDropzone({
  label,
  description,
  accept,
  fileName,
  state = "idle",
  error,
  disabled = false,
  multiple = false,
  onSelect,
  onDrop,
  className,
  ...props
}: ModelessDropzoneProps) {
  const inputId = React.useId();
  const dragDepth = React.useRef(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const visualState = isDragging && state !== "error" ? "dragging" : state;
  const statusText = visualState === "dragging" ? "Drop to import" : visualState === "loaded" ? "Loaded" : visualState === "error" ? "Import failed" : "Ready";

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (disabled) return;
    dragDepth.current += 1;
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (disabled) return;
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    dragDepth.current = 0;
    setIsDragging(false);
    if (!disabled && event.dataTransfer.files.length > 0) onDrop?.(Array.from(event.dataTransfer.files));
  };

  return (
    <div
      className={cn(
        "artifact-angle artifact-angle-frame grid gap-3 border bg-card p-4 text-card-foreground transition-colors",
        dropzoneTone[visualState],
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
      {...props}
      aria-disabled={disabled || undefined}
      onDragEnter={handleDragEnter}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-label text-foreground">{label}</p>
          {description ? <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p> : null}
        </div>
        <FileUp aria-hidden={true} className={cn("h-5 w-5 shrink-0", visualState === "loaded" ? "text-success" : visualState === "error" ? "text-destructive" : "text-primary")} />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <input
          id={inputId}
          type="file"
          className="peer sr-only"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={(event) => {
            const files = Array.from(event.currentTarget.files ?? []);
            if (files.length > 0) onSelect?.(files);
            event.currentTarget.value = "";
          }}
        />
        <label
          htmlFor={inputId}
          className={cn(
            "inline-flex h-9 cursor-pointer items-center border border-border bg-background px-3 font-mono text-label text-foreground transition-colors hover:border-primary hover:text-primary peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background",
            disabled && "pointer-events-none cursor-not-allowed",
          )}
        >
          Choose file
        </label>
        <span aria-live="polite" className={cn("text-micro", visualState === "loaded" ? "text-success" : visualState === "error" ? "text-destructive" : visualState === "dragging" ? "text-primary" : "text-muted-foreground")}>
          {statusText}
        </span>
      </div>
      {fileName ? <p className="truncate border-t border-border pt-3 font-mono text-xs text-foreground">{fileName}</p> : null}
      {error ? <p className="text-xs leading-5 text-destructive">{error}</p> : null}
    </div>
  );
}

export interface ModelessTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
}

export const ModelessTextArea = React.forwardRef<HTMLTextAreaElement, ModelessTextAreaProps>(
  ({ label, description, error, className, required, ...props }, ref) => (
    <ModelessFormField label={label} description={description} error={error} required={required}>
      <textarea ref={ref} required={required} className={cn(controlBase, "min-h-28 resize-y px-3 py-2", error && "border-warning", className)} {...props} />
    </ModelessFormField>
  ),
);
ModelessTextArea.displayName = "ModelessTextArea";

export interface ModelessSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  options?: Array<{ label: string; value: string; disabled?: boolean }>;
}

export const ModelessSelect = React.forwardRef<HTMLSelectElement, ModelessSelectProps>(
  ({ label, description, error, options, className, required, children, ...props }, ref) => (
    <ModelessFormField label={label} description={description} error={error} required={required}>
      <span className="relative block">
        <select ref={ref} required={required} className={cn(controlBase, "h-11 w-full appearance-none px-3 pr-10", error && "border-warning", className)} {...props}>
          {options?.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
          {children}
        </select>
        <ChevronDown aria-hidden={true} className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </span>
    </ModelessFormField>
  ),
);
ModelessSelect.displayName = "ModelessSelect";

export interface ModelessSearchFieldProps extends Omit<ModelessTextFieldProps, "leadingIcon" | "type"> {}

export const ModelessSearchField = React.forwardRef<HTMLInputElement, ModelessSearchFieldProps>((props, ref) => (
  <ModelessTextField ref={ref} type="search" leadingIcon={<Search aria-hidden={true} className="h-4 w-4" />} {...props} />
));
ModelessSearchField.displayName = "ModelessSearchField";

export interface ModelessCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
  description?: React.ReactNode;
}

export const ModelessCheckbox = React.forwardRef<HTMLInputElement, ModelessCheckboxProps>(
  ({ label, description, className, ...props }, ref) => (
    <label className={cn("grid cursor-pointer grid-cols-[1.25rem_1fr] gap-3 text-sm text-foreground has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50", className)}>
      <span className="relative mt-0.5 h-5 w-5 border border-border bg-background">
        <input ref={ref} type="checkbox" className="peer sr-only" {...props} />
        <Check aria-hidden={true} className="absolute left-1/2 top-1/2 hidden h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-primary peer-checked:block" />
      </span>
      <span>
        <span className="block leading-5">{label}</span>
        {description ? <span className="mt-1 block text-xs leading-5 text-muted-foreground">{description}</span> : null}
      </span>
    </label>
  ),
);
ModelessCheckbox.displayName = "ModelessCheckbox";

export interface ModelessSwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
  description?: React.ReactNode;
}

export const ModelessSwitch = React.forwardRef<HTMLInputElement, ModelessSwitchProps>(
  ({ label, description, className, ...props }, ref) => (
    <label className={cn("flex cursor-pointer items-start justify-between gap-4 text-sm has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50", className)}>
      <span>
        <span className="block leading-5">{label}</span>
        {description ? <span className="mt-1 block text-xs leading-5 text-muted-foreground">{description}</span> : null}
      </span>
      <span className="relative h-6 w-11 shrink-0 border border-border bg-background">
        <input ref={ref} type="checkbox" className="peer sr-only" {...props} />
        <span className="absolute left-1 top-1 h-3.5 w-3.5 bg-muted-foreground transition-transform peer-checked:translate-x-5 peer-checked:bg-primary" />
      </span>
    </label>
  ),
);
ModelessSwitch.displayName = "ModelessSwitch";

export interface ModelessRadioOption {
  label: React.ReactNode;
  value: string;
  description?: React.ReactNode;
  disabled?: boolean;
}

export interface ModelessRadioGroupProps {
  name: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  options: ModelessRadioOption[];
  label?: React.ReactNode;
  className?: string;
}

export function ModelessRadioGroup({ name, value, defaultValue, onValueChange, options, label, className }: ModelessRadioGroupProps) {
  return (
    <fieldset className={cn("grid gap-2", className)}>
      {label ? <legend className="mb-1 text-micro text-muted-foreground">{label}</legend> : null}
      {options.map((option) => (
        <label key={option.value} className="grid cursor-pointer grid-cols-[1.25rem_1fr] gap-3 text-sm has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50">
          <span className="relative mt-0.5 h-5 w-5 rounded-full border border-border bg-background">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === undefined ? undefined : value === option.value}
              defaultChecked={defaultValue === option.value}
              disabled={option.disabled}
              onChange={(event) => event.currentTarget.checked && onValueChange?.(option.value)}
              className="peer sr-only"
            />
            <Circle aria-hidden={true} className="absolute left-1/2 top-1/2 hidden h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 fill-primary text-primary peer-checked:block" />
          </span>
          <span>
            <span className="block leading-5">{option.label}</span>
            {option.description ? <span className="mt-1 block text-xs leading-5 text-muted-foreground">{option.description}</span> : null}
          </span>
        </label>
      ))}
    </fieldset>
  );
}

export interface ModelessSegmentedControlOption {
  label: React.ReactNode;
  value: string;
  disabled?: boolean;
}

export interface ModelessSegmentedControlProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onValueChange?: (value: string) => void;
  options: ModelessSegmentedControlOption[];
  "aria-label": string;
}

export function ModelessSegmentedControl({ value, onValueChange, options, className, ...props }: ModelessSegmentedControlProps) {
  return (
    <div role="radiogroup" className={cn("inline-grid grid-flow-col border border-border bg-background p-1", className)} {...props}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          disabled={option.disabled}
          onClick={() => onValueChange?.(option.value)}
          className={cn("h-9 border border-transparent px-3 font-mono text-label text-muted-foreground transition-colors disabled:opacity-40", focusRing, value === option.value && "border-primary bg-primary text-primary-foreground")}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export interface ModelessTabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  onValueChange: (value: string) => void;
  tabs: Array<{ label: React.ReactNode; value: string; disabled?: boolean }>;
}

export function ModelessTabs({ value, onValueChange, tabs, className, children, ...props }: ModelessTabsProps) {
  const id = React.useId();
  const tabRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const selectedIndex = tabs.findIndex((tab) => tab.value === value);
  const activeIndex = selectedIndex >= 0 ? selectedIndex : tabs.findIndex((tab) => !tab.disabled);
  const selectedTab = tabs[activeIndex];
  const selectedTabId = selectedTab ? `${id}-${selectedTab.value}-tab` : undefined;
  const panelId = selectedTab ? `${id}-${selectedTab.value}-panel` : undefined;

  const focusTab = (index: number) => {
    const tab = tabs[index];
    if (!tab || tab.disabled) return;
    onValueChange(tab.value);
    tabRefs.current[index]?.focus();
  };

  const findNextEnabledIndex = (startIndex: number, direction: 1 | -1) => {
    if (!tabs.length) return -1;
    for (let offset = 1; offset <= tabs.length; offset += 1) {
      const index = (startIndex + offset * direction + tabs.length) % tabs.length;
      if (!tabs[index]?.disabled) return index;
    }
    return -1;
  };

  const firstEnabledIndex = tabs.findIndex((tab) => !tab.disabled);
  const lastEnabledIndex = [...tabs].reverse().findIndex((tab) => !tab.disabled);
  const resolvedLastEnabledIndex = lastEnabledIndex === -1 ? -1 : tabs.length - 1 - lastEnabledIndex;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      focusTab(findNextEnabledIndex(index, 1));
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      focusTab(findNextEnabledIndex(index, -1));
    } else if (event.key === "Home") {
      event.preventDefault();
      focusTab(firstEnabledIndex);
    } else if (event.key === "End") {
      event.preventDefault();
      focusTab(resolvedLastEnabledIndex);
    }
  };

  return (
    <div className={cn("grid gap-3", className)} {...props}>
      <div role="tablist" className="flex overflow-x-auto border-b border-border">
        {tabs.map((tab, index) => (
          <button
            key={tab.value}
            ref={(element) => {
              tabRefs.current[index] = element;
            }}
            id={`${id}-${tab.value}-tab`}
            type="button"
            role="tab"
            aria-selected={value === tab.value}
            aria-controls={`${id}-${tab.value}-panel`}
            tabIndex={value === tab.value ? 0 : -1}
            disabled={tab.disabled}
            onClick={() => onValueChange(tab.value)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={cn("h-11 shrink-0 border-b-2 border-transparent px-4 font-mono text-label text-muted-foreground transition-colors", focusRing, value === tab.value && "border-primary text-primary")}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div id={panelId} role="tabpanel" aria-labelledby={selectedTabId} tabIndex={0}>
        {children}
      </div>
    </div>
  );
}

export interface ModelessTooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
}

export function ModelessTooltip({ content, children }: ModelessTooltipProps) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span role="tooltip" className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden min-w-max -translate-x-1/2 border border-border bg-popover px-2 py-1 text-micro text-popover-foreground shadow-lg group-hover:block group-focus-within:block">
        {content}
      </span>
    </span>
  );
}

export interface ModelessIconButtonProps extends Omit<ModelessButtonProps, "children"> {
  label: string;
  icon: React.ReactNode;
  tooltip?: boolean;
}

export const ModelessIconButton = React.forwardRef<HTMLButtonElement, ModelessIconButtonProps>(
  ({ label, icon, tooltip, ...props }, ref) => {
    const button = (
      <ModelessButton ref={ref} size="icon" aria-label={label} {...props}>
        {icon}
      </ModelessButton>
    );
    return tooltip ? <ModelessTooltip content={label}>{button}</ModelessTooltip> : button;
  },
);
ModelessIconButton.displayName = "ModelessIconButton";

export const modelessCardVariants = cva("artifact-angle artifact-angle-frame border bg-card text-card-foreground", {
  variants: {
    variant: {
      default: "border-border",
      outline: "border-border bg-transparent",
      terminal: "terminal-glow border-terminal-foreground/35 bg-terminal text-terminal-foreground",
      warning: "border-warning/70 bg-warning/10",
    },
  },
  defaultVariants: { variant: "default" },
});

export interface ModelessCardProps extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof modelessCardVariants> {}

export function ModelessCard({ variant, className, ...props }: ModelessCardProps) {
  return <article className={cn(modelessCardVariants({ variant }), className)} {...props} />;
}

export function ModelessCardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <header className={cn("border-b border-border px-4 py-3", className)} {...props} />;
}

export function ModelessCardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4", className)} {...props} />;
}

export function ModelessCardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <footer className={cn("border-t border-border px-4 py-3", className)} {...props} />;
}

export interface ModelessListProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ModelessList({ className, ...props }: ModelessListProps) {
  return <div role="list" className={cn("grid divide-y divide-border border border-border bg-card", className)} {...props} />;
}

export interface ModelessListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  heading: React.ReactNode;
  description?: React.ReactNode;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
}

export function ModelessListItem({ heading, description, leading, trailing, className, ...props }: ModelessListItemProps) {
  return (
    <div role="listitem" className={cn("grid grid-cols-[auto_1fr_auto] items-center gap-3 px-3 py-3", className)} {...props}>
      {leading ? <span className="text-primary">{leading}</span> : null}
      <span className="min-w-0">
        <span className="block truncate text-sm text-foreground">{heading}</span>
        {description ? <span className="mt-1 block text-xs leading-5 text-muted-foreground">{description}</span> : null}
      </span>
      {trailing ? <span className="shrink-0">{trailing}</span> : null}
    </div>
  );
}

export interface ModelessDividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  label?: React.ReactNode;
}

export function ModelessDivider({ orientation = "horizontal", label, className, ...props }: ModelessDividerProps) {
  if (orientation === "vertical") return <div aria-orientation="vertical" role="separator" className={cn("min-h-6 w-px bg-border", className)} {...props} />;
  return (
    <div role="separator" className={cn("flex items-center gap-3 text-micro text-muted-foreground", className)} {...props}>
      <span className="h-px flex-1 bg-border" />
      {label ? <span>{label}</span> : null}
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

export interface ModelessProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  label?: React.ReactNode;
  tone?: "default" | "success" | "warning" | "muted";
}

export function ModelessProgress({ value = 0, label, tone = "default", className, ...props }: ModelessProgressProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const progressTone = tone === "success" ? "bg-success" : tone === "warning" ? "bg-warning" : tone === "muted" ? "bg-muted-foreground" : "bg-primary";
  return (
    <div className={cn("grid gap-1", className)} {...props}>
      {label ? (
        <div className="flex justify-between gap-3 text-micro text-muted-foreground">
          <span>{label}</span>
          <span>{clamped}%</span>
        </div>
      ) : null}
      <div role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={clamped} className="h-2 border border-border bg-background">
        <div className={cn("h-full", progressTone)} style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
}

export interface ModelessDialogProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  heading: React.ReactNode;
  description?: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
  footer?: React.ReactNode;
}

export function ModelessDialog({ open, heading, description, onOpenChange, footer, className, children, ...props }: ModelessDialogProps) {
  const dialogRef = React.useRef<HTMLElement>(null);
  const headingId = React.useId();
  const descriptionId = React.useId();

  React.useEffect(() => {
    if (!open || typeof document === "undefined") return undefined;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const dialog = dialogRef.current;
    const focusableSelector = [
      "a[href]",
      "button:not([disabled])",
      "textarea:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "[tabindex]:not([tabindex='-1'])",
    ].join(",");
    const getFocusable = () => Array.from(dialog?.querySelectorAll<HTMLElement>(focusableSelector) ?? []).filter((element) => !element.hasAttribute("disabled") && element.getAttribute("aria-hidden") !== "true");

    const focusInitialElement = () => {
      const focusable = getFocusable();
      (focusable[0] ?? dialog)?.focus();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onOpenChange?.(false);
        return;
      }
      if (event.key !== "Tab" || !dialog) return;

      const focusable = getFocusable();
      if (!focusable.length) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    focusInitialElement();
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [onOpenChange, open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-background/82 p-4 backdrop-blur-sm" role="presentation">
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={cn("artifact-angle artifact-angle-frame w-full max-w-lg border border-border bg-card text-card-foreground shadow-2xl", className)}
        {...props}
      >
        <header className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
          <div>
            <h2 id={headingId} className="font-display text-2xl uppercase leading-none">{heading}</h2>
            {description ? <p id={descriptionId} className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p> : null}
          </div>
          <ModelessIconButton label="Close dialog" icon={<X aria-hidden={true} className="h-4 w-4" />} variant="ghost" onClick={() => onOpenChange?.(false)} />
        </header>
        <div className="p-4">{children}</div>
        {footer ? <footer className="flex justify-end gap-2 border-t border-border px-4 py-3">{footer}</footer> : null}
      </section>
    </div>
  );
}

export interface ModelessToastProps extends React.HTMLAttributes<HTMLDivElement> {
  heading: React.ReactNode;
  description?: React.ReactNode;
  tone?: "default" | "warning" | "success";
}

export function ModelessToast({ heading, description, tone = "default", className, ...props }: ModelessToastProps) {
  return (
    <div role="status" className={cn("artifact-angle artifact-angle-sm artifact-angle-frame border bg-card p-3 shadow-lg", tone === "warning" ? "border-warning" : tone === "success" ? "border-success" : "border-border", className)} {...props}>
      <p className="font-mono text-label text-foreground">{heading}</p>
      {description ? <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p> : null}
    </div>
  );
}

export interface ModelessStateProps extends React.HTMLAttributes<HTMLDivElement> {
  heading: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function ModelessEmptyState({ heading, description, icon = <Info aria-hidden={true} className="h-5 w-5" />, action, className, ...props }: ModelessStateProps) {
  return <StateShell heading={heading} description={description} icon={icon} action={action} className={className} {...props} />;
}

export function ModelessErrorState({ heading, description, icon = <AlertIcon />, action, className, ...props }: ModelessStateProps) {
  return <StateShell heading={heading} description={description} icon={icon} action={action} className={cn("border-warning/70", className)} {...props} />;
}

export function ModelessLoadingState({ heading = "Loading", description, className, ...props }: Partial<ModelessStateProps>) {
  return (
    <div className={cn("grid gap-3 border border-border bg-card p-4", className)} {...props}>
      <div className="h-3 w-1/3 bg-muted motion-data-cell" />
      <div className="h-20 bg-muted/60 motion-data-cell" />
      <p className="text-sm text-muted-foreground">{heading}{description ? ` / ${description}` : null}</p>
    </div>
  );
}

function StateShell({ heading, description, icon, action, className, ...props }: ModelessStateProps) {
  return (
    <div className={cn("grid place-items-center border border-dashed border-border bg-card p-6 text-center", className)} {...props}>
      <div>
        <div className="mx-auto grid h-10 w-10 place-items-center border border-border text-primary">{icon}</div>
        <h3 className="mt-4 font-display text-2xl uppercase leading-none">{heading}</h3>
        {description ? <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{description}</p> : null}
        {action ? <div className="mt-4">{action}</div> : null}
      </div>
    </div>
  );
}

function AlertIcon() {
  return <Info aria-hidden={true} className="h-5 w-5 text-warning" />;
}
