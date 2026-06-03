import Link from "next/link";
import { CalendarDays, Gauge, Landmark, LogOut, Plus, Search, Settings } from "lucide-react";
import { signOut } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/takvim", label: "Takvim", icon: CalendarDays },
  { href: "/rezervasyon-ekle", label: "Rezervasyon Ekle", icon: Plus },
  { href: "/rezervasyonlar", label: "Rezervasyonlar", icon: Search },
  { href: "/finans", label: "Finans", icon: Landmark },
  { href: "/ayarlar", label: "Ayarlar", icon: Settings }
];

export function AppShell({
  children,
  title,
  subtitle,
  active
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  active: string;
}) {
  const mobileItems = navItems.slice(0, 4);

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[17rem_1fr]">
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-ink-950/92 px-4 py-3 backdrop-blur lg:hidden">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-md bg-emerald-500 text-base font-black text-ink-950">
            K
          </span>
          <span className="text-sm font-semibold text-white">Kort Panel</span>
        </Link>
        <form action={signOut}>
          <button className="rounded-md border border-white/10 p-2 text-slate-300" aria-label="Çıkış">
            <LogOut size={18} />
          </button>
        </form>
      </div>

      <aside className="hidden border-r border-white/10 bg-ink-950/82 px-5 py-4 backdrop-blur lg:block lg:min-h-screen">
        <div className="flex items-center justify-between lg:block">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-md bg-emerald-500 text-lg font-black text-ink-950">
              K
            </span>
            <span>
              <span className="block text-base font-semibold text-white">Kort Panel</span>
              <span className="block text-xs text-slate-400">Özel rezervasyon sistemi</span>
            </span>
          </Link>
          <form action={signOut} className="lg:hidden">
            <button className="rounded-md border border-white/10 p-2 text-slate-300" aria-label="Çıkış">
              <LogOut size={18} />
            </button>
          </form>
        </div>

        <nav className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-slate-400 transition hover:bg-white/[0.06] hover:text-white",
                  isActive && "bg-emerald-500/13 text-emerald-200 ring-1 ring-emerald-400/20"
                )}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <form action={signOut} className="mt-8 hidden lg:block">
          <button className="flex h-11 w-full items-center gap-3 rounded-md border border-white/10 px-3 text-sm font-medium text-slate-400 transition hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-200">
            <LogOut size={18} />
            Çıkış Yap
          </button>
        </form>
      </aside>

      <main className="px-4 pb-28 pt-5 sm:px-6 lg:px-8 lg:py-7">
        <header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-2xl font-semibold text-white sm:text-3xl">{title}</h1>
            {subtitle ? <p className="mt-1 text-sm text-slate-400">{subtitle}</p> : null}
          </div>
          <Link
            href="/rezervasyon-ekle"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-emerald-500 px-4 text-sm font-semibold text-ink-950 transition hover:bg-emerald-400"
          >
            <Plus size={18} />
            Rezervasyon Ekle
          </Link>
        </header>
        {children}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-white/10 bg-ink-950/95 px-2 pb-2 pt-2 backdrop-blur lg:hidden">
        {mobileItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center gap-1 rounded-md text-[11px] font-medium text-slate-400",
                isActive && "bg-emerald-500/13 text-emerald-200"
              )}
            >
              <Icon size={19} />
              <span className="max-w-full truncate">{item.label.replace("Rezervasyon ", "")}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
