"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  ValidationError,
  requireNonEmpty,
  requireValidSlug,
  requireMaxLength,
} from "@/lib/validation";

export async function updateRestaurantAction(formData: FormData) {
  const restaurantId = formData.get("restaurantId") as string;

  let name: string;
  let slug: string;
  let description: string;

  try {
    name = requireMaxLength(
      requireNonEmpty(formData.get("name") as string, "نام رستوران"),
      100,
      "نام رستوران"
    );
    slug = requireValidSlug(formData.get("slug") as string);
    description = ((formData.get("description") as string) ?? "").trim();
  } catch (err) {
    const message =
      err instanceof ValidationError ? err.message : "اطلاعات نامعتبر است";
    redirect(
      "/dashboard/settings?error=" + encodeURIComponent(message)
    );
  }

  if (!restaurantId) {
    redirect(
      "/dashboard/settings?error=" + encodeURIComponent("درخواست نامعتبر")
    );
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: membership } = await supabase
    .from("restaurant_members")
    .select("restaurant_id")
    .eq("user_id", user!.id)
    .eq("restaurant_id", restaurantId)
    .single();

  if (!membership) {
    redirect(
      "/dashboard?error=" + encodeURIComponent("دسترسی غیرمجاز")
    );
  }

  const { error } = await supabase
    .from("restaurants")
    .update({
      name: name!,
      slug: slug!,
      description: description!,
    })
    .eq("id", restaurantId);

  if (error) {
    console.error("Restaurant update failed:", error);

    if (error.code === "23505") {
      redirect(
        "/dashboard/settings?error=" +
          encodeURIComponent("این اسلاگ قبلاً استفاده شده است")
      );
    }

    redirect(
      "/dashboard/settings?error=" +
        encodeURIComponent("خطا در ذخیره‌ی تغییرات")
    );
  }

  redirect("/dashboard/settings?success=1");
}