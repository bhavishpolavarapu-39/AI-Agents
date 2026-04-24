'use client';

import { Suspense } from 'react';
import PortfolioSummary from '@/components/PortfolioSummary';
import ChatAgent from '@/components/ChatAgent';
import PluginManager from '@/components/PluginManager';
import StockSearch from '@/components/search/StockSearch';
import MarketFilterBar from '@/components/search/MarketFilterBar';
import NewsSection from '@/components/news/NewsSection';
import CorrelationMatrix from '@/components/analysis/CorrelationMatrix';
import MarketImpactAnalyzer from '@/components/analysis/MarketImpactAnalyzer';
import GlobalMarketDashboard from '@/components/analysis/GlobalMarketDashboard';

function LoadingPlaceholder() {
  return (
    <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 rounded-2xl border border-green-900/20 p-6 h-40 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin mx-auto"></div>
        <p className="text-slate-400 mt-3 text-sm">Loading...</p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-green-900/50 bg-slate-900/50 backdrop-blur sticky top-0 z-10">
        <div className="max-w-full px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">APEX</h1>
              <p className="text-sm text-slate-400">World-Class Portfolio Intelligence Operating System</p>
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

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-8">
            <Suspense fallback={<LoadingPlaceholder />}>
              <PortfolioSummary />
            </Suspense>
          </div>
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 rounded-lg border border-green-900/20 p-6 backdrop-blur">
              <h2 className="text-lg font-bold text-green-300 mb-4">Portfolio Summary</h2>
              <div className="space-y-3">
                <div className="bg-slate-900/50 p-3 rounded"><div className="text-xs text-slate-400">Holdings</div><div className="text-2xl font-bold text-green-400">12</div></div>
                <div className="bg-slate-900/50 p-3 rounded"><div className="text-xs text-slate-400">Year Return</div><div className="text-2xl font-bold text-green-400">18.5%</div></div>
                <div className="bg-slate-900/50 p-3 rounded"><div className="text-xs text-slate-400">Diversified</div><div className="text-2xl font-bold text-blue-400">High</div></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12">
            <Suspense fallback={<LoadingPlaceholder />}>
              <GlobalMarketDashboard />
            </Suspense>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-6">
            <Suspense fallback={<LoadingPlaceholder />}>
              <CorrelationMatrix />
            </Suspense>
          </div>
          <div className="col-span-12 lg:col-span-6">
            <Suspense fallback={<LoadingPlaceholder />}>
              <MarketImpactAnalyzer />
            </Suspense>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-8">
            <Suspense fallback={<LoadingPlaceholder />}>
              <StockSearch />
            </Suspense>
          </div>
          <div className="col-span-12 lg:col-span-4">
            <Suspense fallback={<LoadingPlaceholder />}>
              <MarketFilterBar />
            </Suspense>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12">
            <Suspense fallback={<LoadingPlaceholder />}>
              <NewsSection />
            </Suspense>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-8">
            <Suspense fallback={<LoadingPlaceholder />}>
              <ChatAgent />
            </Suspense>
          </div>
          <div className="col-span-12 lg:col-span-4">
            <Suspense fallback={<LoadingPlaceholder />}>
              <PluginManager />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
