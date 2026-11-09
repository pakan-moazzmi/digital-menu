import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { recordMenuEvent } from "@/lib/analytics";
import { BeanIcon } from "@/components/BeanIcon";
import { WOOD_STYLE } from "@/lib/menu-theme";

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
    .eq("restaurant_id", restaurant!.id)
    .eq("slug", itemSlug)
    .single();

  if (!item || !item.is_available) {
    notFound();
  }

  await recordMenuEvent(supabase, slug, itemSlug);

  const { data: ingredientLinks } = await supabase
    .from("menu_item_ingredients")
    .select("ingredients(name)")
    .eq("menu_item_id", item.id);

  const { data: allergenLinks } = await supabase
    .from("menu_item_allergens")
    .select("allergens(name)")
    .eq("menu_item_id", item.id);

  const ingredients = (ingredientLinks ?? [])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((row: any) => row.ingredients?.name)
    .filter(Boolean);

  const allergens = (allergenLinks ?? [])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((row: any) => row.allergens?.name)
    .filter(Boolean);

  return (
    <main className="min-h-screen pb-12 text-[#FFE9C9]" style={WOOD_STYLE}>
      <div className="mx-auto max-w-3xl px-4 pt-5">
        <a
          href={`/menu/${slug}`}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#F28C00]/60 bg-[#1E110B]/80 px-5 py-2.5 text-sm font-semibold text-[#FFE9C9] transition duration-300 hover:bg-[#2B1A10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C00]"
        >
          ← بازگشت به منو
        </a>

        {/* تصویر */}
        <div className="relative overflow-hidden rounded-3xl border border-[#F28C00]/30 shadow-[0_16px_40px_rgba(0,0,0,0.55)]">
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.name}
              className="h-72 w-full object-cover sm:h-96"
            />
          ) : (
            <div className="h-56 w-full bg-gradient-to-br from-[#4A2A18] to-[#2B1B15] sm:h-72" />
          )}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#1E110B]/70 via-transparent to-transparent"
          />
        </div>

        <div className="mt-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h1 className="flex items-center gap-3 text-3xl font-extrabold leading-snug text-[#FFE9C9]">
              <span
                aria-hidden="true"
                className="h-8 w-1.5 shrink-0 rounded-full bg-[#F28C00] shadow-[0_0_10px_rgba(242,140,0,0.6)]"
              />
              {item.name}
            </h1>
            <span className="whitespace-nowrap rounded-full bg-[#F28C00] px-5 py-2 text-lg font-extrabold text-[#2B1405] shadow-[0_0_18px_rgba(242,140,0,0.4)]">
              {item.price.toLocaleString("fa-IR")} تومان
            </span>
          </div>

          <div
            aria-hidden="true"
            className="my-5 h-px w-full bg-gradient-to-r from-transparent via-[#F28C00]/60 to-transparent"
          />

          {item.spiciness_level > 0 && (
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#F28C00]/40 bg-[#1E110B]/80 px-4 py-1.5 text-sm text-[#EADCC8]">
              سطح تندی: {SPICINESS_LABELS[item.spiciness_level]}
              <BeanIcon />
            </p>
          )}

          {item.description && (
            <p className="mb-6 text-base leading-8 text-[#D9C7B0]">
              {item.description}
            </p>
          )}

          {ingredients.length > 0 && (
            <section className="mb-5 rounded-2xl border border-[#F28C00]/25 bg-gradient-to-br from-[#3A2013]/95 to-[#1E110B]/95 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
              <h2 className="mb-3 font-extrabold text-[#FFE9C9]">
                مواد تشکیل‌دهنده
              </h2>
              <div className="flex flex-wrap gap-2">
                {ingredients.map((name: string, i: number) => (
                  <span
                    key={i}
                    className="rounded-full border border-[#EADCC8]/25 bg-[#FFF7E8]/5 px-3 py-1 text-sm text-[#EADCC8]"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {allergens.length > 0 && (
            <section className="rounded-2xl border border-[#F28C00]/40 bg-[#F28C00]/10 p-4">
              <h2 className="mb-3 font-extrabold text-[#F28C00]">آلرژن‌ها</h2>
              <div className="flex flex-wrap gap-2">
                {allergens.map((name: string, i: number) => (
                  <span
                    key={i}
                    className="rounded-full border border-[#F28C00]/60 bg-[#F28C00]/20 px-3 py-1 text-sm text-[#FFD9A0]"
                  >
                    {name}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-xs leading-6 text-[#D9C7B0]">
                در صورت حساسیت غذایی، لطفاً با کارکنان رستوران هماهنگ کنید.
              </p>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}