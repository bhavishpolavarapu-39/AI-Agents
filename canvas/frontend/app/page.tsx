'use client';
export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800 bg-slate-900/50 p-6">
        <h1 className="text-3xl font-bold">CANVAS</h1>
        <p className="text-slate-400">Marketing Intelligence Operating System</p>
      </header>

      <div className="grid grid-cols-12 gap-4 p-6">
        <div className="col-span-3 bg-slate-800 rounded-lg border border-slate-700 p-4 text-center">
          <p className="text-sm text-slate-400 mb-2">Reach</p>
          <p className="text-3xl font-bold text-pink-400">125K</p>
        </div>
        <div className="col-span-3 bg-slate-800 rounded-lg border border-slate-700 p-4 text-center">
          <p className="text-sm text-slate-400 mb-2">CTR</p>
          <p className="text-3xl font-bold text-purple-400">2.8%</p>
        </div>
        <div className="col-span-3 bg-slate-800 rounded-lg border border-slate-700 p-4 text-center">
          <p className="text-sm text-slate-400 mb-2">Conversions</p>
          <p className="text-3xl font-bold text-green-400">350</p>
        </div>
        <div className="col-span-3 bg-slate-800 rounded-lg border border-slate-700 p-4 text-center">
          <p className="text-sm text-slate-400 mb-2">ROAS</p>
          <p className="text-3xl font-bold text-yellow-400">4.2x</p>
        </div>
      </div>
    </div>
  );
}
