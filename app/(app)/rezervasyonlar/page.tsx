import { Search } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ReservationList } from "@/components/reservation-list";
import { searchReservations } from "@/lib/supabase/queries";

export default async function ReservationsPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const q = params.q ?? "";
  const reservations = await searchReservations(q);

  return (
    <AppShell
      title="Rezervasyonlar"
      subtitle="İsim veya telefon numarası ile arayın, kayıtları düzenleyin"
      active="/rezervasyonlar"
    >
      <form className="panel mb-5 flex flex-col gap-3 p-4 sm:flex-row sm:items-end">
        <label className="grid flex-1 gap-2">
          <span className="label">Arama</span>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              size={17}
            />
            <input
              className="field pl-10"
              name="q"
              defaultValue={q}
              placeholder="Müşteri adı veya telefon"
            />
          </div>
        </label>
        <button className="h-10 rounded-md bg-emerald-500 px-4 text-sm font-semibold text-ink-950 transition hover:bg-emerald-400">
          Ara
        </button>
      </form>

      <section className="panel p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-white">Kayıtlar</h2>
          <span className="text-xs text-slate-500">{reservations.length} sonuç</span>
        </div>
        <ReservationList reservations={reservations} editable />
      </section>
    </AppShell>
  );
}
