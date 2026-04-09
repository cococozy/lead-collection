"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
    >
      로그아웃
    </button>
  );
}
