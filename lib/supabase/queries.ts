import { addDays, endOfMonth, endOfWeek, format, startOfMonth, startOfWeek } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import type { Reservation, Settings } from "@/lib/types";
import { todayISO } from "@/lib/utils";

export async function getReservationsBetween(startDate: string, endDate: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .gte("reservation_date", startDate)
    .lte("reservation_date", endDate)
    .order("reservation_date", { ascending: true })
    .order("start_time", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Reservation[];
}

export async function getUpcomingReservations(limit = 8) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .gte("reservation_date", todayISO())
    .order("reservation_date", { ascending: true })
    .order("start_time", { ascending: true })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Reservation[];
}

export async function getFinanceSummary(reference = new Date()) {
  const today = format(reference, "yyyy-MM-dd");
  const weekStart = format(startOfWeek(reference, { weekStartsOn: 1 }), "yyyy-MM-dd");
  const weekEnd = format(endOfWeek(reference, { weekStartsOn: 1 }), "yyyy-MM-dd");
  const monthStart = format(startOfMonth(reference), "yyyy-MM-dd");
  const monthEnd = format(endOfMonth(reference), "yyyy-MM-dd");

  const [daily, weekly, monthly] = await Promise.all([
    getReservationsBetween(today, today),
    getReservationsBetween(weekStart, weekEnd),
    getReservationsBetween(monthStart, monthEnd)
  ]);

  const sum = (items: Reservation[]) =>
    items.reduce((total, reservation) => total + Number(reservation.price), 0);

  return {
    daily: sum(daily),
    weekly: sum(weekly),
    monthly: sum(monthly),
    dailyCount: daily.length,
    weeklyCount: weekly.length,
    monthlyCount: monthly.length
  };
}

export async function getDashboardData() {
  const today = todayISO();
  const todayReservations = await getReservationsBetween(today, today);
  const upcomingReservations = await getUpcomingReservations(8);
  const finance = await getFinanceSummary();

  return {
    todayReservations,
    upcomingReservations,
    finance
  };
}

export async function getCalendarReservations(date = todayISO(), view: "day" | "week" = "day") {
  if (view === "day") {
    return getReservationsBetween(date, date);
  }

  const start = startOfWeek(new Date(`${date}T00:00:00`), { weekStartsOn: 1 });
  const end = addDays(start, 6);
  return getReservationsBetween(format(start, "yyyy-MM-dd"), format(end, "yyyy-MM-dd"));
}

export async function getSettings() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .eq("id", 1)
    .single();

  if (error && error.code !== "PGRST116") {
    throw new Error(error.message);
  }

  return (data ?? { id: 1, hourly_price: 0 }) as Settings;
}

export async function searchReservations(term = "") {
  const supabase = await createClient();
  const normalized = term.trim();
  let query = supabase
    .from("reservations")
    .select("*")
    .order("reservation_date", { ascending: false })
    .order("start_time", { ascending: true })
    .limit(100);

  if (normalized) {
    query = query.or(`customer_name.ilike.%${normalized}%,phone.ilike.%${normalized}%`);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Reservation[];
}

export async function getReservation(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("reservations").select("*").eq("id", id).single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Reservation;
}
