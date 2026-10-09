import { getCurrentRestaurant } from "@/lib/supabase/get-current-restaurant";
import { QrCodeCard } from "@/components/QrCodeCard";

export default async function QrPage() {
  const { restaurant } = await getCurrentRestaurant();

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const menuUrl = `${baseUrl}/menu/${restaurant.slug}`;

  return (
    <main className="min-h-screen p-4 sm:p-8">
      <div className="mx-auto max-w-xl">
        <div className="mb-6">
          <a
            href="/dashboard"
            className="text-sm text-gray-500 hover:underline"
          >
            ← بازگشت به داشبورد
          </a>
        </div>

        <h1 className="mb-2 text-2xl font-bold">QR کد منوی شما</h1>

        <p className="mb-6 text-sm text-gray-500">
          این کد را چاپ کنید و روی میزهای رستوران قرار دهید. مشتری با اسکن آن
          مستقیم به منوی دیجیتال شما می‌رسد.
        </p>

        <QrCodeCard
          menuUrl={menuUrl}
          restaurantName={restaurant.slug}
        />

        <div className="mt-6 rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
          <p className="mb-1 font-medium">لینک منوی عمومی شما:</p>

          <a
            href={menuUrl}
            target="_blank"
            className="break-all text-blue-600 underline"
            dir="ltr"
          >
            {menuUrl}
          </a>
        </div>
      </div>
    </main>
  );
}