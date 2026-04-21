"use client";

import { useState, useTransition } from "react";
import { deleteLead } from "@/app/actions";
import NotesModal from "./NotesModal";

type Note = {
  id: number;
  content: string;
  createdAt: Date;
};

type Lead = {
  id: number;
  name: string;
  phone: string;
  email: string;
  createdAt: Date;
  notes: Note[];
};

export default function LeadsTable({ leads }: { leads: Lead[] }) {
  const [notesTarget, setNotesTarget] = useState<Lead | null>(null);
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
              <th className="px-4 py-3 font-medium">접수일시</th>
              <th className="px-4 py-3 font-medium">메모</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {leads.map((lead) => (
              <tr
                key={lead.id}
                className="bg-white hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 font-medium text-gray-900">
                  {lead.name}
                </td>
                <td className="px-4 py-3 text-gray-600">{lead.phone}</td>
                <td className="px-4 py-3 text-gray-600">{lead.email}</td>
                <td className="px-4 py-3 text-gray-400">
                  {new Date(lead.createdAt).toLocaleDateString("ko-KR")}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setNotesTarget(lead)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                      />
                    </svg>
                    {lead.notes.length > 0 ? (
                      <span>
                        메모{" "}
                        <span className="text-blue-600 font-semibold">
                          {lead.notes.length}
                        </span>
                      </span>
                    ) : (
                      "메모"
                    )}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleDelete(lead)}
                    disabled={isPending}
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {notesTarget && (
        <NotesModal
          lead={notesTarget}
          notes={notesTarget.notes}
          onClose={() => setNotesTarget(null)}
        />
      )}
    </>
  );
}
