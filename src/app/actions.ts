"use server";

import { db } from "@/db";
import { leads } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

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
    const msg = e instanceof Error ? e.message : "";
    if (msg.includes("UNIQUE")) {
      return { success: false, error: "이미 등록된 이메일입니다." };
    }
    return { success: false, error: "저장 중 오류가 발생했습니다. 다시 시도해주세요." };
  }
}

export async function updateLead(
  id: number,
  data: { name: string; phone: string; email: string }
): Promise<ActionResult> {
  try {
    await db.update(leads).set(data).where(eq(leads.id, id));
    revalidatePath("/admin");
    return { success: true };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "";
    if (msg.includes("UNIQUE")) {
      return { success: false, error: "이미 등록된 이메일입니다." };
    }
    return { success: false, error: "수정 중 오류가 발생했습니다." };
  }
}

export async function deleteLead(id: number): Promise<ActionResult> {
  try {
    await db.delete(leads).where(eq(leads.id, id));
    revalidatePath("/admin");
    return { success: true };
  } catch {
    return { success: false, error: "삭제 중 오류가 발생했습니다." };
  }
}
