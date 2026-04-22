'use client';
export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800 bg-slate-900/50 p-6">
        <h1 className="text-3xl font-bold">APEX</h1>
        <p className="text-slate-400">Portfolio Intelligence Operating System</p>
      </header>

      <div className="grid grid-cols-12 gap-4 p-6">
        <div className="col-span-3 bg-slate-800 rounded-lg border border-slate-700 p-4 text-center">
          <p className="text-sm text-slate-400 mb-2">Total Value</p>
          <p className="text-3xl font-bold text-blue-400">$525K</p>
        </div>
        <div className="col-span-3 bg-slate-800 rounded-lg border border-slate-700 p-4 text-center">
          <p className="text-sm text-slate-400 mb-2">YTD Return</p>
          <p className="text-3xl font-bold text-green-400">+8.3%</p>
        </div>
        <div className="col-span-3 bg-slate-800 rounded-lg border border-slate-700 p-4 text-center">
          <p className="text-sm text-slate-400 mb-2">Sharpe Ratio</p>
          <p className="text-3xl font-bold text-purple-400">0.95</p>
        </div>
        <div className="col-span-3 bg-slate-800 rounded-lg border border-slate-700 p-4 text-center">
          <p className="text-sm text-slate-400 mb-2">Max Drawdown</p>
          <p className="text-3xl font-bold text-red-400">-8.2%</p>
        </div>
      </div>
    </div>
  );
}
