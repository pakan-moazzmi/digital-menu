import { getCurrentRestaurant } from "@/lib/supabase/get-current-restaurant";
import { createMenuItemAction, deleteMenuItemAction } from "./actions";
import { ImageUploadField } from "@/components/ImageUploadField";
import { SubmitButton } from "@/components/SubmitButton";
import { ErrorBanner } from "@/components/ErrorBanner"; 

const SPICINESS_LABELS = ["بدون تندی", "ملایم", "متوسط", "تند", "خیلی تند"];

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const { supabase, restaurant } = await getCurrentRestaurant();

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .eq("restaurant_id", restaurant.id)
    .order("display_order", { ascending: true });

  const { data: items } = await supabase
    .from("menu_items")
    .select("id, name, price, is_available, spiciness_level, category_id, image_url")
    .eq("restaurant_id", restaurant.id)
    .order("display_order", { ascending: true });

  return (
    <main className="min-h-screen p-4 sm:p-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <a href="/dashboard" className="text-sm text-gray-500 hover:underline">
            ← بازگشت به داشبورد
          </a>
        </div>

        <h1 className="mb-6 text-2xl font-bold">مدیریت آیتم‌های منو</h1>
        <ErrorBanner message={params.error} />

        {(!categories || categories.length === 0) ? (
          <p className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-gray-500">
            اول باید حداقل یک دسته‌بندی بسازید.{" "}
            <a href="/dashboard/categories" className="underline">
              رفتن به مدیریت دسته‌بندی‌ها
            </a>
          </p>
        ) : (
          <>
            <form
              action={createMenuItemAction}
              className="mb-8 flex flex-col gap-3 rounded-2xl border border-gray-200 p-5"
            >
              <input type="hidden" name="restaurantId" value={restaurant.id} />
              <input
                type="hidden"
                name="nextOrder"
                value={items?.length ?? 0}
              />

              <h2 className="mb-1 font-semibold">افزودن غذای جدید</h2>

              <div>
                <label className="mb-1 block text-sm text-gray-600">
                  دسته‌بندی
                </label>
                <select
                  name="categoryId"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-black"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-600">
                  نام غذا
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="مثلاً چلو کباب سلطانی"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-600">
                  توضیحات
                </label>
                <textarea
                  name="description"
                  rows={2}
                  placeholder="مثلاً چلو به همراه کباب برگ و یک سیخ کوبیده"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-black"
                />
              </div>

              <ImageUploadField
                restaurantId={restaurant.id}
                name="imageUrl"
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm text-gray-600">
                    قیمت (تومان)
                  </label>
                  <input
                    name="price"
                    type="number"
                    min="0"
                    step="1000"
                    required
                    dir="ltr"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm text-gray-600">
                    سطح تندی
                  </label>
                  <select
                    name="spicinessLevel"
                    defaultValue="0"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-black"
                  >
                    {SPICINESS_LABELS.map((label, i) => (
                      <option key={i} value={i}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-600">
                  مواد تشکیل‌دهنده (با کاما جدا کنید)
                </label>
                <input
                  name="ingredients"
                  type="text"
                  placeholder="برنج، گوشت گوساله، زعفران، کره"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-600">
                  آلرژن‌ها (با کاما جدا کنید)
                </label>
                <input
                  name="allergens"
                  type="text"
                  placeholder="لبنیات، گلوتن"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-black"
                />
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="isAvailable"
                  value="true"
                  defaultChecked
                />
                در حال حاضر موجود است
              </label>

              <SubmitButton
                pendingText="در حال افزودن..."
                className="mt-2 self-start rounded-lg bg-black px-5 py-2 text-white hover:bg-gray-800"
              >
                افزودن غذا
              </SubmitButton>
            </form>

            {(!items || items.length === 0) && (
              <p className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-gray-500">
                هنوز هیچ غذایی اضافه نکرده‌اید.
              </p>
            )}

            <ul className="flex flex-col gap-2">
              {items?.map((item) => {
                const category = categories.find((c) => c.id === item.category_id);

                return (
                  <li
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="h-16 w-16 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-lg bg-gray-100" />
                      )}

                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          {category?.name} ·{" "}
                          {item.price.toLocaleString("fa-IR")} تومان ·{" "}
                          {item.is_available ? "موجود" : "ناموجود"}
                        </p>
                      </div>
                    </div>

                    <form action={deleteMenuItemAction}>
                      <input type="hidden" name="itemId" value={item.id} />
                      <input
                        type="hidden"
                        name="restaurantId"
                        value={restaurant.id}
                      />
                      <SubmitButton
                        pendingText="در حال حذف..."
                        className="text-sm text-red-600 hover:underline"
                      >
                        حذف
                      </SubmitButton>
                    </form>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </main>
  );
}