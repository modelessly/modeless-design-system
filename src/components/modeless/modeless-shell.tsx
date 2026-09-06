import * as React from "react";
import { Menu, X } from "lucide-react";
import { cn } from "../../lib/utils";
import { ModelessButton } from "./modeless-button";

export interface ModelessShellNavItem {
  href: string;
  label: string;
}

export interface ModelessShellProps extends React.HTMLAttributes<HTMLDivElement> {
  brand?: React.ReactNode;
  nav?: ModelessShellNavItem[];
  sidebar?: React.ReactNode;
  footer?: React.ReactNode;
}

export function ModelessShell({
  className,
  brand = "MODELESS",
  nav = [],
  sidebar,
  footer,
  children,
  ...props
}: ModelessShellProps) {
  const [open, setOpen] = React.useState(false);
  const [pathname, setPathname] = React.useState(() => (typeof window === "undefined" ? "/" : window.location.pathname.replace(/\/$/, "") || "/"));

  React.useEffect(() => {
    setPathname(window.location.pathname.replace(/\/$/, "") || "/");
  }, []);

  const isActive = (href: string) => {
    const normalizedHref = href.replace(/\/$/, "") || "/";
    if (normalizedHref === "/") return pathname === "/";
    return pathname === normalizedHref || pathname.startsWith(`${normalizedHref}/`);
  };

  return (
    <div className={cn("min-h-screen bg-background text-foreground", className)} {...props}>
      <header className="sticky top-0 z-40 border-b border-border bg-background/94 backdrop-blur">
        <div className="flex h-14 items-center justify-between px-4">
          <a href="/" className="font-display text-2xl uppercase leading-none">
            {brand}
          </a>
          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
            {nav.map((item) => {
              const active = isActive(item.href);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "border px-3 py-2 text-label transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-transparent text-muted-foreground hover:border-primary hover:text-primary",
                  )}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
          <ModelessButton variant="outline" size="icon" className="md:hidden" aria-label="Toggle navigation" onClick={() => setOpen((value) => !value)}>
            {open ? <X aria-hidden={true} className="h-4 w-4" /> : <Menu aria-hidden={true} className="h-4 w-4" />}
          </ModelessButton>
        </div>
        {open && (
          <nav className="grid border-t border-border p-2 md:hidden" aria-label="Mobile navigation">
            {nav.map((item) => {
              const active = isActive(item.href);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "border px-3 py-2 text-label transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-transparent text-muted-foreground hover:border-primary hover:text-primary",
                  )}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
        )}
      </header>
      <div className={cn("grid", sidebar && "lg:grid-cols-[17rem_1fr]")}>
        {sidebar && <aside className="hidden border-r border-border p-4 lg:block">{sidebar}</aside>}
        <main>{children}</main>
      </div>
      {footer && <footer className="border-t border-border p-4 text-micro text-muted-foreground">{footer}</footer>}
    </div>
  );
}
