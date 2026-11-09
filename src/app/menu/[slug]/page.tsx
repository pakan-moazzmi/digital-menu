import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { recordMenuEvent } from "@/lib/analytics";
import { PromoBox } from "@/components/PromoBox";
import { CategoryNav } from "@/components/CategoryNav";
import { BeanIcon } from "@/components/BeanIcon";
import { CupIcon } from "@/components/CupIcon";
import { WOOD_STYLE } from "@/lib/menu-theme";

const SPICINESS_LABELS = ["", "ملایم", "متوسط", "تند", "خیلی تند"];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("name, description")
    .eq("slug", slug)
    .single();

  if (!restaurant) {
    return { title: "منو پیدا نشد" };
  }

  return {
    title: `منوی ${restaurant.name}`,
    description: restaurant.description ?? `منوی دیجیتال ${restaurant.name}`,
  };
}

export default async function PublicMenuPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("id, name, description, logo_url")
    .eq("slug", slug)
    .single();

  if (!restaurant) {
    notFound();
  }

  await recordMenuEvent(supabase, slug);

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, display_order")
    .eq("restaurant_id", restaurant!.id)
    .order("display_order", { ascending: true });

  const { data: items } = await supabase
    .from("menu_items")
    .select(
      "id, slug, name, description, price, image_url, spiciness_level, is_available, category_id, display_order"
    )
    .eq("restaurant_id", restaurant!.id)
    .eq("is_available", true)
    .order("display_order", { ascending: true });

  const categoriesWithItems = (categories ?? [])
    .map((category) => ({
      ...category,
      items: (items ?? []).filter((item) => item.category_id === category.id),
    }))
    .filter((category) => category.items.length > 0);

  return (
    <main className="min-h-screen text-[#FFE9C9]" style={WOOD_STYLE}>
      {/* هدر رستوران */}
      <header className="relative overflow-hidden px-4 pb-8 pt-12 text-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-6 top-4 h-px bg-gradient-to-r from-transparent via-[#F28C00] to-transparent shadow-[0_0_12px_rgba(242,140,0,0.7)]"
        />
        <img
          src="/menu-assets/decor-left.webp"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 w-28 select-none sm:w-52"
        />
        <img
          src="/menu-assets/decor-right.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 w-24 select-none sm:w-44"
        />

        <div className="relative">
          {restaurant!.logo_url ? (
            <img
              src={restaurant!.logo_url}
              alt={restaurant!.name}
              className="mx-auto h-24 w-24 rounded-2xl border border-[#F28C00]/70 object-cover shadow-[0_0_24px_rgba(242,140,0,0.3)]"
            />
          ) : (
            <span
              aria-hidden="true"
              className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl border border-[#F28C00]/70 bg-[#1E110B]/90 shadow-[0_0_24px_rgba(242,140,0,0.3)]"
            >
              <CupIcon />
            </span>
          )}

          <h1 className="mt-5 text-4xl font-extrabold leading-snug text-[#FFE9C9] [text-shadow:0_2px_18px_rgba(242,140,0,0.35)] sm:text-5xl">
            {restaurant!.name}
          </h1>

          {restaurant!.description && (
            <div className="mt-3 flex items-center justify-center gap-3">
              <span
                aria-hidden="true"
                className="h-px w-8 bg-gradient-to-l from-[#F28C00] to-transparent sm:w-24"
              />
              <p className="max-w-xs text-sm text-[#EADCC8] sm:max-w-md sm:text-base">
                {restaurant!.description}
              </p>
              <span
                aria-hidden="true"
                className="h-px w-8 bg-gradient-to-r from-[#F28C00] to-transparent sm:w-24"
              />
            </div>
          )}
        </div>
      </header>

      {categoriesWithItems.length > 0 && (
        <CategoryNav
          categories={categoriesWithItems.map((c) => ({ id: c.id, name: c.name }))}
        />
      )}

      <div id="menu-top" className="scroll-mt-20" />

      {categoriesWithItems.length === 0 ? (
        <p className="mx-4 mt-10 rounded-2xl border border-dashed border-[#F28C00]/40 p-8 text-center text-[#D9C7B0]">
          منوی این رستوران هنوز آماده نیست.
        </p>
      ) : (
        <div className="mx-auto max-w-2xl px-4 pb-4 pt-6">
          {categoriesWithItems.map((category) => (
            <section
              key={category.id}
              id={`cat-${category.id}`}
              className="mb-8 scroll-mt-20"
            >
              <h2 className="mb-3 flex items-center gap-3 text-xl font-extrabold text-[#FFE9C9] sm:text-2xl">
                <span
                  aria-hidden="true"
                  className="h-7 w-1.5 rounded-full bg-[#F28C00] shadow-[0_0_10px_rgba(242,140,0,0.6)]"
                />
                {category.name}
              </h2>

              <div className="flex flex-col gap-3.5">
                {category.items.map((item) => (
                  <a
                    key={item.id}
                    href={`/menu/${slug}/item/${item.slug}`}
                    className="group flex overflow-hidden rounded-2xl border border-[#F28C00]/25 bg-gradient-to-br from-[#3A2013]/95 to-[#1E110B]/95 shadow-[0_10px_30px_rgba(0,0,0,0.45)] transition duration-300 hover:-translate-y-0.5 hover:border-[#F28C00]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C00] active:scale-[0.99]"
                  >
                    <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-3 p-3.5 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                      <div className="min-w-0">
                        <p className="text-lg font-extrabold leading-7 text-[#FFE9C9]">
                          {item.name}
                        </p>
                        {item.description && (
                          <p className="mt-1 line-clamp-2 text-sm leading-6 text-[#D9C7B0]">
                            {item.description}
                          </p>
                        )}
                        {item.spiciness_level > 0 && (
                          <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-[#EADCC8]">
                            {SPICINESS_LABELS[item.spiciness_level]}
                            <BeanIcon />
                          </p>
                        )}
                      </div>

                      <span className="shrink-0 whitespace-nowrap rounded-full bg-[#F28C00] px-4 py-1.5 text-sm font-extrabold text-[#2B1405] shadow-[0_0_16px_rgba(242,140,0,0.35)]">
                        {item.price.toLocaleString("fa-IR")} تومان
                      </span>
                    </div>

                    <div className="relative min-h-[9.5rem] w-[36%] shrink-0 sm:w-[34%]">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#4A2A18] to-[#2B1B15]" />
                      )}
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-l from-[#1E110B]/80 via-transparent to-transparent"
                      />
                    </div>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <PromoBox />
    </main>
  );
}