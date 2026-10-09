"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function assertMembership(restaurantId: string) {
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
    redirect("/dashboard?error=" + encodeURIComponent("دسترسی غیرمجاز"));
  }

  return supabase;
}

export async function createCategoryAction(formData: FormData) {
  const restaurantId = formData.get("restaurantId") as string;
  const name = (formData.get("name") as string)?.trim();
  const nextOrder = Number(formData.get("nextOrder") ?? 0);

  if (!restaurantId || !name) {
    redirect(
      "/dashboard/categories?error=" + encodeURIComponent("نام دسته‌بندی الزامی است")
    );
  }

  const supabase = await assertMembership(restaurantId);

  const { error } = await supabase.from("categories").insert({
    restaurant_id: restaurantId,
    name,
    display_order: nextOrder,
  });

  if (error) {
    console.error("Category insert failed:", error);
    redirect(
      "/dashboard/categories?error=" + encodeURIComponent("خطا در افزودن دسته‌بندی")
    );
  }

  redirect("/dashboard/categories");
}

export async function deleteCategoryAction(formData: FormData) {
  const restaurantId = formData.get("restaurantId") as string;
  const categoryId = formData.get("categoryId") as string;

  if (!restaurantId || !categoryId) {
    redirect("/dashboard/categories?error=" + encodeURIComponent("درخواست نامعتبر"));
  }

  const supabase = await assertMembership(restaurantId);

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", categoryId)
    .eq("restaurant_id", restaurantId);

  if (error) {
    console.error("Category delete failed:", error);
    redirect(
      "/dashboard/categories?error=" + encodeURIComponent("خطا در حذف دسته‌بندی")
    );
  }

  redirect("/dashboard/categories");
}