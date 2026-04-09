"use client";

import { useState, useTransition } from "react";
import { deleteLead } from "@/app/actions";
import EditModal from "./EditModal";

type Lead = {
  id: number;
  name: string;
  phone: string;
  email: string;
  createdAt: Date;
};

export default function LeadsTable({ leads }: { leads: Lead[] }) {
  const [editTarget, setEditTarget] = useState<Lead | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete(lead: Lead) {
    if (!confirm(`"${lead.name}"을(를) 삭제하시겠습니까?`)) return;
    startTransition(async () => {
      await deleteLead(lead.id);
    });
  }

  if (leads.length === 0) {
    return (
      <p className="text-center text-gray-400 py-20">수집된 리드가 없습니다.</p>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">이름</th>
              <th className="px-4 py-3 font-medium">전화번호</th>
              <th className="px-4 py-3 font-medium">이메일</th>
              <th className="px-4 py-3 font-medium">신청일</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {leads.map((lead) => (
              <tr key={lead.id} className="bg-white hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900">{lead.name}</td>
                <td className="px-4 py-3 text-gray-600">{lead.phone}</td>
                <td className="px-4 py-3 text-gray-600">{lead.email}</td>
                <td className="px-4 py-3 text-gray-400">
                  {new Date(lead.createdAt).toLocaleDateString("ko-KR")}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setEditTarget(lead)}
                      className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(lead)}
                      disabled={isPending}
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editTarget && (
        <EditModal lead={editTarget} onClose={() => setEditTarget(null)} />
      )}
    </>
  );
}
