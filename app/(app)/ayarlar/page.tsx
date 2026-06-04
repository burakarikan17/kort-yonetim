import { AppShell } from "@/components/app-shell";
import { updateSettings } from "@/lib/actions/settings";
import { getSettings } from "@/lib/supabase/queries";
import { displayTime, getTimeOptions } from "@/lib/utils";

const days = [
  { value: 1, label: "Pzt" },
  { value: 2, label: "Sal" },
  { value: 3, label: "Çar" },
  { value: 4, label: "Per" },
  { value: 5, label: "Cum" },
  { value: 6, label: "Cmt" },
  { value: 7, label: "Paz" }
];

const startTimeOptions = getTimeOptions(0, 23 * 60 + 30, 30);
const endTimeOptions = getTimeOptions(30, 24 * 60, 30);

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <AppShell
      title="Ayarlar"
      subtitle="Ücret ve okul kullanım saatlerini yönetin"
      active="/ayarlar"
    >
      <form action={updateSettings} className="grid max-w-2xl gap-5">
        <section className="panel p-4 sm:p-5">
          <h2 className="text-base font-semibold text-white">Ücret</h2>
          <label className="mt-4 grid gap-2">
            <span className="label">Varsayılan saatlik ücret</span>
            <input
              className="field h-12"
              name="hourly_price"
              type="number"
              min="0"
              step="1"
              defaultValue={settings.hourly_price}
              required
            />
          </label>
          <p className="mt-3 text-sm text-slate-400">
            Yeni rezervasyon formunda ücret alanı bu değerle otomatik dolar.
          </p>
        </section>

        <section className="panel p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-white">Okul kullanımı</h2>
              <p className="mt-1 text-sm text-slate-400">
                Aktif olduğunda seçilen gün ve saatlerde rezervasyon alınmaz.
              </p>
            </div>
            <label className="inline-flex items-center gap-2 rounded-md border border-white/10 px-3 py-2 text-sm text-slate-200">
              <input
                name="school_block_enabled"
                type="checkbox"
                defaultChecked={settings.school_block_enabled}
                className="size-4 accent-emerald-500"
              />
              Aktif
            </label>
          </div>

          <fieldset className="mt-5">
            <legend className="label mb-2">Günler</legend>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
              {days.map((day) => (
                <label
                  key={day.value}
                  className="flex h-11 items-center justify-center gap-2 rounded-md border border-white/10 bg-ink-950/50 text-sm text-slate-200"
                >
                  <input
                    name="school_block_days"
                    type="checkbox"
                    value={day.value}
                    defaultChecked={settings.school_block_days.includes(day.value)}
                    className="size-4 accent-emerald-500"
                  />
                  {day.label}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="label">Başlangıç</span>
              <select
                className="field h-12"
                name="school_block_start_time"
                defaultValue={displayTime(settings.school_block_start_time)}
              >
                {startTimeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="label">Bitiş</span>
              <select
                className="field h-12"
                name="school_block_end_time"
                defaultValue={displayTime(settings.school_block_end_time)}
              >
                {endTimeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <button className="h-12 rounded-md bg-emerald-500 px-4 text-sm font-semibold text-ink-950 transition hover:bg-emerald-400">
          Ayarları Kaydet
        </button>
      </form>
    </AppShell>
  );
}
