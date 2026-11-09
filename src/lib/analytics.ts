import { createClient } from "@/lib/supabase/server";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

/**
 * یک بازدید ناشناس ثبت می‌کند. اگر itemSlug داده شود، بازدید غذا است،
 * وگرنه بازدید منو. هر خطایی فقط لاگ می‌شود و هرگز صفحه را خراب نمی‌کند.
 */
export async function recordMenuEvent(
  supabase: SupabaseClient,
  restaurantSlug: string,
  itemSlug?: string
) {
  try {
    // بازدید صاحب رستوران (لاگین‌شده) را نمی‌شماریم تا آمار واقعی بماند
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) return;

    const { error } = await supabase.rpc("record_menu_event", {
      p_restaurant_slug: restaurantSlug,
      p_item_slug: itemSlug ?? null,
      p_event_type: itemSlug ? "item_view" : "menu_view",
    });

    if (error) {
      console.error("record_menu_event failed:", error);
    }
  } catch (err) {
    console.error("record_menu_event threw:", err);
  }
}