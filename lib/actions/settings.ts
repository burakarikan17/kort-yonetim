"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateSettings(formData: FormData) {
  const hourlyPrice = Number(formData.get("hourly_price"));

  if (!Number.isFinite(hourlyPrice) || hourlyPrice < 0) {
    throw new Error("Saatlik ücret geçerli bir sayı olmalıdır.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("settings")
    .upsert({ id: 1, hourly_price: hourlyPrice }, { onConflict: "id" });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/ayarlar");
  revalidatePath("/rezervasyon-ekle");
}
