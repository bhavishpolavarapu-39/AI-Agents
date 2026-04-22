'use client';
export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800 bg-slate-900/50 p-6">
        <h1 className="text-3xl font-bold">LEXIS</h1>
        <p className="text-slate-400">Legal Intelligence Operating System</p>
      </header>

      <div className="grid grid-cols-12 gap-4 p-6">
        {/* Risk Matrix */}
        <div className="col-span-6 bg-slate-800 rounded-lg border border-slate-700 p-4">
          <h2 className="text-lg font-semibold mb-4">Risk Assessment</h2>
          <div className="space-y-2 text-sm">
            <div className="bg-red-900/30 border border-red-700 p-2 rounded">Critical: Liability Exposure</div>
            <div className="bg-orange-900/30 border border-orange-700 p-2 rounded">High: Compliance Risk</div>
            <div className="bg-yellow-900/30 border border-yellow-700 p-2 rounded">Medium: Term Ambiguity</div>
          </div>
        </div>

        {/* Precedents */}
        <div className="col-span-6 bg-slate-800 rounded-lg border border-slate-700 p-4">
          <h2 className="text-lg font-semibold mb-4">Applicable Precedents</h2>
          <div className="space-y-2 text-sm text-slate-400">
            <div className="bg-slate-700 p-2 rounded font-mono">Smith v. Jones (2020)</div>
            <div className="bg-slate-700 p-2 rounded font-mono">Legal Corp v. State (2019)</div>
          </div>
        </div>

        {/* Legal Draft */}
        <div className="col-span-12 bg-slate-800 rounded-lg border border-slate-700 p-4">
          <h2 className="text-lg font-semibold mb-4">Draft Response</h2>
          <button className="bg-blue-600 px-4 py-2 rounded text-sm hover:bg-blue-700">
            Generate Legal Draft
          </button>
        </div>
      </div>
    </div>
  );
}
