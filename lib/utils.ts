import { clsx, type ClassValue } from "clsx";
import { format, parseISO } from "date-fns";
import { tr } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(value: string, pattern = "d MMMM yyyy") {
  return format(parseISO(value), pattern, { locale: tr });
}

export function formatDateTR(value: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(parseISO(value));
}

export function formatDateLongTR(value: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(parseISO(value));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0
  }).format(value);
}

export function normalizeTime(value: string) {
  return value.length === 5 ? `${value}:00` : value;
}

export function displayTime(value: string) {
  return value.slice(0, 5);
}

export function timeToMinutes(value: string) {
  const [hour = "0", minute = "0"] = displayTime(value).split(":");
  return Number(hour) * 60 + Number(minute);
}

export function minutesToTime(value: number) {
  const hour = Math.floor(value / 60);
  const minute = value % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function getTimeOptions(startMinutes = 0, endMinutes = 24 * 60, stepMinutes = 30) {
  return Array.from(
    { length: Math.floor((endMinutes - startMinutes) / stepMinutes) + 1 },
    (_, index) => minutesToTime(startMinutes + index * stepMinutes)
  );
}

export function todayISO() {
  return format(new Date(), "yyyy-MM-dd");
}

export function getHourSlots(start = 0, end = 24, stepMinutes = 30) {
  return Array.from({ length: ((end - start) * 60) / stepMinutes }, (_, index) => {
    const slotStart = start * 60 + index * stepMinutes;
    const slotEnd = slotStart + stepMinutes;
    return {
      start: `${minutesToTime(slotStart)}:00`,
      end: `${minutesToTime(slotEnd)}:00`,
      label: `${minutesToTime(slotStart)}-${minutesToTime(slotEnd)}`
    };
  });
}

export function overlaps(
  slotStart: string,
  slotEnd: string,
  reservationStart: string,
  reservationEnd: string
) {
  return timeToMinutes(slotStart) < timeToMinutes(reservationEnd) &&
    timeToMinutes(slotEnd) > timeToMinutes(reservationStart);
}

export function getIsoWeekday(date: string) {
  const day = new Date(`${date}T00:00:00`).getDay();
  return day === 0 ? 7 : day;
}

export function isSchoolBlockedSlot({
  date,
  slotStart,
  slotEnd,
  enabled,
  days,
  blockStart,
  blockEnd
}: {
  date: string;
  slotStart: string;
  slotEnd: string;
  enabled: boolean;
  days: number[];
  blockStart: string;
  blockEnd: string;
}) {
  return (
    enabled &&
    days.includes(getIsoWeekday(date)) &&
    overlaps(slotStart, slotEnd, blockStart, blockEnd)
  );
}
