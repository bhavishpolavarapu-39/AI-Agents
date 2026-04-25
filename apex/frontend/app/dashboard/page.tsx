'use client';

import { Suspense, useState } from 'react';
import { useRouter } from 'next/navigation';
import PortfolioSummary from '@/components/PortfolioSummary';
import ChatAgent from '@/components/ChatAgent';
import PluginManager from '@/components/PluginManager';
import StockSearch from '@/components/search/StockSearch';
import MarketFilterBar from '@/components/search/MarketFilterBar';
import NewsSection from '@/components/news/NewsSection';
import CorrelationMatrix from '@/components/analysis/CorrelationMatrix';
import MarketImpactAnalyzer from '@/components/analysis/MarketImpactAnalyzer';
import GlobalMarketDashboard from '@/components/analysis/GlobalMarketDashboard';
import StockPriceChart from '@/components/charts/StockPriceChart';
import PortfolioAllocationChart from '@/components/charts/PortfolioAllocationChart';
import MarketHeatmap from '@/components/charts/MarketHeatmap';
import TechnicalIndicators from '@/components/charts/TechnicalIndicators';
import Watchlist from '@/components/features/Watchlist';
import StockScreener from '@/components/features/StockScreener';
import StockDetail from '@/components/features/StockDetail';
import RealtimeTicker from '@/components/features/RealtimeTicker';
import NewsSentimentChart from '@/components/features/NewsSentimentChart';
import RiskDashboard from '@/components/features/RiskDashboard';
import PerformanceReports from '@/components/features/PerformanceReports';
import AlertsSystem from '@/components/features/AlertsSystem';
import BacktestingEngine from '@/components/features/BacktestingEngine';

interface Agent {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
}

const AGENTS: Agent[] = [
  {
    id: 'portfolio_rebalancer',
    name: 'Portfolio Rebalancer',
    description: 'Optimizes portfolio allocation using Modern Portfolio Theory and Sharpe ratio calculations.',
    capabilities: ['Asset Allocation', 'Rebalancing', 'Optimization', 'Risk-Return Analysis'],
  },
  {
    id: 'risk_analyzer',
    name: 'Risk Analyzer',
    description: 'Calculates Value at Risk (VaR), portfolio Greeks, Beta, and stress tests.',
    capabilities: ['VaR Calculation', 'Stress Testing', 'Greeks Analysis', 'Volatility Metrics'],
  },
  {
    id: 'tax_optimizer',
    name: 'Tax Optimizer',
    description: 'Identifies tax loss harvesting opportunities and optimizes tax liability.',
    capabilities: ['Tax Loss Harvesting', 'Tax Liability', 'Wash-Sale Rules', 'Tax Planning'],
  },
  {
    id: 'market_watcher',
    name: 'Market Watcher',
    description: 'Monitors global markets for opportunities, inverse correlations, and real-time alerts.',
    capabilities: ['Market Alerts', 'Trending Detection', 'Inverse Correlations', 'Opportunity Finder'],
  },
  {
    id: 'ai_analyst',
    name: 'AI Analyst',
    description: 'Multi-agent system combining technical, fundamental, sentiment, and risk analysis.',
    capabilities: ['Technical Analysis', 'Fundamental Analysis', 'Sentiment Analysis', 'Risk Assessment'],
  },
  {
    id: 'ai_advisor',
    name: 'AI Advisor',
    description: 'Conversational AI assistant providing real-time market insights and recommendations.',
    capabilities: ['Chat Interface', 'Real-time Insights', 'Recommendations', 'Strategic Guidance'],
  },
];

function LoadingPlaceholder() {
  return (
    <div className="liquid-glass border border-white/20 rounded-2xl p-6 h-40 flex items-center justify-center backdrop-blur">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
        <p className="text-gray-300 mt-3 text-sm">Loading...</p>
      </div>
    </div>
  );
}

interface TabConfig {
  id: 'portfolio' | 'market' | 'news' | 'search' | 'agents' | 'watchlist' | 'screener' | 'detail' | 'ticker' | 'sentiment' | 'risk' | 'reports' | 'alerts' | 'backtest';
  label: string;
}

const TABS: TabConfig[] = [
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'market', label: 'Markets' },
  { id: 'news', label: 'News' },
  { id: 'search', label: 'Discovery' },
  { id: 'watchlist', label: 'Watchlist' },
  { id: 'screener', label: 'Stock Screener' },
  { id: 'ticker', label: 'Live Ticker' },
  { id: 'sentiment', label: 'Sentiment' },
  { id: 'risk', label: 'Risk' },
  { id: 'reports', label: 'Reports' },
  { id: 'alerts', label: 'Alerts' },
  { id: 'backtest', label: 'Backtest' },
  { id: 'agents', label: 'Agents' },
];

function AgentCard({ agent }: { agent: Agent }) {
  return (
    <div className="liquid-glass border border-white/20 rounded-xl p-6 hover:border-white/40 transition-all duration-300 backdrop-blur">
      <h3 className="font-bold text-white text-lg mb-2">{agent.name}</h3>
      <p className="text-gray-300 text-sm mb-4">{agent.description}</p>
      <div className="flex flex-wrap gap-2">
        {agent.capabilities.map((cap) => (
          <span
            key={cap}
            className="px-3 py-1 rounded-full bg-white/10 text-white text-xs border border-white/20"
          >
            {cap}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'portfolio' | 'market' | 'news' | 'search' | 'agents' | 'watchlist' | 'screener' | 'detail' | 'ticker' | 'sentiment' | 'risk' | 'reports' | 'alerts' | 'backtest'>('portfolio');

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black text-white relative overflow-hidden">
      {/* Animated gradient background elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content wrapper */}
      <div className="relative z-10">
      {/* Unified Header with Navigation */}
      <nav className="liquid-glass fixed top-0 left-0 right-0 z-40 border-b border-white/10 backdrop-blur-md">
        <div className="px-6 md:px-12 lg:px-16 py-6">
          {/* Top Row: Logo and Home Button */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-white">APEX</h1>
            <button
              onClick={() => router.push('/')}
              className="bg-white text-black px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Home
            </button>
          </div>

          {/* Bottom Row: Tab Navigation */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-white text-black shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-32 px-6 md:px-12 lg:px-16 pb-12 max-w-7xl mx-auto w-full">
        {/* Portfolio Tab */}
        {activeTab === 'portfolio' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12">
                <Suspense fallback={<LoadingPlaceholder />}>
                  <PortfolioAllocationChart />
                </Suspense>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-8">
                <Suspense fallback={<LoadingPlaceholder />}>
                  <StockPriceChart symbol="AAPL" />
                </Suspense>
              </div>

              <div className="col-span-12 lg:col-span-4">
                <Suspense fallback={<LoadingPlaceholder />}>
                  <TechnicalIndicators symbol="AAPL" />
                </Suspense>
              </div>
            </div>
          </div>
        )}

        {/* Markets Tab */}
        {activeTab === 'market' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Market Heatmap */}
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12">
                <Suspense fallback={<LoadingPlaceholder />}>
                  <MarketHeatmap />
                </Suspense>
              </div>
            </div>

            {/* Market Selector */}
            <div className="liquid-glass border border-white/20 rounded-xl p-6 backdrop-blur">
              <h2 className="text-lg font-bold text-white mb-4">Select Market</h2>
              <Suspense fallback={<LoadingPlaceholder />}>
                <MarketFilterBar />
              </Suspense>
            </div>

            {/* Global Market Dashboard */}
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12">
                <Suspense fallback={<LoadingPlaceholder />}>
                  <GlobalMarketDashboard />
                </Suspense>
              </div>
            </div>

            {/* Correlation Analysis */}
            <div className="grid grid-cols-12 gap-6">
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
          </div>
        )}

        {/* News Tab */}
        {activeTab === 'news' && (
          <div className="animate-fadeIn">
            <div className="liquid-glass border border-white/20 rounded-xl p-6 backdrop-blur">
              <h2 className="text-lg font-bold text-white mb-6">Market News & Sentiment Analysis</h2>
              <Suspense fallback={<LoadingPlaceholder />}>
                <NewsSection />
              </Suspense>
            </div>
          </div>
        )}

        {/* Stock Discovery Tab */}
        {activeTab === 'search' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-8">
                <Suspense fallback={<LoadingPlaceholder />}>
                  <StockPriceChart symbol="MSFT" />
                </Suspense>
              </div>
              <div className="col-span-12 lg:col-span-4">
                <div className="liquid-glass border border-white/20 rounded-xl p-6 backdrop-blur h-full">
                  <h2 className="text-lg font-bold text-white mb-4">Market Filter</h2>
                  <Suspense fallback={<LoadingPlaceholder />}>
                    <MarketFilterBar />
                  </Suspense>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12">
                <div className="liquid-glass border border-white/20 rounded-xl p-6 backdrop-blur">
                  <h2 className="text-lg font-bold text-white mb-4">Stock & Crypto Search</h2>
                  <Suspense fallback={<LoadingPlaceholder />}>
                    <StockSearch />
                  </Suspense>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Watchlist Tab */}
        {activeTab === 'watchlist' && (
          <div className="animate-fadeIn">
            <Suspense fallback={<LoadingPlaceholder />}>
              <Watchlist />
            </Suspense>
          </div>
        )}

        {/* Stock Screener Tab */}
        {activeTab === 'screener' && (
          <div className="animate-fadeIn">
            <Suspense fallback={<LoadingPlaceholder />}>
              <StockScreener />
            </Suspense>
          </div>
        )}

        {/* Stock Detail Tab */}
        {activeTab === 'detail' && (
          <div className="animate-fadeIn">
            <Suspense fallback={<LoadingPlaceholder />}>
              <StockDetail symbol="AAPL" />
            </Suspense>
          </div>
        )}

        {/* Live Ticker Tab */}
        {activeTab === 'ticker' && (
          <div className="animate-fadeIn">
            <Suspense fallback={<LoadingPlaceholder />}>
              <RealtimeTicker />
            </Suspense>
          </div>
        )}

        {/* Sentiment Analysis Tab */}
        {activeTab === 'sentiment' && (
          <div className="animate-fadeIn">
            <Suspense fallback={<LoadingPlaceholder />}>
              <NewsSentimentChart />
            </Suspense>
          </div>
        )}

        {/* Risk Dashboard Tab */}
        {activeTab === 'risk' && (
          <div className="animate-fadeIn">
            <Suspense fallback={<LoadingPlaceholder />}>
              <RiskDashboard />
            </Suspense>
          </div>
        )}

        {/* Performance Reports Tab */}
        {activeTab === 'reports' && (
          <div className="animate-fadeIn">
            <Suspense fallback={<LoadingPlaceholder />}>
              <PerformanceReports />
            </Suspense>
          </div>
        )}

        {/* Alerts System Tab */}
        {activeTab === 'alerts' && (
          <div className="animate-fadeIn">
            <Suspense fallback={<LoadingPlaceholder />}>
              <AlertsSystem />
            </Suspense>
          </div>
        )}

        {/* Backtesting Engine Tab */}
        {activeTab === 'backtest' && (
          <div className="animate-fadeIn">
            <Suspense fallback={<LoadingPlaceholder />}>
              <BacktestingEngine />
            </Suspense>
          </div>
        )}

        {/* Agents Tab */}
        {activeTab === 'agents' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Agents Overview */}
            <div className="liquid-glass border border-white/20 rounded-xl p-8 backdrop-blur">
              <h2 className="text-3xl font-bold text-white mb-3">AI Agents & Tools</h2>
              <p className="text-gray-400">
                APEX uses a multi-agent AI system to provide comprehensive portfolio analysis. Each agent specializes in different aspects of investment intelligence.
              </p>
            </div>

            {/* Agent Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {AGENTS.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>

            {/* Chat and Plugin Manager */}
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-8">
                <div className="liquid-glass border border-white/20 rounded-xl p-6 backdrop-blur">
                  <h3 className="text-lg font-bold text-white mb-4">Chat with AI Advisor</h3>
                  <Suspense fallback={<LoadingPlaceholder />}>
                    <ChatAgent />
                  </Suspense>
                </div>
              </div>

              <div className="col-span-12 lg:col-span-4">
                <div className="liquid-glass border border-white/20 rounded-xl p-6 backdrop-blur h-full">
                  <h3 className="text-lg font-bold text-white mb-4">Execute Agents</h3>
                  <Suspense fallback={<LoadingPlaceholder />}>
                    <PluginManager />
                  </Suspense>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
