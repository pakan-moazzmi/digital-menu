export function SuccessBanner({
  show,
  message = "تغییرات با موفقیت ذخیره شد",
}: {
  show?: string;
  message?: string;
}) {
  if (!show) return null;

  return (
    <p className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
      {message}
    </p>
  );
}