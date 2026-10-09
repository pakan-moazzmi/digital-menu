export default function MenuNotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 p-8 text-center">
      <h1 className="text-2xl font-bold">منو پیدا نشد</h1>
      <p className="text-gray-500">
        متأسفانه رستورانی با این آدرس وجود ندارد یا هنوز منویی ثبت نکرده است.
      </p>
    </main>
  );
}