'use client';
export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800 bg-slate-900/50 p-6">
        <h1 className="text-3xl font-bold">COMPASS</h1>
        <p className="text-slate-400">Experience Intelligence Operating System</p>
      </header>

      <div className="grid grid-cols-12 gap-4 p-6">
        <div className="col-span-3 bg-slate-800 rounded-lg border border-slate-700 p-4 text-center">
          <p className="text-sm text-slate-400 mb-2">CSAT</p>
          <p className="text-3xl font-bold text-green-400">78</p>
        </div>
        <div className="col-span-3 bg-slate-800 rounded-lg border border-slate-700 p-4 text-center">
          <p className="text-sm text-slate-400 mb-2">NPS</p>
          <p className="text-3xl font-bold text-blue-400">42</p>
        </div>
        <div className="col-span-3 bg-slate-800 rounded-lg border border-slate-700 p-4 text-center">
          <p className="text-sm text-slate-400 mb-2">Effort Score</p>
          <p className="text-3xl font-bold text-yellow-400">2.3</p>
        </div>
        <div className="col-span-3 bg-slate-800 rounded-lg border border-slate-700 p-4 text-center">
          <p className="text-sm text-slate-400 mb-2">Pain Points</p>
          <p className="text-3xl font-bold text-orange-400">5</p>
        </div>
      </div>
    </div>
  );
}
