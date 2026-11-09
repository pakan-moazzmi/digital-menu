import { WOOD_STYLE } from "@/lib/menu-theme";

export default function MenuLoading() {
  return (
    <main
      className="min-h-screen px-4 py-10"
      style={WOOD_STYLE}
      aria-busy="true"
      aria-label="در حال بارگذاری"
    >
      <div className="mx-auto max-w-2xl animate-pulse">
        <div className="mx-auto mb-3 h-20 w-20 rounded-2xl bg-[#EADCC8]/10" />
        <div className="mx-auto mb-8 h-6 w-48 rounded bg-[#EADCC8]/10" />
        <div className="flex flex-col gap-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex gap-3 rounded-2xl border border-[#EADCC8]/10 bg-[#2B1B15]/80 p-3"
            >
              <div className="h-24 w-24 rounded-xl bg-[#EADCC8]/10" />
              <div className="flex-1 space-y-3 py-2">
                <div className="h-4 w-2/3 rounded bg-[#EADCC8]/10" />
                <div className="h-3 w-full rounded bg-[#EADCC8]/10" />
                <div className="h-5 w-24 rounded bg-[#F28C00]/20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}