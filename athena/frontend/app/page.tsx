'use client';
export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800 bg-slate-900/50 p-6">
        <h1 className="text-3xl font-bold">ATHENA</h1>
        <p className="text-slate-400">Adaptive Learning Operating System</p>
      </header>

      <div className="grid grid-cols-12 gap-4 p-6">
        <div className="col-span-3 bg-slate-800 rounded-lg border border-slate-700 p-4">
          <h3 className="font-semibold mb-3">Progress</h3>
          <div className="text-3xl font-bold text-purple-400">68%</div>
          <div className="w-full bg-slate-700 h-2 rounded-full mt-2 overflow-hidden">
            <div className="bg-purple-500 h-full" style={{width: '68%'}}></div>
          </div>
        </div>
        <div className="col-span-3 bg-slate-800 rounded-lg border border-slate-700 p-4">
          <h3 className="font-semibold mb-3">Mastery</h3>
          <div className="text-3xl font-bold text-green-400">82%</div>
          <p className="text-sm text-slate-400">Current topic</p>
        </div>
        <div className="col-span-6 bg-slate-800 rounded-lg border border-slate-700 p-4">
          <h3 className="font-semibold mb-3">Recommended Next</h3>
          <p className="text-slate-400 text-sm">Chapter 5: Advanced Concepts</p>
        </div>
      </div>
    </div>
  );
}
