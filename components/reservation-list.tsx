import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { deleteReservation } from "@/lib/actions/reservations";
import type { Reservation } from "@/lib/types";
import { displayTime, formatCurrency, formatDateLongTR } from "@/lib/utils";
import { EmptyState } from "@/components/empty-state";

export function ReservationList({
  reservations,
  showDate = true,
  editable = false
}: {
  reservations: Reservation[];
  showDate?: boolean;
  editable?: boolean;
}) {
  if (reservations.length === 0) {
    return <EmptyState text="Rezervasyon bulunamadı." />;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-white/10">
      <div className="hidden grid-cols-[1.25fr_1fr_1fr_0.8fr_0.8fr] gap-3 bg-white/5 px-4 py-3 text-xs font-semibold uppercase tracking-normal text-slate-400 md:grid">
        <span>Müşteri</span>
        <span>Telefon</span>
        <span>{showDate ? "Tarih" : "Saat"}</span>
        <span>Ücret</span>
        <span className="text-right">İşlem</span>
      </div>
      <div className="divide-y divide-white/10">
        {reservations.map((reservation) => (
          <div
            key={reservation.id}
            className="grid gap-3 px-4 py-4 text-sm text-slate-300 md:grid-cols-[1.25fr_1fr_1fr_0.8fr_0.8fr] md:items-center"
          >
            <div>
              <p className="font-medium text-white">{reservation.customer_name || "İsimsiz rezervasyon"}</p>
              {reservation.notes ? (
                <p className="mt-1 line-clamp-1 text-xs text-slate-500">{reservation.notes}</p>
              ) : null}
            </div>
            {reservation.phone ? (
              <a href={`tel:${reservation.phone}`} className="text-slate-300 hover:text-emerald-300">
                {reservation.phone}
              </a>
            ) : (
              <span className="text-slate-500">Telefon yok</span>
            )}
            <div>
              <p>{showDate ? formatDateLongTR(reservation.reservation_date) : "Bugün"}</p>
              <p className="text-xs text-slate-500">
                {displayTime(reservation.start_time)} - {displayTime(reservation.end_time)}
              </p>
            </div>
            <p className="font-medium text-amber-200">{formatCurrency(Number(reservation.price))}</p>
            <div className="flex items-center justify-start gap-2 md:justify-end">
              {editable ? (
                <Link
                  href={`/rezervasyonlar/${reservation.id}/duzenle`}
                  className="grid size-9 place-items-center rounded-md border border-white/10 text-slate-300 transition hover:border-emerald-400/40 hover:text-emerald-300"
                  aria-label="Düzenle"
                >
                  <Pencil size={16} />
                </Link>
              ) : null}
              {editable ? (
                <form action={deleteReservation}>
                  <input type="hidden" name="id" value={reservation.id} />
                  <button
                    className="grid size-9 place-items-center rounded-md border border-white/10 text-slate-300 transition hover:border-red-400/40 hover:text-red-300"
                    aria-label="Sil"
                  >
                    <Trash2 size={16} />
                  </button>
                </form>
              ) : (
                <Link
                  href={`/rezervasyonlar/${reservation.id}/duzenle`}
                  className="text-xs font-medium text-emerald-300 hover:text-emerald-200"
                >
                  Detay
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
