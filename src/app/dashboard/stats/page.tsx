import { getCurrentRestaurant } from "@/lib/supabase/get-current-restaurant";

// ایران ساعت تابستانی ندارد، پس اختلاف ثابت +03:30 است
const TZ = "Asia/Tehran";
const OFFSET = "+03:30";
const DAY_MS = 24 * 60 * 60 * 1000;

function dayKey(date: Date): string {
  // خروجی به شکل YYYY-MM-DD به وقت تهران
  return date.toLocaleDateString("en-CA", { timeZone: TZ });
}

function dayStartIso(key: string): string {
  return new Date(`${key}T00:00:00${OFFSET}`).toISOString();
}

export default async function StatsPage() {
  const { supabase, restaurant } = await getCurrentRestaurant();

  // ۷ روز اخیر، از قدیمی به جدید (آخرین مورد = امروز)
  const now = Date.now();
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(now - (6 - i) * DAY_MS);
    const key = dayKey(date);
    const nextKey = dayKey(new Date(date.getTime() + DAY_MS));
    return {
      key,
      label: date.toLocaleDateString("fa-IR", {
        timeZone: TZ,
        weekday: "short",
        day: "numeric",
        month: "numeric",
      }),
      start: dayStartIso(key),
      end: dayStartIso(nextKey),
    };
  });

  const dailyCounts = await Promise.all(
    days.map(async (day) => {
      const { count } = await supabase
        .from("menu_events")
        .select("id", { count: "exact", head: true })
        .eq("restaurant_id", restaurant.id)
        .eq("event_type", "menu_view")
        .gte("created_at", day.start)
        .lt("created_at", day.end);
      return count ?? 0;
    })
  );

  const todayViews = dailyCounts[dailyCounts.length - 1];
  const weekViews = dailyCounts.reduce((sum, n) => sum + n, 0);
  const maxDaily = Math.max(1, ...dailyCounts);

  // پربازدیدترین غذاها در ۷ روز اخیر
  const { data: itemEvents } = await supabase
    .from("menu_events")
    .select("menu_item_id")
    .eq("restaurant_id", restaurant.id)
    .eq("event_type", "item_view")
    .gte("created_at", days[0].start)
    .limit(1000);

  const itemCounts = new Map<string, number>();
  for (const row of itemEvents ?? []) {
    if (!row.menu_item_id) continue;
    itemCounts.set(row.menu_item_id, (itemCounts.get(row.menu_item_id) ?? 0) + 1);
  }

  const topIds = [...itemCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  let topItems: { name: string; count: number }[] = [];
  if (topIds.length > 0) {
    const { data: items } = await supabase
      .from("menu_items")
      .select("id, name")
      .eq("restaurant_id", restaurant.id)
      .in(
        "id",
        topIds.map(([id]) => id)
      );

    const nameById = new Map((items ?? []).map((i) => [i.id, i.name]));
    topItems = topIds
      .map(([id, count]) => ({ name: nameById.get(id) ?? "", count }))
      .filter((i) => i.name);
  }

  const maxItem = Math.max(1, ...topItems.map((i) => i.count));
  const fa = (n: number) => n.toLocaleString("fa-IR");

  return (
    <main className="min-h-screen p-4 sm:p-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <a href="/dashboard" className="text-sm text-gray-500 hover:underline">
            ← بازگشت به داشبورد
          </a>
        </div>

        <h1 className="mb-6 text-2xl font-bold">آمار بازدید منو</h1>

        <div className="mb-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">بازدید امروز</p>
            <p className="mt-1 text-3xl font-bold">{fa(todayViews)}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">بازدید ۷ روز اخیر</p>
            <p className="mt-1 text-3xl font-bold">{fa(weekViews)}</p>
          </div>
        </div>

        <section className="mb-6 rounded-2xl border border-gray-200 p-5">
          <h2 className="mb-4 font-semibold">بازدید روزانه</h2>
          <div className="flex flex-col gap-2">
            {days.map((day, i) => (
              <div key={day.key} className="flex items-center gap-3 text-sm">
                <span className="w-24 shrink-0 text-gray-600">{day.label}</span>
                <div className="h-3 flex-1 rounded-full bg-gray-100">
                  <div
                    className="h-3 rounded-full bg-black"
                    style={{ width: `${(dailyCounts[i] / maxDaily) * 100}%` }}
                  />
                </div>
                <span className="w-10 shrink-0 text-end">{fa(dailyCounts[i])}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 p-5">
          <h2 className="mb-4 font-semibold">پربازدیدترین غذاها (۷ روز اخیر)</h2>
          {topItems.length === 0 ? (
            <p className="rounded-lg border border-dashed border-gray-300 p-4 text-center text-sm text-gray-500">
              هنوز بازدیدی از صفحه‌ی غذاها ثبت نشده است.
            </p>
          ) : (
            <ol className="flex flex-col gap-3">
              {topItems.map((item, i) => (
                <li key={item.name + i} className="text-sm">
                  <div className="mb-1 flex justify-between">
                    <span>
                      {fa(i + 1)}. {item.name}
                    </span>
                    <span className="text-gray-500">{fa(item.count)} بازدید</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full bg-gray-700"
                      style={{ width: `${(item.count / maxItem) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ol>
          )}
        </section>

        <p className="mt-4 text-xs text-gray-400">
          بازدید خودتان (وقتی وارد حساب هستید) شمرده نمی‌شود. هر بار باز شدن صفحه یک بازدید است.
        </p>
      </div>
    </main>
  );
}