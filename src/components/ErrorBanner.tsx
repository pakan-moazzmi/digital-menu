export function ErrorBanner({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
      {message}
    </p>
  );
}