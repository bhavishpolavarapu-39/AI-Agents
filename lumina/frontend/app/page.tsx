'use client';
import { useState } from 'react';

export default function Home() {
  const [research, setResearch] = useState(null);

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800 bg-slate-900/50 p-6">
        <h1 className="text-3xl font-bold">LUMINA</h1>
        <p className="text-slate-400">Scientific Research Operating System</p>
      </header>

      <div className="grid grid-cols-12 gap-4 p-6">
        {/* Knowledge Graph */}
        <div className="col-span-8 bg-slate-800 rounded-lg border border-slate-700 p-4">
          <h2 className="text-lg font-semibold mb-4">Knowledge Graph</h2>
          <div className="bg-slate-700/50 h-96 rounded flex items-center justify-center text-slate-500">
            Hypothesis & Literature Network Visualization
          </div>
        </div>

        {/* Hypothesis Panel */}
        <div className="col-span-4 bg-slate-800 rounded-lg border border-slate-700 p-4">
          <h2 className="text-lg font-semibold mb-4">Hypotheses</h2>
          <div className="space-y-2 text-sm text-slate-400">
            <div className="bg-slate-700 p-2 rounded">H1: Primary hypothesis</div>
            <div className="bg-slate-700 p-2 rounded">H2: Alternative hypothesis</div>
          </div>
        </div>

        {/* Experiment Design */}
        <div className="col-span-6 bg-slate-800 rounded-lg border border-slate-700 p-4">
          <h2 className="text-lg font-semibold mb-4">Experiment Design</h2>
          <div className="text-slate-400 text-sm space-y-2">
            <p>Sample Size: 156</p>
            <p>Power: 85%</p>
            <p>Timeline: 26 weeks</p>
          </div>
        </div>

        {/* Publication Draft */}
        <div className="col-span-6 bg-slate-800 rounded-lg border border-slate-700 p-4">
          <h2 className="text-lg font-semibold mb-4">Publication</h2>
          <button className="bg-blue-600 px-4 py-2 rounded text-sm hover:bg-blue-700">
            Generate Draft
          </button>
        </div>
      </div>
    </div>
  );
}
