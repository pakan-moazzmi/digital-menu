"use client";

import { useEffect, useRef, useState } from "react";

export function CategoryNav({
  categories,
}: {
  categories: { id: string; name: string }[];
}) {
  const [activeId, setActiveId] = useState("all");
  const listRef = useRef<HTMLDivElement>(null);

  // تشخیص دسته‌ی فعال بر اساس محل اسکرول
  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      let current = "all";
      for (const c of categories) {
        const el = document.getElementById(`cat-${c.id}`);
        if (el && el.getBoundingClientRect().top <= 140) current = c.id;
      }
      setActiveId(current);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [categories]);

  // دسته‌ی فعال همیشه در نوار افقی دیده شود
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-id="${activeId}"]`
    );
    el?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [activeId]);

  const pills = [
    { id: "all", name: "همه موارد", href: "#menu-top" },
    ...categories.map((c) => ({ id: c.id, name: c.name, href: `#cat-${c.id}` })),
  ];

  return (
    <nav
      aria-label="دسته‌بندی منو"
      className="sticky top-0 z-20 bg-[#1B0F09]/85 backdrop-blur-md"
    >
      <div
        ref={listRef}
        className="mx-auto flex max-w-2xl gap-2.5 overflow-x-auto px-4 py-3.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {pills.map((pill) => {
          const active = pill.id === activeId;
          return (
            <a
              key={pill.id}
              href={pill.href}
              data-id={pill.id}
              aria-current={active ? "true" : undefined}
              className={`shrink-0 whitespace-nowrap rounded-full border px-5 py-2.5 text-sm font-semibold transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C00] ${
                active
                  ? "border-[#F28C00] bg-[#F28C00] text-[#2B1405] shadow-[0_0_18px_rgba(242,140,0,0.45)]"
                  : "border-[#F28C00]/60 bg-[#1E110B]/80 text-[#FFE9C9] hover:bg-[#2B1A10]"
              }`}
            >
              {pill.name}
            </a>
          );
        })}
      </div>
      <div
        aria-hidden="true"
        className="h-px w-full bg-gradient-to-r from-transparent via-[#F28C00]/70 to-transparent shadow-[0_0_12px_rgba(242,140,0,0.6)]"
      />
    </nav>
  );
}