import { AppShell } from "@/components/app-shell";
import { ReservationForm } from "@/components/reservation-form";
import { createReservation } from "@/lib/actions/reservations";
import { getSettings } from "@/lib/supabase/queries";

export default async function AddReservationPage() {
  const settings = await getSettings();

  return (
    <AppShell
      title="Rezervasyon Ekle"
      subtitle="Telefonla veya yüz yüze alınan rezervasyonu manuel kaydedin"
      active="/rezervasyon-ekle"
    >
      <ReservationForm action={createReservation} defaultPrice={settings.hourly_price} />
    </AppShell>
  );
}
