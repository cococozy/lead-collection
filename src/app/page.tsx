import LeadForm from "./_components/LeadForm";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">문의 신청</h1>
          <p className="mt-2 text-sm text-gray-500">
            정보를 입력하시면 담당자가 연락드립니다.
          </p>
        </div>
        <LeadForm />
      </div>
    </main>
  );
}
