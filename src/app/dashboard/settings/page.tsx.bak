import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { updateRestaurantAction } from "./actions";
import { SubmitButton } from "@/components/SubmitButton";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const params = await searchParams;
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
    .eq("user_id", user.id)
    .single();

  if (!membership) {
    redirect("/dashboard");
  }

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("id, name, slug, description")
    .eq("id", membership.restaurant_id)
    .single();

  if (!restaurant) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen p-4 sm:p-8">
      <div className="mx-auto max-w-xl">
        <div className="mb-6">
          <a href="/dashboard" className="text-sm text-gray-500 hover:underline">
            ← بازگشت به داشبورد
          </a>
        </div>

        <h1 className="mb-6 text-2xl font-bold">تنظیمات رستوران</h1>

        {params.error && (
          <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {params.error}
          </p>
        )}
        {params.success && (
          <p className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
            تغییرات با موفقیت ذخیره شد
          </p>
        )}

        <form action={updateRestaurantAction} className="flex flex-col gap-4">
          <input type="hidden" name="restaurantId" value={restaurant.id} />

          <div>
            <label htmlFor="name" className="mb-1 block text-sm text-gray-600">
              نام رستوران
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              defaultValue={restaurant.name}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-black"
            />
          </div>

          <div>
            <label htmlFor="slug" className="mb-1 block text-sm text-gray-600">
              آدرس منوی عمومی (اسلاگ)
            </label>
            <div className="flex items-center gap-2" dir="ltr">
              <span className="text-sm text-gray-400">/menu/</span>
              <input
                id="slug"
                name="slug"
                type="text"
                required
                pattern="[a-z0-9\-]+"
                title="فقط حروف انگلیسی کوچک، عدد و خط تیره مجاز است"
                defaultValue={restaurant.slug}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-black"
              />
            </div>
            <p className="mt-1 text-xs text-gray-400">
              فقط حروف انگلیسی کوچک، عدد و خط تیره (-). مثال: cafe-shiraz
            </p>
          </div>

          <div>
            <label htmlFor="description" className="mb-1 block text-sm text-gray-600">
              توضیحات رستوران
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={restaurant.description ?? ""}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-black"
            />
          </div>

          <SubmitButton
            pendingText="�� ��� �����..."
            className="mt-2 rounded-lg bg-black px-4 py-2 text-white transition hover:bg-gray-800"
          >
            ������ �������
          </SubmitButton>
        </form>
      </div>
    </main>
  );
}



