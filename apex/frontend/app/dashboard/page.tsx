'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PortfolioSummary from '@/components/PortfolioSummary';
import ChatAgent from '@/components/ChatAgent';
import PluginManager from '@/components/PluginManager';
import StockSearch from '@/components/search/StockSearch';
import MarketFilterBar from '@/components/search/MarketFilterBar';
import NewsSection from '@/components/news/NewsSection';
import CorrelationMatrix from '@/components/analysis/CorrelationMatrix';
import MarketImpactAnalyzer from '@/components/analysis/MarketImpactAnalyzer';
import GlobalMarketDashboard from '@/components/analysis/GlobalMarketDashboard';

interface Agent {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  icon: string;
}

const AGENTS: Agent[] = [
  {
    id: 'portfolio_rebalancer',
    name: 'Portfolio Rebalancer',
    description: 'Optimizes portfolio allocation using Modern Portfolio Theory and Sharpe ratio calculations.',
    capabilities: ['Asset Allocation', 'Rebalancing', 'Optimization', 'Risk-Return Analysis'],
    icon: '⚖️',
  },
  {
    id: 'risk_analyzer',
    name: 'Risk Analyzer',
    description: 'Calculates Value at Risk (VaR), portfolio Greeks, Beta, and stress tests.',
    capabilities: ['VaR Calculation', 'Stress Testing', 'Greeks Analysis', 'Volatility Metrics'],
    icon: '📊',
  },
  {
    id: 'tax_optimizer',
    name: 'Tax Optimizer',
    description: 'Identifies tax loss harvesting opportunities and optimizes tax liability.',
    capabilities: ['Tax Loss Harvesting', 'Tax Liability', 'Wash-Sale Rules', 'Tax Planning'],
    icon: '💰',
  },
  {
    id: 'market_watcher',
    name: 'Market Watcher',
    description: 'Monitors global markets for opportunities, inverse correlations, and real-time alerts.',
    capabilities: ['Market Alerts', 'Trending Detection', 'Inverse Correlations', 'Opportunity Finder'],
    icon: '👁️',
  },
  {
    id: 'ai_analyst',
    name: 'AI Analyst',
    description: 'Multi-agent system combining technical, fundamental, sentiment, and risk analysis.',
    capabilities: ['Technical Analysis', 'Fundamental Analysis', 'Sentiment Analysis', 'Risk Assessment'],
    icon: '🤖',
  },
  {
    id: 'ai_advisor',
    name: 'AI Advisor',
    description: 'Conversational AI assistant providing real-time market insights and recommendations.',
    capabilities: ['Chat Interface', 'Real-time Insights', 'Recommendations', 'Strategic Guidance'],
    icon: '💬',
  },
];

function LoadingPlaceholder() {
  return (
    <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 rounded-2xl border border-white/10 p-6 h-40 flex items-center justify-center backdrop-blur">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
        <p className="text-gray-300 mt-3 text-sm">Loading...</p>
      </div>
    </div>
  );
}

function TabButton({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 whitespace-nowrap ${
        isActive
          ? 'bg-white text-black shadow-lg'
          : 'bg-slate-800/50 text-white hover:bg-slate-700/50 border border-white/20'
      }`}
    >
      {label}
    </button>
  );
}

function AgentCard({ agent }: { agent: Agent }) {
  return (
    <div className="liquid-glass border border-white/20 rounded-xl p-5 hover:border-white/40 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-start gap-3 mb-3">
        <div className="text-3xl">{agent.icon}</div>
        <div className="flex-1">
          <h3 className="font-bold text-white text-lg">{agent.name}</h3>
        </div>
      </div>
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
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'portfolio' | 'market' | 'news' | 'search' | 'agents'>('portfolio');

  useEffect(() => {
    const tab = searchParams.get('tab') as typeof activeTab;
    if (tab && ['portfolio', 'market', 'news', 'search', 'agents'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="liquid-glass fixed top-0 left-0 right-0 z-50 border-b border-white/10 px-6 md:px-12 lg:px-16 py-4 flex items-center justify-between">
        <button
          onClick={() => router.push('/')}
          className="text-2xl font-semibold tracking-tight text-white hover:opacity-80 transition-opacity"
        >
          APEX
        </button>

        <div className="hidden md:flex gap-8">
          {[
            { label: 'Portfolio', tab: 'portfolio' },
            { label: 'Markets', tab: 'market' },
            { label: 'News', tab: 'news' },
            { label: 'Discovery', tab: 'search' },
            { label: 'Agents', tab: 'agents' },
          ].map((item) => (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab as typeof activeTab)}
              className={`text-sm transition-colors duration-200 ${
                activeTab === item.tab ? 'text-white font-medium' : 'text-gray-300 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => router.push('/')}
          className="bg-white text-black px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
        >
          Home
        </button>
      </nav>

      {/* Tab Navigation */}
      <div className="liquid-glass border-b border-white/10 sticky top-16 z-40 px-6 md:px-12 lg:px-16 py-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <TabButton
            label="📊 Portfolio"
            isActive={activeTab === 'portfolio'}
            onClick={() => setActiveTab('portfolio')}
          />
          <TabButton
            label="🌍 Markets"
            isActive={activeTab === 'market'}
            onClick={() => setActiveTab('market')}
          />
          <TabButton
            label="📰 News"
            isActive={activeTab === 'news'}
            onClick={() => setActiveTab('news')}
          />
          <TabButton
            label="🔍 Discovery"
            isActive={activeTab === 'search'}
            onClick={() => setActiveTab('search')}
          />
          <TabButton
            label="🤖 Agents"
            isActive={activeTab === 'agents'}
            onClick={() => setActiveTab('agents')}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-8">
        {/* Portfolio Tab */}
        {activeTab === 'portfolio' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-8">
                <Suspense fallback={<LoadingPlaceholder />}>
                  <PortfolioSummary />
                </Suspense>
              </div>

              <div className="col-span-12 lg:col-span-4">
                <div className="liquid-glass border border-white/20 rounded-xl p-6 backdrop-blur h-full">
                  <h2 className="text-lg font-bold text-white mb-4">Quick Stats</h2>
                  <div className="space-y-4">
                    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                      <div className="text-xs text-gray-400 mb-1">Total Holdings</div>
                      <div className="text-3xl font-bold text-white">12</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                      <div className="text-xs text-gray-400 mb-1">YTD Return</div>
                      <div className="text-3xl font-bold text-green-400">+18.5%</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                      <div className="text-xs text-gray-400 mb-1">Diversification</div>
                      <div className="text-lg font-bold text-white">High</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Market Tab */}
        {activeTab === 'market' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12">
                <Suspense fallback={<LoadingPlaceholder />}>
                  <GlobalMarketDashboard />
                </Suspense>
              </div>
            </div>

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
            <Suspense fallback={<LoadingPlaceholder />}>
              <NewsSection />
            </Suspense>
          </div>
        )}

        {/* Discovery Tab */}
        {activeTab === 'search' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-12 gap-6">
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
          </div>
        )}

        {/* Agents Tab */}
        {activeTab === 'agents' && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">AI Agents & Tools</h2>
              <p className="text-gray-400">
                APEX uses a multi-agent AI system to provide comprehensive portfolio analysis. Each agent specializes in different aspects of investment intelligence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {AGENTS.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>

            <div className="grid grid-cols-12 gap-6 mt-8">
              <div className="col-span-12 lg:col-span-8">
                <div className="liquid-glass border border-white/20 rounded-xl p-6 backdrop-blur">
                  <h3 className="text-lg font-bold text-white mb-4">💬 Chat with AI Advisor</h3>
                  <Suspense fallback={<LoadingPlaceholder />}>
                    <ChatAgent />
                  </Suspense>
                </div>
              </div>

              <div className="col-span-12 lg:col-span-4">
                <div className="liquid-glass border border-white/20 rounded-xl p-6 backdrop-blur h-full">
                  <h3 className="text-lg font-bold text-white mb-4">⚙️ Execute Agents</h3>
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
  );
}
