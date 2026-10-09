"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slugify";
import {
  ValidationError,
  requireNonEmpty,
  requirePositiveNumber,
  requireMaxLength,
} from "@/lib/validation";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

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

function parseCommaList(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((v) => v.trim())
    .filter((v) => v.length > 0);
}

/**
 * برای هر نام در فهرست، اگر قبلاً برای این رستوران وجود دارد همان را استفاده می‌کند،
 * وگرنه یک ردیف جدید می‌سازد. سپس آی‌دی‌های نهایی را برمی‌گرداند.
 *
 * برخلاف نسخه‌ی قبلی، اگر هر Insert با خطا مواجه شود، این تابع یک Error واقعی
 * پرتاب می‌کند (به‌جای این‌که فقط لاگ کند و با لیست ناقص ادامه دهد) — تا خطای
 * واقعی به جای از بین رفتن بی‌صدا، در لایه‌ی بالاتر مدیریت شود.
 */
async function upsertNamesAndGetIds(
  supabase: SupabaseClient,
  table: "ingredients" | "allergens",
  restaurantId: string,
  names: string[]
): Promise<string[]> {
  if (names.length === 0) return [];

  const { data: existing, error: selectError } = await supabase
    .from(table)
    .select("id, name")
    .eq("restaurant_id", restaurantId)
    .in("name", names);

  if (selectError) {
    throw new Error(
      `خطا در خواندن ${table}: ${selectError.message} (code: ${selectError.code})`
    );
  }

  const existingNames = new Set(existing?.map((r) => r.name) ?? []);
  // از ارسال نام‌های تکراری در یک Insert جلوگیری می‌کنیم
  const newNames = [...new Set(names.filter((n) => !existingNames.has(n)))];

  let insertedIds: { id: string; name: string }[] = [];
  if (newNames.length > 0) {
    const { data: inserted, error: insertError } = await supabase
      .from(table)
      .insert(newNames.map((name) => ({ restaurant_id: restaurantId, name })))
      .select("id, name");

    if (insertError) {
      throw new Error(
        `خطا در ساخت ${table}: ${insertError.message} (code: ${insertError.code}, details: ${insertError.details ?? "-"})`
      );
    }

    insertedIds = inserted ?? [];
  }

  return [...(existing ?? []), ...insertedIds].map((r) => r.id);
}

/**
 * ردیف‌های ارتباطی (menu_item_ingredients یا menu_item_allergens) را می‌سازد
 * و در صورت خطا، Error واقعی پرتاب می‌کند.
 */
async function linkMenuItemToIds(
  supabase: SupabaseClient,
  table: "menu_item_ingredients" | "menu_item_allergens",
  foreignKeyColumn: "ingredient_id" | "allergen_id",
  menuItemId: string,
  ids: string[]
) {
  if (ids.length === 0) return;

  const rows = ids.map((id) => ({
    menu_item_id: menuItemId,
    [foreignKeyColumn]: id,
  }));

  const { error } = await supabase.from(table).insert(rows);

  if (error) {
    throw new Error(
      `خطا در ثبت ارتباط ${table}: ${error.message} (code: ${error.code}, details: ${error.details ?? "-"})`
    );
  }
}

export async function createMenuItemAction(formData: FormData) {
  const restaurantId = formData.get("restaurantId") as string;
  const categoryId = formData.get("categoryId") as string;
  const spicinessLevel = Number(formData.get("spicinessLevel") ?? 0);
  const isAvailable = formData.get("isAvailable") === "true";
  const imageUrl = (formData.get("imageUrl") as string)?.trim() || null;
  const ingredientNames = parseCommaList(formData.get("ingredients") as string);
  const allergenNames = parseCommaList(formData.get("allergens") as string);
  const nextOrder = Number(formData.get("nextOrder") ?? 0);

  let name: string;
  let description: string;
  let price: number;

  try {
    name = requireMaxLength(
      requireNonEmpty(formData.get("name") as string, "نام غذا"),
      100,
      "نام غذا"
    );
    description = requireMaxLength(
      ((formData.get("description") as string) ?? "").trim(),
      500,
      "توضیحات"
    );
    price = requirePositiveNumber(formData.get("price") as string, "قیمت");
  } catch (err) {
    const message = err instanceof ValidationError ? err.message : "اطلاعات نامعتبر است";
    redirect("/dashboard/menu?error=" + encodeURIComponent(message));
  }

  if (!restaurantId || !categoryId) {
    redirect(
      "/dashboard/menu?error=" + encodeURIComponent("دسته‌بندی را انتخاب کنید")
    );
  }

  const supabase = await assertMembership(restaurantId);

  // تولید اسلاگ منحصربه‌فرد برای این رستوران
  const shortId = Math.random().toString(36).slice(2, 8);
  const slug = slugify(name!, "item-" + shortId);

  const { data: newItem, error: itemError } = await supabase
    .from("menu_items")
    .insert({
      restaurant_id: restaurantId,
      category_id: categoryId,
      name: name!,
      slug,
      description: description! || null,
      price: price!,
      image_url: imageUrl,
      spiciness_level: spicinessLevel,
      is_available: isAvailable,
      display_order: nextOrder,
    })
    .select("id")
    .single();

  if (itemError || !newItem) {
    console.error("Menu item insert failed:", itemError);
    redirect("/dashboard/menu?error=" + encodeURIComponent("خطا در افزودن غذا"));
  }

  try {
    const ingredientIds = await upsertNamesAndGetIds(
      supabase,
      "ingredients",
      restaurantId,
      ingredientNames
    );
    const allergenIds = await upsertNamesAndGetIds(
      supabase,
      "allergens",
      restaurantId,
      allergenNames
    );

    await linkMenuItemToIds(
      supabase,
      "menu_item_ingredients",
      "ingredient_id",
      newItem!.id,
      ingredientIds
    );
    await linkMenuItemToIds(
      supabase,
      "menu_item_allergens",
      "allergen_id",
      newItem!.id,
      allergenIds
    );
  } catch (err) {
    // غذا قبلاً ساخته شده؛ ولی مواد تشکیل‌دهنده/آلرژن ذخیره نشدند.
    // خطای واقعی را کامل در ترمینال سرور چاپ می‌کنیم تا علت دقیق مشخص شود
    // (مثلاً RLS، Foreign Key، یا نبود دسترسی INSERT روی جدول).
    console.error("Ingredient/allergen linking failed:", err);

    const message = err instanceof Error ? err.message : "خطای نامشخص";
    redirect(
      "/dashboard/menu?error=" +
        encodeURIComponent(
          `غذا ذخیره شد، اما مواد تشکیل‌دهنده/آلرژن ثبت نشدند: ${message}`
        )
    );
  }

  redirect("/dashboard/menu");
}

export async function deleteMenuItemAction(formData: FormData) {
  const restaurantId = formData.get("restaurantId") as string;
  const itemId = formData.get("itemId") as string;

  if (!restaurantId || !itemId) {
    redirect("/dashboard/menu?error=" + encodeURIComponent("درخواست نامعتبر"));
  }

  const supabase = await assertMembership(restaurantId);

  const { error } = await supabase
    .from("menu_items")
    .delete()
    .eq("id", itemId)
    .eq("restaurant_id", restaurantId);

  if (error) {
    console.error("Menu item delete failed:", error);
    redirect("/dashboard/menu?error=" + encodeURIComponent("خطا در حذف غذا"));
  }

  redirect("/dashboard/menu");
}