"use server";

import { db } from "@/db";
import { leads } from "@/db/schema";

export type ActionResult =
  | { success: true }
  | { success: false; error: string };

export async function submitLead(
  formData: FormData
): Promise<ActionResult> {
  const name = (formData.get("name") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();

  console.log("[actions] submitLead 호출됨", { name, phone, email });

  if (!name || !phone || !email) {
    console.log("[actions] 유효성 검사 실패: 필수 항목 누락");
    return { success: false, error: "모든 항목을 입력해주세요." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.log("[actions] 유효성 검사 실패: 이메일 형식 오류", email);
    return { success: false, error: "올바른 이메일 형식이 아닙니다." };
  }

  console.log("[actions] 유효성 검사 통과, DB 저장 시작");

  try {
    await db.insert(leads).values({ name, phone, email });
    console.log("[actions] DB 저장 완료");
    return { success: true };
  } catch (e: unknown) {
    console.error("[actions] DB 저장 실패", e);
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("UNIQUE") || (e as { code?: string }).code === "23505") {
      return { success: false, error: "이미 등록된 이메일입니다." };
    }
    return { success: false, error: "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요." };
  }
}
