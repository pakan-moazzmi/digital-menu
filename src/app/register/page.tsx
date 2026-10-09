
import { registerAction } from "./actions";
import { SubmitButton } from "@/components/SubmitButton";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 p-8">
        <h1 className="mb-6 text-center text-2xl font-bold">ثبت‌نام رستوران</h1>

        <form action={registerAction} className="flex flex-col gap-4">
          <div>
            <label htmlFor="fullName" className="mb-1 block text-sm text-gray-600">
              نام و نام خانوادگی
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-black"
            />
          </div>

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
              minLength={6}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-black"
              dir="ltr"
            />
          </div>

          <SubmitButton
            pendingText="در حال ثبت‌نام..."
            className="mt-2 rounded-lg bg-black px-4 py-2 text-white transition hover:bg-gray-800"
          >
            ثبت‌نام
          </SubmitButton>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          حساب دارید؟{" "}
          <a href="/login" className="font-medium text-black underline">
            وارد شوید
          </a>
        </p>
      </div>
    </main>
  );
}

