import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function getCurrentRestaurant() {
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
    .single();

  if (!membership) {
    redirect("/dashboard");
  }

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("id, name, slug")
    .eq("id", membership.restaurant_id)
    .single();

  if (!restaurant) {
    redirect("/dashboard");
  }

  return { supabase, user, restaurant };
}