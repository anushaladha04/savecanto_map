import CantoTable from '../components/table';

export default function Home() {
  return (
    <>
      <main className="min-h-screen grid place-items-center p-10">
        <h1 className="text-3xl font-bold">SaveCanto Map ✅</h1>
        <CantoTable />
        <p className="mt-2 text-sm text-gray-500">Next.js + Tailwind is live</p>
      </main>
    </>
  );
}