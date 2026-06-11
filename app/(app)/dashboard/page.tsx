import { AppShell } from "@/components/app-shell";
import { ReservationList } from "@/components/reservation-list";
import { getUpcomingReservations } from "@/lib/supabase/queries";

export default async function DashboardPage() {
  const upcomingReservations = await getUpcomingReservations(30);

  return (
    <AppShell
      title="Yaklaşan Randevular"
      subtitle="Sıradaki rezervasyonları tarih ve saat sırasıyla görün"
      active="/dashboard"
    >
      <section className="mx-auto max-w-5xl">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-white">Randevu listesi</h2>
          <span className="text-xs text-slate-500">{upcomingReservations.length} kayıt</span>
        </div>
        <ReservationList reservations={upcomingReservations} />
      </section>
    </AppShell>
  );
}
