'use client';
export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800 bg-slate-900/50 p-6">
        <h1 className="text-3xl font-bold">HALO</h1>
        <p className="text-slate-400">Home Intelligence Operating System</p>
      </header>

      <div className="grid grid-cols-12 gap-4 p-6">
        <div className="col-span-3 bg-slate-800 rounded-lg border border-slate-700 p-4 text-center">
          <p className="text-sm text-slate-400 mb-2">Temperature</p>
          <p className="text-3xl font-bold text-orange-400">72°F</p>
        </div>
        <div className="col-span-3 bg-slate-800 rounded-lg border border-slate-700 p-4 text-center">
          <p className="text-sm text-slate-400 mb-2">Humidity</p>
          <p className="text-3xl font-bold text-blue-400">45%</p>
        </div>
        <div className="col-span-3 bg-slate-800 rounded-lg border border-slate-700 p-4 text-center">
          <p className="text-sm text-slate-400 mb-2">Energy Usage</p>
          <p className="text-3xl font-bold text-yellow-400">2.4kW</p>
        </div>
        <div className="col-span-3 bg-slate-800 rounded-lg border border-slate-700 p-4 text-center">
          <p className="text-sm text-slate-400 mb-2">Security</p>
          <p className="text-3xl font-bold text-green-400">✓</p>
        </div>
      </div>
    </div>
  );
}
