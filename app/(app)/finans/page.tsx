import { AppShell } from "@/components/app-shell";
import { FinanceSummary } from "@/components/finance-summary";
import { ReservationList } from "@/components/reservation-list";
import { getFinanceSummary, getUpcomingReservations } from "@/lib/supabase/queries";

export default async function FinancePage() {
  const [finance, reservations] = await Promise.all([
    getFinanceSummary(),
    getUpcomingReservations(12)
  ]);

  return (
    <AppShell
      title="Finans"
      subtitle="Günlük, haftalık ve aylık gelir takibi"
      active="/finans"
    >
      <FinanceSummary {...finance} />
      <section className="panel mt-6 p-5">
        <h2 className="mb-4 text-base font-semibold text-white">Yaklaşan tahsilatlar</h2>
        <ReservationList reservations={reservations} />
      </section>
    </AppShell>
  );
}
