
import { loginAction } from "./actions";
import { SubmitButton } from "@/components/SubmitButton";
import { ErrorBanner } from "@/components/ErrorBanner";
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 p-8">
        <h1 className="mb-6 text-center text-2xl font-bold">ورود</h1>

        <ErrorBanner message={params.error} />

        <form action={loginAction} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm text-gray-600">
              ایمیل
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-black"
              dir="ltr"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm text-gray-600">
              رمز عبور
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-black"
              dir="ltr"
            />
          </div>

          <SubmitButton
            pendingText="در حال ورود..."
            className="mt-2 rounded-lg bg-black px-4 py-2 text-white transition hover:bg-gray-800"
          >
            ورود
          </SubmitButton>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          حساب ندارید؟{" "}
          <a href="/register" className="font-medium text-black underline">
            ثبت‌نام کنید
          </a>
        </p>
      </div>
    </main>
  );
}

