import BaseMap from './map/components/BaseMap';

export default function Home() {
  return (
    <main className="min-h-screen grid place-items-center p-10">
      <h1 className="text-3xl font-bold">World Map of Cantonese Programs</h1>
      <div className="w-[90vw] h-[80vh]">
      <BaseMap />
      </div>
      <h2 className="text-2xl font-bold">Table Placeholder</h2>
    </main>
  );
}
