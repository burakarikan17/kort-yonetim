import { addDays, format, startOfWeek } from "date-fns";
import { tr } from "date-fns/locale";
import type { Reservation } from "@/lib/types";
import { cn, displayTime, getHourSlots, overlaps } from "@/lib/utils";

export function CalendarGrid({
  reservations,
  date,
  view
}: {
  reservations: Reservation[];
  date: string;
  view: "day" | "week";
}) {
  const slots = getHourSlots();
  const days =
    view === "day"
      ? [new Date(`${date}T00:00:00`)]
      : Array.from({ length: 7 }, (_, index) =>
          addDays(startOfWeek(new Date(`${date}T00:00:00`), { weekStartsOn: 1 }), index)
        );

  return (
    <div className="panel overflow-hidden">
      <div
        className={cn(
          "grid border-b border-white/10 bg-white/5 text-xs font-semibold uppercase tracking-normal text-slate-400",
          view === "day" ? "grid-cols-[7rem_1fr]" : "min-w-[58rem] grid-cols-[6rem_repeat(7,1fr)]"
        )}
      >
        <div className="px-3 py-3">Saat</div>
        {days.map((day) => (
          <div key={day.toISOString()} className="px-3 py-3">
            <span className="block text-slate-200">{format(day, "EEE", { locale: tr })}</span>
            <span className="font-normal normal-case text-slate-500">{format(day, "d MMM", { locale: tr })}</span>
          </div>
        ))}
      </div>

      <div className={view === "week" ? "overflow-x-auto" : undefined}>
        <div
          className={cn(
            "grid",
            view === "day" ? "grid-cols-[7rem_1fr]" : "min-w-[58rem] grid-cols-[6rem_repeat(7,1fr)]"
          )}
        >
          {slots.map((slot) => (
            <Row
              key={slot.label}
              slot={slot}
              days={days}
              reservations={reservations}
              view={view}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Row({
  slot,
  days,
  reservations
}: {
  slot: { start: string; end: string; label: string };
  days: Date[];
  reservations: Reservation[];
  view: "day" | "week";
}) {
  return (
    <>
      <div className="border-b border-white/10 px-3 py-3 text-xs font-medium text-slate-500">
        {slot.label}
      </div>
      {days.map((day) => {
        const dayISO = format(day, "yyyy-MM-dd");
        const reservation = reservations.find(
          (item) =>
            item.reservation_date === dayISO &&
            overlaps(slot.start, slot.end, item.start_time, item.end_time)
        );
        return (
          <div key={`${dayISO}-${slot.start}`} className="border-b border-l border-white/10 p-2">
            <div
              className={cn(
                "min-h-16 rounded-md border px-3 py-2 text-xs",
                reservation
                  ? "border-red-400/30 bg-red-500/14 text-red-100"
                  : "border-emerald-400/22 bg-emerald-500/10 text-emerald-100"
              )}
            >
              {reservation ? (
                <>
                  <p className="font-semibold">{reservation.customer_name || "Dolu"}</p>
                  <p className="mt-1 text-red-200/80">
                    {displayTime(reservation.start_time)} - {displayTime(reservation.end_time)}
                  </p>
                </>
              ) : (
                <p className="font-medium">Boş</p>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}
