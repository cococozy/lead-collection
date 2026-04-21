"use client";

import { useRef, useEffect, useState, useTransition } from "react";
import { addNote, deleteNote, type AddNoteResult } from "@/app/actions";

type Note = {
  id: number;
  content: string;
  createdAt: Date;
};

type Lead = {
  id: number;
  name: string;
};

export default function NotesModal({
  lead,
  notes: initialNotes,
  onClose,
}: {
  lead: Lead;
  notes: Note[];
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const result: AddNoteResult = await addNote(lead.id, content);
      if (result.success) {
        setNotes((prev) => [result.note, ...prev]);
        setContent("");
      } else {
        setError(result.error);
      }
    });
  }

  function handleDelete(noteId: number) {
    startTransition(async () => {
      const result = await deleteNote(noteId);
      if (result.success) {
        setNotes((prev) => prev.filter((n) => n.id !== noteId));
      }
    });
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="rounded-2xl p-0 shadow-xl backdrop:bg-black/40 w-full max-w-lg"
    >
      <div className="flex flex-col max-h-[80vh]">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">메모</h2>
            <p className="text-sm text-gray-500 mt-0.5">{lead.name}</p>
          </div>
          <button
            onClick={() => dialogRef.current?.close()}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 min-h-0">
          {notes.length === 0 ? (
            <p className="text-center text-gray-400 py-8 text-sm">메모가 없습니다.</p>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="group flex gap-3 rounded-xl bg-gray-50 px-4 py-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 whitespace-pre-wrap break-words">
                    {note.content}
                  </p>
                  <p className="text-xs text-gray-400 mt-1.5">
                    {new Date(note.createdAt).toLocaleString("ko-KR")}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(note.id)}
                  disabled={isPending}
                  className="opacity-0 group-hover:opacity-100 flex-shrink-0 text-gray-300 hover:text-red-400 transition-all disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        <div className="px-6 pb-6 pt-4 border-t border-gray-100">
          <form onSubmit={handleAdd} className="flex gap-2">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  if (content.trim()) handleAdd(e as unknown as React.FormEvent);
                }
              }}
              placeholder="메모를 입력하세요... (Ctrl+Enter로 저장)"
              rows={2}
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm resize-none focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <button
              type="submit"
              disabled={isPending || !content.trim()}
              className="self-end rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
            >
              {isPending ? "저장 중..." : "추가"}
            </button>
          </form>
          {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
        </div>
      </div>
    </dialog>
  );
}
