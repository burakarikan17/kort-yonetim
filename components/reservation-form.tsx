import type { Reservation } from "@/lib/types";
import { displayTime, todayISO } from "@/lib/utils";

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

const timeOptions = Array.from({ length: 24 }, (_, index) => {
  const hour = index;
  return `${String(hour).padStart(2, "0")}:00`;
});

const endTimeOptions = [...timeOptions.slice(1), "24:00"];

function splitDate(value: string) {
  const [year, month, day] = value.split("-");
  return { year, month, day };
}

export function ReservationForm({
  action,
  reservation,
  defaultPrice,
  submitLabel = "Kaydet"
}: {
  action: (formData: FormData) => void | Promise<void>;
  reservation?: Reservation;
  defaultPrice?: number;
  submitLabel?: string;
}) {
  const selectedDate = splitDate(reservation?.reservation_date ?? todayISO());
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 4 }, (_, index) => String(currentYear + index));

  return (
    <form action={action} className="panel p-4 sm:p-5">
      <div className="grid gap-4 lg:grid-cols-2">
        <label className="grid gap-2">
          <span className="label">Müşteri adı</span>
          <input
            className="field h-12"
            name="customer_name"
            defaultValue={reservation?.customer_name ?? ""}
            placeholder="İsteğe bağlı"
          />
        </label>
        <label className="grid gap-2">
          <span className="label">Telefon numarası</span>
          <input
            className="field h-12"
            name="phone"
            defaultValue={reservation?.phone ?? ""}
            inputMode="tel"
            placeholder="İsteğe bağlı"
          />
        </label>

        <fieldset className="grid gap-2 lg:col-span-2">
          <legend className="label mb-2">Tarih</legend>
          <div className="grid grid-cols-[0.85fr_1.35fr_1fr] gap-2">
            <label>
              <span className="sr-only">Gün</span>
              <select
                className="field h-12"
                name="reservation_day"
                defaultValue={selectedDate.day}
                required
              >
                {Array.from({ length: 31 }, (_, index) => String(index + 1).padStart(2, "0")).map(
                  (day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  )
                )}
              </select>
            </label>
            <label>
              <span className="sr-only">Ay</span>
              <select
                className="field h-12"
                name="reservation_month"
                defaultValue={selectedDate.month}
                required
              >
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="sr-only">Yıl</span>
              <select
                className="field h-12"
                name="reservation_year"
                defaultValue={selectedDate.year}
                required
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <p className="text-xs text-slate-500">Gün / Ay / Yıl biçiminde seçilir.</p>
        </fieldset>

        <label className="grid gap-2">
          <span className="label">Başlangıç saati</span>
          <select
            className="field h-12"
            name="start_time"
            defaultValue={reservation ? displayTime(reservation.start_time) : "00:00"}
            required
          >
            {timeOptions.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2">
          <span className="label">Bitiş saati</span>
          <select
            className="field h-12"
            name="end_time"
            defaultValue={reservation ? displayTime(reservation.end_time) : "01:00"}
            required
          >
            {endTimeOptions.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2">
          <span className="label">Ücret</span>
          <input
            className="field h-12"
            name="price"
            type="number"
            min="0"
            step="1"
            defaultValue={reservation?.price ?? defaultPrice ?? ""}
            placeholder="İsteğe bağlı"
          />
        </label>
        <label className="grid gap-2 lg:col-span-2">
          <span className="label">Not</span>
          <textarea
            className="field min-h-28 resize-y"
            name="notes"
            defaultValue={reservation?.notes ?? ""}
            placeholder="Ödeme, özel istek veya hatırlatma"
          />
        </label>
      </div>
      <div className="sticky bottom-20 -mx-4 mt-5 border-t border-white/10 bg-ink-850/95 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
        <button className="inline-flex h-12 w-full items-center justify-center rounded-md bg-emerald-500 px-4 text-sm font-semibold text-ink-950 transition hover:bg-emerald-400 sm:w-auto">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
