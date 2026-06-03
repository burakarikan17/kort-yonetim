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

export function todayISO() {
  return format(new Date(), "yyyy-MM-dd");
}

export function getHourSlots(start = 0, end = 24) {
  return Array.from({ length: end - start }, (_, index) => {
    const hour = start + index;
    const nextHour = hour + 1;
    return {
      start: `${String(hour).padStart(2, "0")}:00:00`,
      end: `${String(nextHour).padStart(2, "0")}:00:00`,
      label: `${String(hour).padStart(2, "0")}:00-${String(nextHour).padStart(2, "0")}:00`
    };
  });
}

export function overlaps(
  slotStart: string,
  slotEnd: string,
  reservationStart: string,
  reservationEnd: string
) {
  return slotStart < reservationEnd && slotEnd > reservationStart;
}
