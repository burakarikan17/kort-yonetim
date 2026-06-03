import { CalendarCheck, Clock, Wallet } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { CalendarGrid } from "@/components/calendar-grid";
import { FinanceSummary } from "@/components/finance-summary";
import { ReservationList } from "@/components/reservation-list";
import { StatCard } from "@/components/stat-card";
import { getDashboardData } from "@/lib/supabase/queries";
import { formatCurrency, todayISO } from "@/lib/utils";

export default async function DashboardPage() {
  const { todayReservations, upcomingReservations, finance } = await getDashboardData();

  return (
    <AppShell title="Dashboard" subtitle="Bugünkü durum ve yaklaşan rezervasyonlar" active="/dashboard">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Bugünün rezervasyonları"
          value={`${todayReservations.length}`}
          detail="Bugün korta gelecek müşteriler"
          icon={CalendarCheck}
        />
        <StatCard
          label="Yaklaşan rezervasyonlar"
          value={`${upcomingReservations.length}`}
          detail="Sıradaki planlı kayıtlar"
          icon={Clock}
          tone="amber"
        />
        <StatCard
          label="Toplam gelir özeti"
          value={formatCurrency(finance.monthly)}
          detail="Bu ay oluşan toplam gelir"
          icon={Wallet}
          tone="red"
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">Bugünün Takvimi</h2>
            <span className="text-xs text-slate-500">Yeşil boş, kırmızı dolu</span>
          </div>
          <CalendarGrid reservations={todayReservations} date={todayISO()} view="day" />
        </section>

        <section className="panel p-5">
          <h2 className="mb-4 text-base font-semibold text-white">Yaklaşan Rezervasyonlar</h2>
          <ReservationList reservations={upcomingReservations} />
        </section>
      </div>

      <section className="mt-6">
        <FinanceSummary {...finance} />
      </section>
    </AppShell>
  );
}
