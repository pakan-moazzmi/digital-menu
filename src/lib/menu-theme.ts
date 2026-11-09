import type { CSSProperties } from "react";

// پس‌زمینه‌ی منوی عمومی: بافت چوب (فایل SVG) + درخشش نارنجی بالا + سایه‌ی پایین
export const WOOD_STYLE: CSSProperties = {
  backgroundColor: "#211713",
  backgroundImage: [
    "radial-gradient(90% 100% at 50% 0%, rgba(242,140,0,0.16), transparent 70%)",
    "radial-gradient(140% 100% at 50% 100%, rgba(0,0,0,0.55), transparent 65%)",
    "url(/menu-assets/wood.svg)",
  ].join(", "),
  backgroundSize: "100% 640px, 100% 100%, 1200px 1200px",
  backgroundPosition: "top, bottom, 0 0",
  backgroundRepeat: "no-repeat, no-repeat, repeat",
};