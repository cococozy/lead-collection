"use client";

import { useActionState, useRef } from "react";
import { submitLead, type ActionResult } from "@/app/actions";

const initialState: ActionResult | null = null;

export default function LeadForm() {
  const [result, action, isPending] = useActionState(
    async (_prev: ActionResult | null, formData: FormData) => {
      return submitLead(formData);
    },
    initialState
  );

  const formRef = useRef<HTMLFormElement>(null);

  if (result?.success) {
    return (
      <div className="text-center py-8">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">신청이 완료되었습니다!</h2>
        <p className="text-gray-500 mb-6">빠른 시일 내에 연락드리겠습니다.</p>
        <button
          onClick={() => {
            formRef.current?.reset();
            window.location.reload();
          }}
          className="text-sm text-blue-600 underline hover:text-blue-800"
        >
          다시 신청하기
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} action={action} className="space-y-5">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          이름 <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="홍길동"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          전화번호 <span className="text-red-500">*</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          placeholder="010-0000-0000"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          이메일 <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="example@email.com"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

      {result?.success === false && (
        <p className="text-sm text-red-500">{result.error}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? "제출 중..." : "신청하기"}
      </button>
    </form>
  );
}
