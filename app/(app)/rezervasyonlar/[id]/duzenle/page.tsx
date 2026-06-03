import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { ReservationForm } from "@/components/reservation-form";
import { updateReservation } from "@/lib/actions/reservations";
import { getReservation } from "@/lib/supabase/queries";

export default async function EditReservationPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let reservation;

  try {
    reservation = await getReservation(id);
  } catch {
    notFound();
  }

  const action = updateReservation.bind(null, id);

  return (
    <AppShell
      title="Rezervasyon Düzenle"
      subtitle="Tarih, saat, ücret ve müşteri bilgilerini güncelleyin"
      active="/rezervasyonlar"
    >
      <ReservationForm action={action} reservation={reservation} submitLabel="Güncelle" />
    </AppShell>
  );
}
