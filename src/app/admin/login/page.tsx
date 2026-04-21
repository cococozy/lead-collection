"use client";

import { useActionState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

function LoginForm() {
  const router = useRouter();

  async function action(_prev: string | null, formData: FormData) {
    const result = await signIn("credentials", {
      password: formData.get("password"),
      redirect: false,
    });

    if (result?.error) {
      return "비밀번호가 올바르지 않습니다.";
    }

    router.push("/admin");
    return null;
  }

  const [error, formAction, isPending] = useActionState(action, null);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          비밀번호
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? "로그인 중..." : "로그인"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-md">
        <h1 className="text-xl font-bold text-gray-900 mb-6 text-center">
          어드민
        </h1>
        <LoginForm />
      </div>
    </main>
  );
}
