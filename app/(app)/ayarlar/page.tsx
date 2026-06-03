import { AppShell } from "@/components/app-shell";
import { updateSettings } from "@/lib/actions/settings";
import { getSettings } from "@/lib/supabase/queries";

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <AppShell
      title="Ayarlar"
      subtitle="Varsayılan kort ücretini yönetin"
      active="/ayarlar"
    >
      <form action={updateSettings} className="panel max-w-xl p-5">
        <label className="grid gap-2">
          <span className="label">Saatlik ücret</span>
          <input
            className="field"
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
        <button className="mt-5 h-11 rounded-md bg-emerald-500 px-4 text-sm font-semibold text-ink-950 transition hover:bg-emerald-400">
          Ayarları Kaydet
        </button>
      </form>
    </AppShell>
  );
}
