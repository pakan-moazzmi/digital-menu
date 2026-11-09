
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

        
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <a href="/dashboard/settings" className="flex flex-col items-center gap-2 rounded-xl border border-gray-300 px-4 py-5 text-center text-sm transition hover:bg-gray-50">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
            </svg>
            تنظیمات رستوران
          </a>

          <a href="/dashboard/categories" className="flex flex-col items-center gap-2 rounded-xl border border-gray-300 px-4 py-5 text-center text-sm transition hover:bg-gray-50">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            دسته‌بندی‌ها
          </a>

          <a href="/dashboard/menu" className="flex flex-col items-center gap-2 rounded-xl border border-gray-300 px-4 py-5 text-center text-sm transition hover:bg-gray-50">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 6h13M8 12h13M8 18h13" />
              <path d="M3 6h.01M3 12h.01M3 18h.01" />
            </svg>
            مدیریت منو
          </a>

          <a href="/dashboard/qr" className="flex flex-col items-center gap-2 rounded-xl border border-gray-300 px-4 py-5 text-center text-sm transition hover:bg-gray-50">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <path d="M14 14h3v3h-3zM20 14v.01M14 20h.01M20 20h.01M17 20v-3" />
            </svg>
            QR کد
          </a>

          <a href="/dashboard/stats" className="flex flex-col items-center gap-2 rounded-xl border border-gray-300 px-4 py-5 text-center text-sm transition hover:bg-gray-50">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
            </svg>
            آمار و بازدیدها
          </a>
        </div>


       
      </div>
    </main>
  );
}

