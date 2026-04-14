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

  if (!name || !phone || !email) {
    return { success: false, error: "모든 항목을 입력해주세요." };
  }

  try {
    await db.insert(leads).values({ name, phone, email });
    return { success: true };
  } catch (e: unknown) {
    console.error("[submitLead error]", e);
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("UNIQUE")) {
      return { success: false, error: "이미 등록된 이메일입니다." };
    }
    return { success: false, error: `오류: ${msg}` };
  }
}
