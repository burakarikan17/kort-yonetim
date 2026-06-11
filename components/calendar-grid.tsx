import { addDays, format, startOfWeek } from "date-fns";
import { tr } from "date-fns/locale";
import { CalendarClock, GraduationCap, UserRound } from "lucide-react";
import type { Reservation, Settings } from "@/lib/types";
import {
  cn,
  displayTime,
  getIsoWeekday,
  minutesToTime,
  timeToMinutes
} from "@/lib/utils";

type CalendarDay = {
  iso: string;
  label: string;
  caption: string;
};

type CalendarEvent = {
  id: string;
  kind: "reservation" | "school";
  start: string;
  end: string;
  title: string;
  detail?: string;
};

export function CalendarGrid({
  reservations,
  settings,
  date,
  view
}: {
  reservations: Reservation[];
  settings: Settings;
  date: string;
  view: "day" | "week";
}) {
  const days = getDays(date, view);

  return (
    <div className={cn("grid gap-4", view === "week" && "xl:grid-cols-2")}>
      {days.map((day) => {
        const events = getEventsForDay(day.iso, reservations, settings);
        const freeRanges = getFreeRanges(events);

        return (
          <section key={day.iso} className="panel overflow-hidden">
            <header className="flex items-center justify-between gap-3 border-b border-white/10 bg-white/[0.04] px-4 py-3">
              <div>
                <h2 className="text-sm font-semibold capitalize text-white">{day.label}</h2>
                <p className="mt-0.5 text-xs text-slate-500">{day.caption}</p>
              </div>
              <span className="rounded-md border border-white/10 px-2.5 py-1 text-xs text-slate-400">
                {events.length} kayıt
              </span>
            </header>

            <div className="p-3 sm:p-4">
              {events.length > 0 ? (
                <div className="space-y-2">
                  {events.map((event) => (
                    <AgendaEvent key={event.id} event={event} />
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-3 rounded-md border border-dashed border-emerald-400/25 bg-emerald-500/[0.06] px-3 py-4 text-sm text-emerald-100">
                  <CalendarClock size={18} />
                  Gün boyunca kayıt yok.
                </div>
              )}

              <div className="mt-4 border-t border-white/10 pt-4">
                <p className="mb-2 text-xs font-semibold uppercase text-slate-500">Müsait aralıklar</p>
                <div className="flex flex-wrap gap-2">
                  {freeRanges.length > 0 ? (
                    freeRanges.map((range) => (
                      <span
                        key={`${range.start}-${range.end}`}
                        className="rounded-md border border-emerald-400/20 bg-emerald-500/10 px-2.5 py-1.5 text-xs font-medium text-emerald-200"
                      >
                        {range.start} - {range.end}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500">Müsait zaman yok.</span>
                  )}
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}

function getDays(date: string, view: "day" | "week"): CalendarDay[] {
  const dates =
    view === "day"
      ? [new Date(`${date}T00:00:00`)]
      : Array.from({ length: 7 }, (_, index) =>
          addDays(startOfWeek(new Date(`${date}T00:00:00`), { weekStartsOn: 1 }), index)
        );

  return dates.map((day) => ({
    iso: format(day, "yyyy-MM-dd"),
    label: format(day, "EEEE", { locale: tr }),
    caption: format(day, "d MMMM yyyy", { locale: tr })
  }));
}

function getEventsForDay(
  dayISO: string,
  reservations: Reservation[],
  settings: Settings
): CalendarEvent[] {
  const events: CalendarEvent[] = reservations
    .filter((reservation) => reservation.reservation_date === dayISO)
    .map((reservation) => ({
      id: reservation.id,
      kind: "reservation",
      start: displayTime(reservation.start_time),
      end: displayTime(reservation.end_time),
      title: reservation.customer_name || "İsimsiz rezervasyon",
      detail: reservation.phone || undefined
    }));

  if (
    settings.school_block_enabled &&
    settings.school_block_days.includes(getIsoWeekday(dayISO))
  ) {
    events.push({
      id: `school-${dayISO}`,
      kind: "school",
      start: displayTime(settings.school_block_start_time),
      end: displayTime(settings.school_block_end_time),
      title: "Okul kullanımı"
    });
  }

  return events.sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start));
}

function getFreeRanges(events: CalendarEvent[]) {
  const busy = events
    .map((event) => ({ start: timeToMinutes(event.start), end: timeToMinutes(event.end) }))
    .sort((a, b) => a.start - b.start);
  const merged: Array<{ start: number; end: number }> = [];

  for (const interval of busy) {
    const previous = merged.at(-1);
    if (previous && interval.start <= previous.end) {
      previous.end = Math.max(previous.end, interval.end);
    } else {
      merged.push({ ...interval });
    }
  }

  const free: Array<{ start: string; end: string }> = [];
  let cursor = 0;
  for (const interval of merged) {
    if (interval.start > cursor) {
      free.push({ start: minutesToTime(cursor), end: minutesToTime(interval.start) });
    }
    cursor = Math.max(cursor, interval.end);
  }
  if (cursor < 24 * 60) {
    free.push({ start: minutesToTime(cursor), end: "24:00" });
  }

  return free;
}

function AgendaEvent({ event }: { event: CalendarEvent }) {
  const school = event.kind === "school";
  const Icon = school ? GraduationCap : UserRound;

  return (
    <div
      className={cn(
        "grid grid-cols-[5.75rem_1fr] items-center gap-3 rounded-md border px-3 py-3",
        school
          ? "border-amber-300/30 bg-amber-400/10 text-amber-100"
          : "border-red-400/25 bg-red-500/10 text-red-100"
      )}
    >
      <div className="text-sm font-semibold">
        {event.start}
        <span className="block text-xs font-normal opacity-70">{event.end}</span>
      </div>
      <div className="flex min-w-0 items-center gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-md bg-black/15">
          <Icon size={17} />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{event.title}</p>
          {event.detail ? <p className="mt-0.5 truncate text-xs opacity-70">{event.detail}</p> : null}
        </div>
      </div>
    </div>
  );
}
