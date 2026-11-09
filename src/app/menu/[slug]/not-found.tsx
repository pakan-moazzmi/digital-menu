import { WOOD_STYLE } from "@/lib/menu-theme";

export default function MenuNotFound() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center gap-3 p-8 text-center text-[#FFF7E8]"
      style={WOOD_STYLE}
    >
      <h1 className="text-2xl font-bold">منو پیدا نشد</h1>
      <p className="text-[#B9A99A]">
        متأسفانه رستورانی با این آدرس وجود ندارد یا هنوز منویی ثبت نکرده است.
      </p>
    </main>
  );
}