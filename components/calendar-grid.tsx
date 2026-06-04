import { addDays, format, startOfWeek } from "date-fns";
import { tr } from "date-fns/locale";
import type { Reservation, Settings } from "@/lib/types";
import { cn, displayTime, getHourSlots, isSchoolBlockedSlot, overlaps } from "@/lib/utils";

type CalendarDay = {
  date: Date;
  iso: string;
  label: string;
  caption: string;
};

type SlotState = {
  reservation?: Reservation;
  schoolBlocked: boolean;
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
  const slots = getHourSlots(0, 24, 30);
  const days = getDays(date, view);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2 text-xs sm:flex">
        <Legend color="bg-emerald-500" label="Boş" />
        <Legend color="bg-red-500" label="Dolu" />
        <Legend color="bg-amber-400" label="Okul" />
      </div>

      <div className="space-y-4 md:hidden">
        {days.map((day) => (
          <section key={day.iso} className="panel overflow-hidden">
            <div className="border-b border-white/10 bg-white/[0.04] px-4 py-3">
              <p className="text-sm font-semibold text-white">{day.label}</p>
              <p className="text-xs text-slate-500">{day.caption}</p>
            </div>
            <div className="divide-y divide-white/10">
              {slots.map((slot) => (
                <MobileSlot
                  key={`${day.iso}-${slot.start}`}
                  slot={slot}
                  state={getSlotState(day.iso, slot, reservations, settings)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="panel hidden overflow-hidden md:block">
        <div
          className={cn(
            "grid border-b border-white/10 bg-white/5 text-xs font-semibold uppercase tracking-normal text-slate-400",
            view === "day" ? "grid-cols-[7rem_1fr]" : "min-w-[58rem] grid-cols-[6rem_repeat(7,1fr)]"
          )}
        >
          <div className="px-3 py-3">Saat</div>
          {days.map((day) => (
            <div key={day.iso} className="px-3 py-3">
              <span className="block text-slate-200">{day.label}</span>
              <span className="font-normal normal-case text-slate-500">{day.caption}</span>
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
              <Row key={slot.label} slot={slot} days={days} reservations={reservations} settings={settings} />
            ))}
          </div>
        </div>
      </div>
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
    date: day,
    iso: format(day, "yyyy-MM-dd"),
    label: format(day, "EEEE", { locale: tr }),
    caption: format(day, "d MMMM yyyy", { locale: tr })
  }));
}

function getSlotState(
  dayISO: string,
  slot: { start: string; end: string; label: string },
  reservations: Reservation[],
  settings: Settings
): SlotState {
  const reservation = reservations.find(
    (item) =>
      item.reservation_date === dayISO &&
      overlaps(slot.start, slot.end, item.start_time, item.end_time)
  );
  const schoolBlocked = isSchoolBlockedSlot({
    date: dayISO,
    slotStart: slot.start,
    slotEnd: slot.end,
    enabled: settings.school_block_enabled,
    days: settings.school_block_days,
    blockStart: settings.school_block_start_time,
    blockEnd: settings.school_block_end_time
  });

  return { reservation, schoolBlocked };
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-md border border-white/10 bg-ink-850/70 px-3 py-2 text-slate-300 sm:justify-start">
      <span className={cn("size-2.5 rounded-full", color)} />
      {label}
    </div>
  );
}

function MobileSlot({
  slot,
  state
}: {
  slot: { start: string; end: string; label: string };
  state: SlotState;
}) {
  const { reservation, schoolBlocked } = state;
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="w-24 shrink-0 text-sm font-medium text-slate-400">{slot.label}</div>
      <SlotCard reservation={reservation} schoolBlocked={schoolBlocked} />
    </div>
  );
}

function Row({
  slot,
  days,
  reservations,
  settings
}: {
  slot: { start: string; end: string; label: string };
  days: CalendarDay[];
  reservations: Reservation[];
  settings: Settings;
}) {
  return (
    <>
      <div className="border-b border-white/10 px-3 py-3 text-xs font-medium text-slate-500">
        {slot.label}
      </div>
      {days.map((day) => {
        const state = getSlotState(day.iso, slot, reservations, settings);
        return (
          <div key={`${day.iso}-${slot.start}`} className="border-b border-l border-white/10 p-2">
            <SlotCard reservation={state.reservation} schoolBlocked={state.schoolBlocked} />
          </div>
        );
      })}
    </>
  );
}

function SlotCard({
  reservation,
  schoolBlocked
}: {
  reservation?: Reservation;
  schoolBlocked: boolean;
}) {
  return (
    <div
      className={cn(
        "min-h-12 flex-1 rounded-md border px-3 py-2 text-xs",
        reservation && "border-red-400/30 bg-red-500/14 text-red-100",
        !reservation && schoolBlocked && "border-amber-300/35 bg-amber-400/14 text-amber-100",
        !reservation && !schoolBlocked && "border-emerald-400/22 bg-emerald-500/10 text-emerald-100"
      )}
    >
      {reservation ? (
        <>
          <p className="font-semibold">{reservation.customer_name || "Dolu"}</p>
          <p className="mt-1 text-red-200/80">
            {displayTime(reservation.start_time)} - {displayTime(reservation.end_time)}
          </p>
        </>
      ) : schoolBlocked ? (
        <p className="font-medium">Okul kullanımı</p>
      ) : (
        <p className="font-medium">Boş</p>
      )}
    </div>
  );
}
