import * as React from "react";
import { Search, TerminalSquare } from "lucide-react";
import { cn } from "../../lib/utils";

export interface CommandItem {
  id: string;
  label: string;
  hint?: string;
  group?: string;
}

export interface CommandSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  items: CommandItem[];
  placeholder?: string;
}

export function CommandSurface({ className, items, placeholder = "Search artifacts, routes, commands", ...props }: CommandSurfaceProps) {
  const [query, setQuery] = React.useState("");
  const filtered = items.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()));
  const selectItem = (item: CommandItem) => {
    if (item.hint?.startsWith("/") || item.hint?.startsWith("#")) {
      window.location.href = item.hint;
    }
  };

  return (
    <div className={cn("artifact-angle artifact-angle-frame overflow-hidden border border-border bg-card", className)} {...props}>
      <label className="flex items-center gap-2 border-b border-border px-3 py-2">
        <Search aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
        <span className="sr-only">Search commands</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          className="h-9 flex-1 bg-transparent font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
      </label>
      <div className="max-h-80 overflow-auto p-2">
        {filtered.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => selectItem(item)}
            className="group flex w-full items-center justify-between gap-3 border border-transparent px-3 py-2 text-left transition-colors hover:border-primary hover:bg-muted focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <span className="flex items-center gap-2">
              <TerminalSquare aria-hidden="true" className="h-4 w-4 text-primary" />
              <span className="font-mono text-sm">{item.label}</span>
            </span>
            <span className="text-micro text-muted-foreground">{item.hint ?? item.group}</span>
          </button>
        ))}
        {filtered.length === 0 && <p className="px-3 py-6 text-center text-sm text-muted-foreground">No command matched.</p>}
      </div>
    </div>
  );
}
