
import { createClient } from "@/lib/supabase/server";
import { logoutAction } from "./actions";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user!.id)
    .single();

  return (
    <main className="min-h-screen p-4 sm:p-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold">
            خوش آمدید، {profile?.full_name ?? "کاربر"}
          </h1>

          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 sm:w-auto"
            >
              خروج
            </button>
          </form>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <a
            href="/dashboard/settings"
            className="rounded-lg border border-gray-300 px-4 py-3 text-center text-sm hover:bg-gray-50"
          >
            تنظیمات رستوران
          </a>

          <a
            href="/dashboard/categories"
            className="rounded-lg border border-gray-300 px-4 py-3 text-center text-sm hover:bg-gray-50"
          >
            دسته‌بندی‌ها
          </a>

          <a
            href="/dashboard/menu"
            className="rounded-lg border border-gray-300 px-4 py-3 text-center text-sm hover:bg-gray-50"
          >
            مدیریت منو
          </a>

          <a
            href="/dashboard/qr"
            className="rounded-lg border border-gray-300 px-4 py-3 text-center text-sm hover:bg-gray-50"
          >
            QR کد
          </a>
        </div>

        <p className="text-gray-600">
          این داشبورد شماست. در فازهای بعدی، مدیریت منو، دسته‌بندی‌ها و تنظیمات را اینجا می‌سازیم.
        </p>
      </div>
    </main>
  );
}

