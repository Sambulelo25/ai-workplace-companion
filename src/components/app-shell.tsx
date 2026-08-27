import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { LayoutDashboard, Mail, BookOpenText, MessagesSquare, Menu, X, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email-generator", label: "Smart Email Generator", icon: Mail },
  { to: "/research-assistant", label: "AI Research Assistant", icon: BookOpenText },
  { to: "/chatbot", label: "AI Chatbot", icon: MessagesSquare },
] as const;

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-3 border-b border-sidebar-border px-5 py-5">
        <div className="grid size-9 place-items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <span className="text-sm font-bold">AI</span>
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-sidebar-primary">Workplace AI</p>
          <p className="text-xs text-sidebar-foreground/60">Productivity Suite</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-widest text-sidebar-foreground/40">
          Workspace
        </p>
        {nav.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors duration-200",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <div className="rounded-lg bg-sidebar-accent/50 p-3">
          <div className="flex items-center gap-2 text-sidebar-primary">
            <ShieldCheck className="size-4" />
            <p className="text-xs font-semibold">Responsible AI</p>
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-sidebar-foreground/60">
            Always review AI output before use. Never enter confidential or personal information.
          </p>
        </div>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => setOpen(false), [pathname]);

  return (
    <div className="min-h-screen lg:flex">
      <aside className="hidden lg:block lg:w-72 lg:shrink-0 lg:border-r lg:border-sidebar-border">
        <div className="fixed inset-y-0 left-0 w-72">
          <SidebarContent />
        </div>
      </aside>

      <header className="sticky top-0 z-30 flex items-center gap-3 border-b bg-card/90 px-4 py-3 backdrop-blur lg:hidden">
        <button
          type="button"
          aria-label="Open navigation"
          onClick={() => setOpen(true)}
          className="grid size-9 place-items-center rounded-lg border transition-colors hover:bg-accent"
        >
          <Menu className="size-4" />
        </button>
        <span className="text-sm font-semibold">Workplace AI</span>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/40 animate-in fade-in"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 shadow-raised animate-in slide-in-from-left duration-200">
            <button
              type="button"
              aria-label="Close navigation"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-4 grid size-8 place-items-center rounded-md text-sidebar-foreground/70 hover:bg-sidebar-accent"
            >
              <X className="size-4" />
            </button>
            <SidebarContent onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <main className="min-w-0 flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">{children}</div>
      </main>
    </div>
  );
}
