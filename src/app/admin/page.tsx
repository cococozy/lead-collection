import { db } from "@/db";
import { leadNotes, leads } from "@/db/schema";
import { desc } from "drizzle-orm";
import LeadsTable from "./_components/LeadsTable";
import SignOutButton from "./_components/SignOutButton";

export default async function AdminPage() {
  const allLeads = await db.select().from(leads).orderBy(desc(leads.createdAt));
  const allNotes = await db.select().from(leadNotes).orderBy(desc(leadNotes.createdAt));

  const leadsWithNotes = allLeads.map((lead) => ({
    ...lead,
    notes: allNotes.filter((n) => n.leadId === lead.id),
  }));

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">리드 관리</h1>
            <p className="text-sm text-gray-500 mt-1">총 {allLeads.length}명</p>
          </div>
          <SignOutButton />
        </div>
        <LeadsTable leads={leadsWithNotes} />
      </div>
    </main>
  );
}
