
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

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

  const { data: categories, error: categoriesError } = await supabase
    .from("categories")
    .select("id, name, display_order, restaurant_id")
    .eq("restaurant_id", restaurant.id)
    .order("display_order", { ascending: true });

  const { data: items, error: itemsError } = await supabase
    .from("menu_items")
    .select(
      "id, slug, name, description, price, image_url, spiciness_level, is_available, category_id, restaurant_id, display_order"
    )
    .eq("restaurant_id", restaurant.id)
    .eq("is_available", true)
    .order("display_order", { ascending: true });

  // جلوگیری از نمایش منوی خالی در صورت خطای دریافت اطلاعات
 if (categoriesError || itemsError) {
  console.error("PUBLIC MENU CATEGORIES ERROR:", {
    message: categoriesError?.message,
    details: categoriesError?.details,
    hint: categoriesError?.hint,
    code: categoriesError?.code,
  });

  console.error("PUBLIC MENU ITEMS ERROR:", {
    message: itemsError?.message,
    details: itemsError?.details,
    hint: itemsError?.hint,
    code: itemsError?.code,
  });
}

  const validCategories = (categories ?? []).filter(
    (category) => category.restaurant_id === restaurant.id
  );

  const validItems = (items ?? []).filter(
    (item) =>
      item.restaurant_id === restaurant.id &&
      item.is_available === true
  );

  const categoriesWithItems = validCategories
    .map((category) => ({
      ...category,
      items: validItems.filter(
        (item) => item.category_id === category.id
      ),
    }))
    .filter((category) => category.items.length > 0);

  return (
    <main className="min-h-screen bg-gray-50 pb-16">
      {/* هدر رستوران */}
      <header className="border-b border-gray-200 bg-white px-4 py-6 text-center">
        {restaurant.logo_url && (
          <img
            src={restaurant.logo_url}
            alt={restaurant.name}
            className="mx-auto mb-3 h-16 w-16 rounded-full object-cover"
          />
        )}
        <h1 className="text-xl font-bold">{restaurant.name}</h1>
        {restaurant.description && (
          <p className="mt-1 text-sm text-gray-500">{restaurant.description}</p>
        )}
      </header>

      {categoriesWithItems.length > 0 && (
        <nav className="sticky top-0 z-10 overflow-x-auto border-b border-gray-200 bg-white/95 backdrop-blur">
          <div
            className="flex gap-2 px-4 py-3"
            style={{ width: "max-content" }}
          >
            {categoriesWithItems.map((category) => (
              <a
                key={category.id}
                href={`#cat-${category.id}`}
                className="whitespace-nowrap rounded-full border border-gray-200 px-4 py-1.5 text-sm text-gray-600 hover:border-gray-400"
              >
                {category.name}
              </a>
            ))}
          </div>
        </nav>
      )}

      {categoriesWithItems.length === 0 ? (
        <p className="mt-10 text-center text-gray-500">
          منوی این رستوران هنوز آماده نیست.
        </p>
      ) : (
        <div className="mx-auto max-w-2xl px-4 py-6">
          {categoriesWithItems.map((category) => (
            <section
              key={category.id}
              id={`cat-${category.id}`}
              className="mb-8 scroll-mt-16"
            >
              <h2 className="mb-3 text-lg font-bold">{category.name}</h2>

              <div className="flex flex-col gap-3">
                {category.items.map((item) => (
                  <a
                    key={item.id}
                    href={`/menu/${slug}/item/${item.slug}`}
                    className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 transition hover:border-gray-300"
                  >
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="h-20 w-20 flex-shrink-0 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-20 w-20 flex-shrink-0 rounded-lg bg-gray-100" />
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{item.name}</p>

                      {item.description && (
                        <p className="mt-0.5 line-clamp-2 text-sm text-gray-500">
                          {item.description}
                        </p>
                      )}

                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-sm font-semibold">
                          {Number(item.price).toLocaleString("fa-IR")} تومان
                        </span>

                        {item.spiciness_level > 0 && (
                          <span className="text-xs text-red-500">
                            {SPICINESS_LABELS[item.spiciness_level]}
                          </span>
                        )}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}

