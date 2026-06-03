import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = "emerald"
}: {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  tone?: "emerald" | "amber" | "red";
}) {
  const tones = {
    emerald: "bg-emerald-500/12 text-emerald-300 ring-emerald-400/18",
    amber: "bg-amber-500/12 text-amber-300 ring-amber-400/18",
    red: "bg-red-500/12 text-red-300 ring-red-400/18"
  };

  return (
    <section className="panel p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
          <p className="mt-1 text-xs text-slate-500">{detail}</p>
        </div>
        <span className={`grid size-10 place-items-center rounded-md ring-1 ${tones[tone]}`}>
          <Icon size={19} />
        </span>
      </div>
    </section>
  );
}
