'use client';
export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800 bg-slate-900/50 p-6">
        <h1 className="text-3xl font-bold">TERRA</h1>
        <p className="text-slate-400">Climate Intelligence Operating System</p>
      </header>

      <div className="grid grid-cols-12 gap-4 p-6">
        <div className="col-span-4 bg-slate-800 rounded-lg border border-slate-700 p-4">
          <h3 className="font-semibold mb-3">Total Emissions</h3>
          <p className="text-3xl font-bold text-orange-400">45K</p>
          <p className="text-sm text-slate-400">mtCO2e</p>
        </div>
        <div className="col-span-4 bg-slate-800 rounded-lg border border-slate-700 p-4">
          <h3 className="font-semibold mb-3">YoY Reduction</h3>
          <p className="text-3xl font-bold text-green-400">-8%</p>
          <p className="text-sm text-slate-400">Trend: Improving</p>
        </div>
        <div className="col-span-4 bg-slate-800 rounded-lg border border-slate-700 p-4">
          <h3 className="font-semibold mb-3">Net-Zero Target</h3>
          <p className="text-3xl font-bold text-blue-400">2050</p>
          <p className="text-sm text-slate-400">On track</p>
        </div>
      </div>
    </div>
  );
}
