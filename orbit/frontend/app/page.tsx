'use client';
export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800 bg-slate-900/50 p-6">
        <h1 className="text-3xl font-bold">ORBIT</h1>
        <p className="text-slate-400">Project Intelligence Operating System</p>
      </header>

      <div className="grid grid-cols-12 gap-4 p-6">
        <div className="col-span-6 bg-slate-800 rounded-lg border border-slate-700 p-4">
          <h3 className="font-semibold mb-3">Project Timeline</h3>
          <div className="space-y-2">
            <div><span className="text-sm">Planning</span><div className="w-full bg-slate-700 h-2 rounded"><div className="bg-blue-500 h-full" style={{width: '100%'}}></div></div></div>
            <div><span className="text-sm">Development</span><div className="w-full bg-slate-700 h-2 rounded"><div className="bg-blue-500 h-full" style={{width: '45%'}}></div></div></div>
          </div>
        </div>
        <div className="col-span-6 bg-slate-800 rounded-lg border border-slate-700 p-4">
          <h3 className="font-semibold mb-3">Critical Path</h3>
          <p className="text-sm text-slate-400">23 days remaining</p>
          <p className="text-sm text-orange-400 mt-2">⚠️ Backend development at risk</p>
        </div>
      </div>
    </div>
  );
}
