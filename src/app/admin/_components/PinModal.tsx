"use client";

import { useRef, useEffect, useState } from "react";

export default function PinModal({
  title,
  onConfirm,
  onClose,
  isPending,
  error,
}: {
  title: string;
  onConfirm: (pin: string) => void;
  onClose: () => void;
  isPending: boolean;
  error?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [pin, setPin] = useState("");

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onConfirm(pin);
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="rounded-2xl p-0 shadow-xl backdrop:bg-black/40 w-full max-w-sm"
    >
      <div className="p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1">관리자 인증</h2>
        <p className="text-sm text-gray-500 mb-5">{title}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="인증번호 입력"
            autoFocus
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-center tracking-widest focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isPending || !pin}
              className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 transition-colors"
            >
              {isPending ? "확인 중..." : "확인"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
