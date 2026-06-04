"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ReservationInput } from "@/lib/types";
import { getIsoWeekday, normalizeTime, overlaps } from "@/lib/utils";
import { getSettings } from "@/lib/supabase/queries";

function composeReservationDate(formData: FormData) {
  const directDate = String(formData.get("reservation_date") ?? "").trim();
  if (directDate) {
    return directDate;
  }

  const day = String(formData.get("reservation_day") ?? "").padStart(2, "0");
  const month = String(formData.get("reservation_month") ?? "").padStart(2, "0");
  const year = String(formData.get("reservation_year") ?? "");

  if (!day || !month || !year) {
    return "";
  }

  return `${year}-${month}-${day}`;
}

function readReservation(formData: FormData): ReservationInput {
  const rawPrice = String(formData.get("price") ?? "").trim();
  const price = rawPrice ? Number(rawPrice) : 0;

  if (!Number.isFinite(price) || price < 0) {
    throw new Error("Ücret geçerli bir sayı olmalıdır.");
  }

  return {
    customer_name: String(formData.get("customer_name") ?? "").trim() || null,
    phone: String(formData.get("phone") ?? "").trim() || null,
    reservation_date: composeReservationDate(formData),
    start_time: normalizeTime(String(formData.get("start_time") ?? "")),
    end_time: normalizeTime(String(formData.get("end_time") ?? "")),
    price,
    notes: String(formData.get("notes") ?? "").trim() || null
  };
}

function validateReservation(input: ReservationInput) {
  if (!input.reservation_date) {
    throw new Error("Tarih zorunludur.");
  }

  if (!input.start_time || !input.end_time || input.start_time >= input.end_time) {
    throw new Error("Bitiş saati başlangıç saatinden sonra olmalıdır.");
  }
}

async function assertNoOverlap(input: ReservationInput, ignoreId?: string) {
  const supabase = await createClient();
  let query = supabase
    .from("reservations")
    .select("id")
    .eq("reservation_date", input.reservation_date)
    .lt("start_time", input.end_time)
    .gt("end_time", input.start_time)
    .limit(1);

  if (ignoreId) {
    query = query.neq("id", ignoreId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  if (data && data.length > 0) {
    throw new Error("Bu saat aralığında mevcut bir rezervasyon var.");
  }
}

async function assertNotSchoolBlocked(input: ReservationInput) {
  const settings = await getSettings();

  if (
    settings.school_block_enabled &&
    settings.school_block_days.includes(getIsoWeekday(input.reservation_date)) &&
    overlaps(
      input.start_time,
      input.end_time,
      settings.school_block_start_time,
      settings.school_block_end_time
    )
  ) {
    throw new Error("Seçilen saat okul kullanımı için kapalıdır.");
  }
}

function refreshPages() {
  revalidatePath("/");
  revalidatePath("/takvim");
  revalidatePath("/rezervasyonlar");
  revalidatePath("/finans");
}

export async function createReservation(formData: FormData) {
  const input = readReservation(formData);
  validateReservation(input);
  await assertNotSchoolBlocked(input);
  await assertNoOverlap(input);

  const supabase = await createClient();
  const { error } = await supabase.from("reservations").insert(input);

  if (error) {
    throw new Error(error.message);
  }

  refreshPages();
  redirect("/takvim");
}

export async function updateReservation(id: string, formData: FormData) {
  const input = readReservation(formData);
  validateReservation(input);
  await assertNotSchoolBlocked(input);
  await assertNoOverlap(input, id);

  const supabase = await createClient();
  const { error } = await supabase.from("reservations").update(input).eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  refreshPages();
  redirect("/rezervasyonlar");
}

export async function deleteReservation(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) {
    throw new Error("Rezervasyon bulunamadı.");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("reservations").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  refreshPages();
}
