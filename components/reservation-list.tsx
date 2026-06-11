import Link from "next/link";
import { CalendarDays, Clock3, Pencil, Phone, Trash2, Wallet } from "lucide-react";
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
    return <EmptyState text="Yaklaşan rezervasyon bulunamadı." />;
  }

  return (
    <div className="divide-y divide-white/10 overflow-hidden rounded-lg border border-white/10">
      {reservations.map((reservation) => (
        <article key={reservation.id} className="bg-ink-850/65 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold text-white">
                {reservation.customer_name || "İsimsiz rezervasyon"}
              </h3>
              {reservation.notes ? (
                <p className="mt-1 line-clamp-2 text-sm text-slate-500">{reservation.notes}</p>
              ) : null}
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {editable ? (
                <Link
                  href={`/rezervasyonlar/${reservation.id}/duzenle`}
                  className="grid size-10 place-items-center rounded-md border border-white/10 text-slate-300 transition hover:border-emerald-400/40 hover:text-emerald-300"
                  aria-label="Düzenle"
                >
                  <Pencil size={17} />
                </Link>
              ) : null}
              {editable ? (
                <form action={deleteReservation}>
                  <input type="hidden" name="id" value={reservation.id} />
                  <button
                    className="grid size-10 place-items-center rounded-md border border-white/10 text-slate-300 transition hover:border-red-400/40 hover:text-red-300"
                    aria-label="Sil"
                  >
                    <Trash2 size={17} />
                  </button>
                </form>
              ) : (
                <Link
                  href={`/rezervasyonlar/${reservation.id}/duzenle`}
                  className="rounded-md border border-white/10 px-3 py-2 text-xs font-medium text-emerald-300"
                >
                  Detay
                </Link>
              )}
            </div>
          </div>

          <div className="mt-4 grid gap-2 text-sm text-slate-300 sm:grid-cols-2 lg:grid-cols-4">
            {showDate ? (
              <Info icon={CalendarDays} text={formatDateLongTR(reservation.reservation_date)} />
            ) : null}
            <Info
              icon={Clock3}
              text={`${displayTime(reservation.start_time)} - ${displayTime(reservation.end_time)}`}
            />
            {reservation.phone ? (
              <a href={`tel:${reservation.phone}`} className="hover:text-emerald-300">
                <Info icon={Phone} text={reservation.phone} />
              </a>
            ) : (
              <Info icon={Phone} text="Telefon yok" muted />
            )}
            <Info icon={Wallet} text={formatCurrency(Number(reservation.price))} />
          </div>
        </article>
      ))}
    </div>
  );
}

function Info({
  icon: Icon,
  text,
  muted = false
}: {
  icon: typeof CalendarDays;
  text: string;
  muted?: boolean;
}) {
  return (
    <span className={`flex min-w-0 items-center gap-2 ${muted ? "text-slate-500" : ""}`}>
      <Icon className="shrink-0 text-slate-500" size={16} />
      <span className="truncate">{text}</span>
    </span>
  );
}
