"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateSettings(formData: FormData) {
  const hourlyPrice = Number(formData.get("hourly_price"));
  const schoolBlockEnabled = formData.get("school_block_enabled") === "on";
  const schoolBlockDays = formData
    .getAll("school_block_days")
    .map((value) => Number(value))
    .filter((value) => Number.isInteger(value) && value >= 1 && value <= 7);
  const schoolBlockStartTime = String(formData.get("school_block_start_time") ?? "");
  const schoolBlockEndTime = String(formData.get("school_block_end_time") ?? "");

  if (!Number.isFinite(hourlyPrice) || hourlyPrice < 0) {
    throw new Error("Saatlik ücret geçerli bir sayı olmalıdır.");
  }

  if (schoolBlockEnabled && schoolBlockDays.length === 0) {
    throw new Error("Okul bloğu aktifken en az bir gün seçilmelidir.");
  }

  if (!schoolBlockStartTime || !schoolBlockEndTime || schoolBlockStartTime >= schoolBlockEndTime) {
    throw new Error("Okul saati başlangıç ve bitiş aralığı geçerli olmalıdır.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("settings")
    .upsert(
      {
        id: 1,
        hourly_price: hourlyPrice,
        school_block_enabled: schoolBlockEnabled,
        school_block_days: schoolBlockDays,
        school_block_start_time: schoolBlockStartTime,
        school_block_end_time: schoolBlockEndTime
      },
      { onConflict: "id" }
    );

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/ayarlar");
  revalidatePath("/rezervasyon-ekle");
  revalidatePath("/takvim");
  revalidatePath("/dashboard");
}
