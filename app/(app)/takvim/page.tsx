import { AppShell } from "@/components/app-shell";
import { CalendarGrid } from "@/components/calendar-grid";
import { getCalendarReservations, getSettings } from "@/lib/supabase/queries";
import { todayISO } from "@/lib/utils";

const months = [
  { value: "01", label: "Ocak" },
  { value: "02", label: "Şubat" },
  { value: "03", label: "Mart" },
  { value: "04", label: "Nisan" },
  { value: "05", label: "Mayıs" },
  { value: "06", label: "Haziran" },
  { value: "07", label: "Temmuz" },
  { value: "08", label: "Ağustos" },
  { value: "09", label: "Eylül" },
  { value: "10", label: "Ekim" },
  { value: "11", label: "Kasım" },
  { value: "12", label: "Aralık" }
];

function splitDate(value: string) {
  const [year, month, day] = value.split("-");
  return { year, month, day };
}

export default async function CalendarPage({
  searchParams
}: {
  searchParams: Promise<{
    date?: string;
    reservation_day?: string;
    reservation_month?: string;
    reservation_year?: string;
    view?: "day" | "week";
  }>;
}) {
  const params = await searchParams;
  const composedDate =
    params.reservation_day && params.reservation_month && params.reservation_year
      ? `${params.reservation_year}-${params.reservation_month}-${params.reservation_day}`
      : undefined;
  const date = composedDate ?? params.date ?? todayISO();
  const selectedDate = splitDate(date);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 4 }, (_, index) => String(currentYear + index));
  const view = params.view === "week" ? "week" : "day";
  const [reservations, settings] = await Promise.all([
    getCalendarReservations(date, view),
    getSettings()
  ]);

  return (
    <AppShell
      title="Takvim"
      subtitle="Boş, dolu ve okul kullanım saatlerini takip edin"
      active="/takvim"
    >
      <form className="panel mb-5 grid gap-4 p-4 md:grid-cols-[1fr_auto_auto] md:items-end">
        <fieldset className="grid gap-2">
          <legend className="label mb-2">Tarih</legend>
          <div className="grid grid-cols-[0.85fr_1.35fr_1fr] gap-2">
            <select className="field h-12" name="reservation_day" defaultValue={selectedDate.day}>
              {Array.from({ length: 31 }, (_, index) => String(index + 1).padStart(2, "0")).map(
                (day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                )
              )}
            </select>
            <select className="field h-12" name="reservation_month" defaultValue={selectedDate.month}>
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
            <select className="field h-12" name="reservation_year" defaultValue={selectedDate.year}>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </fieldset>

        <label className="grid gap-2">
          <span className="label">Görünüm</span>
          <select className="field h-12 md:w-40" name="view" defaultValue={view}>
            <option value="day">Günlük</option>
            <option value="week">Haftalık</option>
          </select>
        </label>

        <button className="h-12 rounded-md bg-emerald-500 px-4 text-sm font-semibold text-ink-950 transition hover:bg-emerald-400">
          Göster
        </button>
      </form>

      <CalendarGrid reservations={reservations} settings={settings} date={date} view={view} />
    </AppShell>
  );
}
