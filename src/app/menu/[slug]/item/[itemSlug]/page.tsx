
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const SPICINESS_LABELS = ["بدون تندی", "ملایم", "متوسط", "تند", "خیلی تند"];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; itemSlug: string }>;
}): Promise<Metadata> {
  const { slug, itemSlug } = await params;
  const supabase = await createClient();

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("id, name")
    .eq("slug", slug)
    .single();

  if (!restaurant) {
    return { title: "غذا پیدا نشد" };
  }

  const { data: item } = await supabase
    .from("menu_items")
    .select("name, description")
    .eq("restaurant_id", restaurant.id)
    .eq("slug", itemSlug)
    .single();

  if (!item) {
    return { title: "غذا پیدا نشد" };
  }

  return {
    title: `${item.name} | ${restaurant.name}`,
    description: item.description ?? undefined,
  };
}

export default async function MenuItemDetailPage({
  params,
}: {
  params: Promise<{ slug: string; itemSlug: string }>;
}) {
  const { slug, itemSlug } = await params;
  const supabase = await createClient();

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("id, name")
    .eq("slug", slug)
    .single();

  if (!restaurant) {
    notFound();
  }

  const { data: item } = await supabase
    .from("menu_items")
    .select(
      "id, name, description, price, image_url, spiciness_level, is_available"
    )
    .eq("restaurant_id", restaurant.id)
    .eq("slug", itemSlug)
    .single();

  if (!item || !item.is_available) {
    notFound();
  }

  const { data: ingredientLinks, error: ingredientsError } = await supabase
    .from("menu_item_ingredients")
    .select("ingredients(name)")
    .eq("menu_item_id", item.id);

  const { data: allergenLinks, error: allergensError } = await supabase
    .from("menu_item_allergens")
    .select("allergens(name)")
    .eq("menu_item_id", item.id);

  if (ingredientsError) {
    console.error("PUBLIC MENU INGREDIENTS ERROR:", {
      message: ingredientsError.message,
      details: ingredientsError.details,
      hint: ingredientsError.hint,
      code: ingredientsError.code,
    });
  }

  if (allergensError) {
    console.error("PUBLIC MENU ALLERGENS ERROR:", {
      message: allergensError.message,
      details: allergensError.details,
      hint: allergensError.hint,
      code: allergensError.code,
    });
  }

  const ingredients = (ingredientLinks ?? [])
    .map((row: any) => row.ingredients?.name)
    .filter(Boolean);

  const allergens = (allergenLinks ?? [])
    .map((row: any) => row.allergens?.name)
    .filter(Boolean);

  return (
    <main className="min-h-screen bg-gray-50 pb-16">
      <div className="border-b border-gray-200 bg-white px-4 py-3">
        <a
          href={`/menu/${slug}`}
          className="text-sm text-gray-500 hover:underline"
        >
          ← بازگشت به منو
        </a>
      </div>

      {item.image_url ? (
        <img
          src={item.image_url}
          alt={item.name}
          className="h-64 w-full object-cover"
        />
      ) : (
        <div className="h-64 w-full bg-gray-100" />
      )}

      <div className="mx-auto max-w-2xl px-4 py-6">
        <div className="mb-2 flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold">{item.name}</h1>

          <span className="whitespace-nowrap text-lg font-semibold">
            {Number(item.price).toLocaleString("fa-IR")} تومان
          </span>
        </div>

        <span className="mb-4 inline-block rounded-full bg-red-50 px-3 py-1 text-sm text-red-600">
          سطح تندی:{" "}
          {SPICINESS_LABELS[item.spiciness_level] ?? "نامشخص"}
        </span>

        {item.description && (
          <p className="mb-6 leading-relaxed text-gray-700">
            {item.description}
          </p>
        )}

        {ingredients.length > 0 && (
          <section className="mb-5">
            <h2 className="mb-2 font-semibold">مواد تشکیل‌دهنده</h2>

            <div className="flex flex-wrap gap-2">
              {ingredients.map((name, i) => (
                <span
                  key={i}
                  className="rounded-full bg-white px-3 py-1 text-sm text-gray-700 ring-1 ring-gray-200"
                >
                  {name}
                </span>
              ))}
            </div>
          </section>
        )}

        {allergens.length > 0 && (
          <section>
            <h2 className="mb-2 font-semibold">آلرژن‌ها</h2>

            <div className="flex flex-wrap gap-2">
              {allergens.map((name, i) => (
                <span
                  key={i}
                  className="rounded-full bg-amber-50 px-3 py-1 text-sm text-amber-700 ring-1 ring-amber-200"
                >
                  {name}
                </span>
              ))}
            </div>

            <p className="mt-2 text-xs text-gray-400">
              در صورت حساسیت غذایی، لطفاً با کارکنان رستوران هماهنگ کنید.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}

