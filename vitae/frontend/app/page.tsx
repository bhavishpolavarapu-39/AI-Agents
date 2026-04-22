'use client';
export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800 bg-slate-900/50 p-6">
        <h1 className="text-3xl font-bold">VITAE</h1>
        <p className="text-slate-400">Personal Health Operating System</p>
      </header>

      <div className="grid grid-cols-12 gap-4 p-6">
        {/* Health Score Ring */}
        <div className="col-span-3 bg-slate-800 rounded-lg border border-slate-700 p-6">
          <div className="text-center">
            <div className="text-5xl font-bold text-green-400 mb-2">78</div>
            <p className="text-slate-400">Health Score</p>
          </div>
        </div>

        {/* Vital Stats */}
        <div className="col-span-3 bg-slate-800 rounded-lg border border-slate-700 p-4">
          <h3 className="font-semibold mb-3">Current Vitals</h3>
          <div className="text-sm text-slate-400 space-y-2">
            <p>HR: 68 bpm</p>
            <p>BP: 118/76</p>
            <p>O2: 98%</p>
          </div>
        </div>

        {/* Recommendations */}
        <div className="col-span-6 bg-slate-800 rounded-lg border border-slate-700 p-4">
          <h3 className="font-semibold mb-3">Recommendations</h3>
          <div className="text-sm text-slate-400 space-y-2">
            <div className="bg-slate-700 p-2 rounded">💊 Take medication</div>
            <div className="bg-slate-700 p-2 rounded">🏃 30 min light exercise</div>
            <div className="bg-slate-700 p-2 rounded">💧 Increase water intake</div>
          </div>
        </div>

        {/* 24h Timeline */}
        <div className="col-span-12 bg-slate-800 rounded-lg border border-slate-700 p-4">
          <h3 className="font-semibold mb-3">24-Hour Timeline</h3>
          <div className="h-32 bg-slate-700/50 rounded flex items-center justify-center text-slate-500">
            Activity & Health Events Timeline
          </div>
        </div>
      </div>
    </div>
  );
}
