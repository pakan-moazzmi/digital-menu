import { CupIcon } from "@/components/CupIcon";

export function PromoBox() {
  return (
    <aside className="mx-auto mt-10 max-w-2xl px-4 pb-10">
      <a
        href="/"
        className="group flex items-center gap-3 overflow-hidden rounded-2xl border border-[#F28C00]/50 bg-gradient-to-br from-[#3A2013]/95 to-[#1E110B]/95 p-4 shadow-[0_0_24px_rgba(242,140,0,0.18)] transition duration-300 hover:border-[#F28C00] hover:shadow-[0_0_30px_rgba(242,140,0,0.32)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C00]"
      >
        <span
          aria-hidden="true"
          className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#1E110B]/80 ring-1 ring-[#F28C00]/40 sm:flex"
        >
          <CupIcon className="h-10 w-10" />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-[#F28C00]">
            منوی دیجیتال هوشمند
          </p>
          <p className="mt-1 text-sm font-extrabold leading-6 text-[#FFE9C9] sm:text-base">
            این منوی دیجیتال با چه سیستمی ساخته شده؟
          </p>
          <p className="mt-0.5 text-xs text-[#D9C7B0]">
            با امکانات سیستم آشنا شوید
          </p>
        </div>

        <span
          aria-hidden="true"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F28C00] text-[#2B1405] shadow-[0_0_18px_rgba(242,140,0,0.5)] transition duration-300 group-hover:-translate-x-1"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M11 6l-6 6 6 6" />
          </svg>
        </span>
      </a>
    </aside>
  );
}