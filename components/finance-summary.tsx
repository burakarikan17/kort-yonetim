import { Calendar, CalendarDays, Wallet } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { formatCurrency } from "@/lib/utils";

export function FinanceSummary({
  daily,
  weekly,
  monthly,
  dailyCount,
  weeklyCount,
  monthlyCount
}: {
  daily: number;
  weekly: number;
  monthly: number;
  dailyCount: number;
  weeklyCount: number;
  monthlyCount: number;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard
        label="Günlük gelir"
        value={formatCurrency(daily)}
        detail={`${dailyCount} rezervasyon`}
        icon={Wallet}
        tone="emerald"
      />
      <StatCard
        label="Haftalık gelir"
        value={formatCurrency(weekly)}
        detail={`${weeklyCount} rezervasyon`}
        icon={CalendarDays}
        tone="amber"
      />
      <StatCard
        label="Aylık gelir"
        value={formatCurrency(monthly)}
        detail={`${monthlyCount} rezervasyon`}
        icon={Calendar}
        tone="red"
      />
    </div>
  );
}
