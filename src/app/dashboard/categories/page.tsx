
import { getCurrentRestaurant } from "@/lib/supabase/get-current-restaurant";
import { createCategoryAction, deleteCategoryAction } from "./actions";
import { SubmitButton } from "@/components/SubmitButton";
import { ErrorBanner } from "@/components/ErrorBanner";

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const { supabase, restaurant } = await getCurrentRestaurant();

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, display_order")
    .eq("restaurant_id", restaurant.id)
    .order("display_order", { ascending: true });

  return (
    <main className="min-h-screen p-4 sm:p-8">
      <div className="mx-auto max-w-xl">
        <div className="mb-6">
          <a href="/dashboard" className="text-sm text-gray-500 hover:underline">
            ← بازگشت به داشبورد
          </a>
        </div>

        <h1 className="mb-6 text-2xl font-bold">مدیریت دسته‌بندی‌ها</h1>

        <ErrorBanner message={params.error} />

        <form
          action={createCategoryAction}
          className="mb-8 flex gap-2"
        >
          <input type="hidden" name="restaurantId" value={restaurant.id} />
          <input
            type="hidden"
            name="nextOrder"
            value={categories?.length ?? 0}
          />
          <input
            name="name"
            type="text"
            required
            placeholder="نام دسته‌بندی جدید (مثلاً غذاهای اصلی)"
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-black"
          />
          <SubmitButton
            pendingText="در حال افزودن..."
            className="rounded-lg bg-black px-5 py-2 text-white hover:bg-gray-800"
          >
            افزودن
          </SubmitButton>
        </form>

        {(!categories || categories.length === 0) && (
          <p className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-gray-500">
            هنوز هیچ دسته‌بندی‌ای اضافه نکرده‌اید.
          </p>
        )}

        <ul className="flex flex-col gap-2">
          {categories?.map((category) => (
            <li
              key={category.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3"
            >
              <span>{category.name}</span>
              <form action={deleteCategoryAction}>
                <input type="hidden" name="categoryId" value={category.id} />
                <input type="hidden" name="restaurantId" value={restaurant.id} />
                <SubmitButton
                  pendingText="در حال حذف..."
                  className="text-sm text-red-600 hover:underline"
                >
                  حذف
                </SubmitButton>
              </form>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}