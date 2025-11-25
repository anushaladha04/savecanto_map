import CantoTable from './table/components/table';

export default function Home() {
  return (
    <main className="min-h-screen p-4">
      <div className="w-full max-w-full mx-auto space-y-4">
        <h1 className="text-3xl font-bold text-center">SaveCanto Map ✅</h1>
        <CantoTable />
        <p className="mt-2 text-sm text-gray-500 text-center">
          Next.js + Tailwind is live
        </p>
      </div>
    </main>
  );
}
