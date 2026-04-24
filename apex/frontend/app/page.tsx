'use client';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-green-900/50 bg-slate-900/50 sticky top-0 z-10">
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
      <div className="grid grid-cols-12 gap-4 p-6">
        {/* Portfolio Holdings */}
        <div className="col-span-12 lg:col-span-8">
          <div className="bg-slate-900 rounded-lg border border-green-900/50 p-6">
            <h2 className="text-lg font-bold text-green-300 mb-4">Portfolio Holdings</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-800/50 rounded p-3">
                <div className="text-xs text-slate-400 mb-1">Total Value</div>
                <div className="text-2xl font-bold text-green-400">$47,926</div>
              </div>
              <div className="bg-slate-800/50 rounded p-3">
                <div className="text-xs text-slate-400 mb-1">Total Gain/Loss</div>
                <div className="text-2xl font-bold text-green-400">+$9,500</div>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { symbol: 'AAPL', name: 'Apple Inc', shares: 100, price: 185.50, value: 18550, gain: 19.3 },
                { symbol: 'MSFT', name: 'Microsoft Corp', shares: 50, price: 380.75, value: 19037, gain: 23.1 },
                { symbol: 'GOOGL', name: 'Alphabet Inc', shares: 30, price: 140.20, value: 4206, gain: 19.0 },
                { symbol: 'TSLA', name: 'Tesla Inc', shares: 25, price: 245.30, value: 6132, gain: 24.2 },
              ].map((holding) => (
                <div key={holding.symbol} className="border-l-2 border-green-500 bg-green-500/10 rounded px-3 py-2">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-semibold text-sm">{holding.name}</div>
                      <div className="text-xs text-slate-400">{holding.symbol}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-green-400">+{holding.gain.toFixed(1)}%</div>
                      <div className="text-xs text-slate-400">${holding.price.toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 mb-2">
                    <div>Shares: {holding.shares}</div>
                    <div>Value: ${holding.value.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Portfolio Stats */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-slate-800 rounded-lg border border-green-900/50 p-6">
            <h2 className="text-lg font-bold text-green-300 mb-4">Portfolio Summary</h2>
            <div className="space-y-3">
              <div className="bg-slate-900/50 p-3 rounded">
                <div className="text-xs text-slate-400">Holdings</div>
                <div className="text-2xl font-bold text-green-400">4</div>
              </div>
              <div className="bg-slate-900/50 p-3 rounded">
                <div className="text-xs text-slate-400">YTD Return</div>
                <div className="text-2xl font-bold text-green-400">+8.3%</div>
              </div>
              <div className="bg-slate-900/50 p-3 rounded">
                <div className="text-xs text-slate-400">Sharpe Ratio</div>
                <div className="text-2xl font-bold text-purple-400">0.95</div>
              </div>
              <div className="bg-slate-900/50 p-3 rounded">
                <div className="text-xs text-slate-400">Max Drawdown</div>
                <div className="text-2xl font-bold text-red-400">-8.2%</div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Chat Agent */}
        <div className="col-span-12 lg:col-span-8">
          <div className="bg-slate-900 rounded-lg border border-green-900/50 p-6 h-96 flex flex-col">
            <h2 className="text-lg font-bold text-green-300 mb-4">APEX AI Agent</h2>
            <div className="flex-1 overflow-y-auto mb-4 bg-slate-950 rounded p-4 text-slate-400 text-sm">
              Backend not connected. Deploy backend to Railway and set NEXT_PUBLIC_API_URL environment variable.
            </div>
            <form className="flex gap-2">
              <input
                type="text"
                placeholder="Ask APEX AI..."
                className="flex-1 bg-slate-800 border border-green-900/50 rounded px-3 py-2 text-slate-100"
                disabled
              />
              <button className="bg-slate-700 text-slate-400 px-4 py-2 rounded cursor-not-allowed">
                Send
              </button>
            </form>
          </div>
        </div>

        {/* Smart Plugins */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-slate-900 rounded-lg border border-green-900/50 p-6">
            <h2 className="text-lg font-bold text-green-300 mb-4">Smart Plugins</h2>
            <div className="space-y-3">
              {[
                { name: 'Portfolio Rebalancer', desc: 'Optimize allocation' },
                { name: 'Risk Analyzer', desc: 'Analyze risk metrics' },
                { name: 'Tax Optimizer', desc: 'Tax loss harvesting' },
                { name: 'Market Watcher', desc: 'Market alerts' },
              ].map((plugin) => (
                <div key={plugin.name} className="p-3 rounded border border-green-500/50 bg-green-500/10 cursor-not-allowed">
                  <div className="font-semibold text-sm text-green-400">{plugin.name}</div>
                  <div className="text-xs text-slate-400">{plugin.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
