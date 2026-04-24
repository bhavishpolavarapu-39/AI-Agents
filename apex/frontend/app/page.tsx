'use client';

import { Suspense, useState } from 'react';
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
    description: 'Optimizes portfolio allocation using Modern Portfolio Theory and Sharpe ratio calculations to maximize risk-adjusted returns.',
    capabilities: ['Asset Allocation', 'Rebalancing', 'Optimization', 'Risk-Return Analysis'],
    icon: '⚖️',
  },
  {
    id: 'risk_analyzer',
    name: 'Risk Analyzer',
    description: 'Calculates Value at Risk (VaR), portfolio Greeks, Beta, and stress tests against market scenarios.',
    capabilities: ['VaR Calculation', 'Stress Testing', 'Greeks Analysis', 'Volatility Metrics'],
    icon: '📊',
  },
  {
    id: 'tax_optimizer',
    name: 'Tax Optimizer',
    description: 'Identifies tax loss harvesting opportunities and optimizes tax liability by jurisdiction.',
    capabilities: ['Tax Loss Harvesting', 'Tax Liability', 'Wash-Sale Rules', 'Tax Planning'],
    icon: '💰',
  },
  {
    id: 'market_watcher',
    name: 'Market Watcher',
    description: 'Monitors global markets for opportunities, inverse correlations, and real-time alerts on holdings.',
    capabilities: ['Market Alerts', 'Trending Detection', 'Inverse Correlations', 'Opportunity Finder'],
    icon: '👁️',
  },
  {
    id: 'ai_analyst',
    name: 'AI Analyst',
    description: 'Multi-agent system combining technical, fundamental, sentiment, and risk analysis for comprehensive investment thesis.',
    capabilities: ['Technical Analysis', 'Fundamental Analysis', 'Sentiment Analysis', 'Risk Assessment'],
    icon: '🤖',
  },
  {
    id: 'ai_advisor',
    name: 'AI Advisor',
    description: 'Conversational AI assistant providing real-time market insights, portfolio recommendations, and strategic guidance.',
    capabilities: ['Chat Interface', 'Real-time Insights', 'Recommendations', 'Strategic Guidance'],
    icon: '💬',
  },
];

function LoadingPlaceholder() {
  return (
    <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 rounded-2xl border border-indigo-900/20 p-6 h-40 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto"></div>
        <p className="text-slate-400 mt-3 text-sm">Loading...</p>
      </div>
    </div>
  );
}

function TabButton({
  label,
  isActive,
  onClick
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
          ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-indigo-500/50'
          : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700'
      }`}
    >
      {label}
    </button>
  );
}

function AgentCard({ agent }: { agent: Agent }) {
  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-indigo-900/30 p-5 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20">
      <div className="flex items-start gap-3 mb-3">
        <div className="text-3xl">{agent.icon}</div>
        <div className="flex-1">
          <h3 className="font-bold text-indigo-300 text-lg">{agent.name}</h3>
        </div>
      </div>
      <p className="text-slate-300 text-sm mb-4">{agent.description}</p>
      <div className="flex flex-wrap gap-2">
        {agent.capabilities.map((cap) => (
          <span
            key={cap}
            className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs border border-indigo-500/30"
          >
            {cap}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'market' | 'news' | 'search' | 'agents'>('portfolio');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>

      <header className="border-b border-indigo-900/30 bg-gradient-to-b from-slate-900/80 to-slate-900/40 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                APEX Intelligence
              </h1>
              <p className="text-sm text-slate-400 mt-1">World-Class Portfolio Intelligence Operating System</p>
            </div>
            <div className="flex gap-4 items-center">
              <div className="text-right">
                <div className="text-sm font-semibold text-indigo-400">System Status</div>
                <div className="text-xs text-slate-500">AI Agents Active</div>
              </div>
              <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse shadow-lg shadow-indigo-500/50"></div>
            </div>
          </div>
        </div>
      </header>

      <div className="border-b border-indigo-900/20 bg-slate-900/30 backdrop-blur-sm sticky top-[88px] z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <TabButton
              label="📊 Portfolio Overview"
              isActive={activeTab === 'portfolio'}
              onClick={() => setActiveTab('portfolio')}
            />
            <TabButton
              label="🌍 Market Analysis"
              isActive={activeTab === 'market'}
              onClick={() => setActiveTab('market')}
            />
            <TabButton
              label="📰 News & Sentiment"
              isActive={activeTab === 'news'}
              onClick={() => setActiveTab('news')}
            />
            <TabButton
              label="🔍 Stock Discovery"
              isActive={activeTab === 'search'}
              onClick={() => setActiveTab('search')}
            />
            <TabButton
              label="🤖 Agents & Tools"
              isActive={activeTab === 'agents'}
              onClick={() => setActiveTab('agents')}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'portfolio' && (
          <div className="space-y-6 fade-in">
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-8">
                <Suspense fallback={<LoadingPlaceholder />}>
                  <PortfolioSummary />
                </Suspense>
              </div>

              <div className="col-span-12 lg:col-span-4">
                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-indigo-900/30 p-6 backdrop-blur">
                  <h2 className="text-lg font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent mb-4">
                    Quick Stats
                  </h2>
                  <div className="space-y-4">
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-indigo-900/20">
                      <div className="text-xs text-slate-400 mb-1">Total Holdings</div>
                      <div className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">12</div>
                    </div>
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-indigo-900/20">
                      <div className="text-xs text-slate-400 mb-1">Year-to-Date Return</div>
                      <div className="text-3xl font-bold text-green-400">+18.5%</div>
                    </div>
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-indigo-900/20">
                      <div className="text-xs text-slate-400 mb-1">Diversification</div>
                      <div className="text-lg font-bold text-indigo-400">High</div>
                      <div className="text-xs text-slate-500 mt-1">Well diversified across sectors</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'market' && (
          <div className="space-y-6 fade-in">
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

        {activeTab === 'news' && (
          <div className="fade-in">
            <Suspense fallback={<LoadingPlaceholder />}>
              <NewsSection />
            </Suspense>
          </div>
        )}

        {activeTab === 'search' && (
          <div className="space-y-6 fade-in">
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

        {activeTab === 'agents' && (
          <div className="space-y-8 fade-in">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mb-2">
                AI Agents & Tools
              </h2>
              <p className="text-slate-400">
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
                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-indigo-900/30 p-6 backdrop-blur">
                  <h3 className="text-lg font-bold text-indigo-300 mb-4">💬 Chat with AI Advisor</h3>
                  <Suspense fallback={<LoadingPlaceholder />}>
                    <ChatAgent />
                  </Suspense>
                </div>
              </div>

              <div className="col-span-12 lg:col-span-4">
                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-indigo-900/30 p-6 backdrop-blur h-full">
                  <h3 className="text-lg font-bold text-indigo-300 mb-4">⚙️ Execute Agents</h3>
                  <Suspense fallback={<LoadingPlaceholder />}>
                    <PluginManager />
                  </Suspense>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="border-t border-indigo-900/20 bg-slate-900/30 backdrop-blur-sm mt-12 py-6">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-500 text-sm">
          <p>APEX Intelligence Platform © 2024 • Powered by Advanced AI Agents</p>
        </div>
      </footer>
    </div>
  );
}
