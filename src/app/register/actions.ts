"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function registerAction(formData: FormData) {
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!fullName || !email || !password) {
    redirect("/register?error=" + encodeURIComponent("همه‌ی فیلدها الزامی هستند"));
  }

  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError || !authData.user) {
    redirect("/register?error=" + encodeURIComponent(authError?.message ?? "خطا در ثبت‌نام"));
  }

  const userId = authData.user!.id;

  // اطمینان از وجود سشن معتبر (برای اینکه auth.uid() در RLS مقدار داشته باشد)
  if (!authData.session) {
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      console.error("Sign-in after signUp failed:", signInError);
      redirect("/register?error=" + encodeURIComponent("خطا در ایجاد نشست کاربری"));
    }
  }

  // ساخت پروفایل
  const { error: profileError } = await supabase.from("profiles").upsert({
    id: userId,
    full_name: fullName,
  });

  if (profileError) {
    console.error("Profile insert failed:", profileError);
    redirect("/register?error=" + encodeURIComponent("خطا در ساخت پروفایل"));
  }

  // ساخت یک رستوران خالی برای کاربر تازه‌ثبت‌شده
  const { data: restaurant, error: restaurantError } = await supabase
    .from("restaurants")
    .insert({
      name: fullName + " - رستوران من",
      slug: "restaurant-" + userId.slice(0, 8),
    })
    .select()
    .single();

  if (restaurantError || !restaurant) {
    console.error("Restaurant insert failed:", restaurantError);
    redirect("/register?error=" + encodeURIComponent("خطا در ساخت رستوران"));
  }

  // عضو کردن کاربر به‌عنوان مالک رستوران
  const { error: memberError } = await supabase.from("restaurant_members").insert({
    restaurant_id: restaurant.id,
    user_id: userId,
    role: "owner",
  });

  if (memberError) {
    console.error("Member insert failed:", memberError);
    redirect("/register?error=" + encodeURIComponent("خطا در ثبت عضویت رستوران"));
  }

  redirect("/dashboard");
}