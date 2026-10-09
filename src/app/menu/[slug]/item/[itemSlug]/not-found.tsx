export default function ItemNotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 p-8 text-center">
      <h1 className="text-2xl font-bold">غذا پیدا نشد</h1>
      <p className="text-gray-500">
        این غذا وجود ندارد یا در حال حاضر موجود نیست.
      </p>
    </main>
  );
}