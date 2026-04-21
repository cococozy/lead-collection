"use server";

import { db } from "@/db";
import { leadNotes, leads } from "@/db/schema";
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
    const cause = e instanceof Error ? e.cause : undefined;
    const pgCode =
      (e as { code?: string }).code ??
      (cause as { code?: string } | undefined)?.code;
    const msg = e instanceof Error ? e.message : String(e);
    if (pgCode === "23505" || msg.includes("UNIQUE")) {
      return { success: false, error: "이미 등록된 이메일입니다." };
    }
    return { success: false, error: "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요." };
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

export type AddNoteResult =
  | { success: true; note: { id: number; content: string; createdAt: Date } }
  | { success: false; error: string };

export async function addNote(
  leadId: number,
  content: string
): Promise<AddNoteResult> {
  if (!content.trim()) {
    return { success: false, error: "메모 내용을 입력해주세요." };
  }
  try {
    const [created] = await db
      .insert(leadNotes)
      .values({ leadId, content: content.trim() })
      .returning();
    revalidatePath("/admin");
    return { success: true, note: created };
  } catch {
    return { success: false, error: "메모 저장 중 오류가 발생했습니다." };
  }
}

export async function deleteNote(id: number): Promise<ActionResult> {
  try {
    await db.delete(leadNotes).where(eq(leadNotes.id, id));
    revalidatePath("/admin");
    return { success: true };
  } catch {
    return { success: false, error: "메모 삭제 중 오류가 발생했습니다." };
  }
}
