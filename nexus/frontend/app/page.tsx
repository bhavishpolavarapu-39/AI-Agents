'use client';
export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800 bg-slate-900/50 p-6">
        <h1 className="text-3xl font-bold">NEXUS</h1>
        <p className="text-slate-400">Supply Chain Operating System</p>
      </header>

      <div className="grid grid-cols-12 gap-4 p-6">
        <div className="col-span-4 bg-slate-800 rounded-lg border border-slate-700 p-4">
          <h3 className="font-semibold mb-3">Demand Forecast</h3>
          <div className="text-3xl font-bold text-blue-400">+12.5%</div>
          <p className="text-sm text-slate-400">Next month prediction</p>
        </div>
        <div className="col-span-4 bg-slate-800 rounded-lg border border-slate-700 p-4">
          <h3 className="font-semibold mb-3">Inventory Level</h3>
          <div className="text-3xl font-bold text-green-400">42 days</div>
          <p className="text-sm text-slate-400">Days of stock</p>
        </div>
        <div className="col-span-4 bg-slate-800 rounded-lg border border-slate-700 p-4">
          <h3 className="font-semibold mb-3">Supplier Risk</h3>
          <div className="text-3xl font-bold text-orange-400">4.2/10</div>
          <p className="text-sm text-slate-400">Risk score</p>
        </div>
      </div>
    </div>
  );
}
