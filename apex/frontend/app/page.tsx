'use client';

import { useState, useEffect } from 'react';
import PortfolioSummary from '@/components/PortfolioSummary';
import ChatAgent from '@/components/ChatAgent';
import PluginManager from '@/components/PluginManager';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-green-900/50 bg-slate-900/50 backdrop-blur sticky top-0 z-10">
        <div className="max-w-full px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-green-300">APEX</h1>
              <p className="text-sm text-slate-400">Portfolio Intelligence Operating System</p>
            </div>
            <div className="flex gap-4 items-center">
              <div className="text-right">
                <div className="text-sm font-semibold text-green-400">AI Agent</div>
                <div className="text-xs text-slate-500">Active</div>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-4 p-6 auto-rows-max">
        {/* Portfolio Summary */}
        <div className="col-span-12 lg:col-span-8">
          <PortfolioSummary />
        </div>

        {/* Portfolio Stats */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-slate-800 rounded-lg border border-green-900/50 p-6">
            <h2 className="text-lg font-bold text-green-300 mb-4">Portfolio Summary</h2>
            <div className="space-y-3">
              <div className="bg-slate-900/50 p-3 rounded">
                <div className="text-xs text-slate-400">Holdings</div>
                <div className="text-2xl font-bold text-green-400">12</div>
              </div>
              <div className="bg-slate-900/50 p-3 rounded">
                <div className="text-xs text-slate-400">Year Return</div>
                <div className="text-2xl font-bold text-green-400">18.5%</div>
              </div>
              <div className="bg-slate-900/50 p-3 rounded">
                <div className="text-xs text-slate-400">Diversified</div>
                <div className="text-2xl font-bold text-blue-400">High</div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Chat Agent */}
        <div className="col-span-12 lg:col-span-8">
          <ChatAgent />
        </div>

        {/* Plugin Manager */}
        <div className="col-span-12 lg:col-span-4">
          <PluginManager />
        </div>
      </div>
    </div>
  );
}
