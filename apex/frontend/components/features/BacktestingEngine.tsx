'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface BacktestResult {
  metric: string;
  value: string | number;
  unit: string;
  comparison: string;
}

const generateBacktestEquity = () => {
  const data = [];
  let equity = 100000;
  for (let i = 0; i < 252; i++) {
    equity = equity * (1 + (Math.random() - 0.48) * 0.01);
    data.push({
      day: i,
      equity: Math.round(equity),
      benchmark: Math.round(100000 * Math.pow(1.12, i / 252)),
    });
  }
  return data;
};

const generateMonthlyReturns = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map((month) => ({
    month,
    strategy: (Math.random() - 0.4) * 10,
    benchmark: (Math.random() - 0.45) * 8,
  }));
};

export default function BacktestingEngine() {
  const [strategy, setStrategy] = useState('momentum');
  const [startDate, setStartDate] = useState('2023-01-01');
  const [endDate, setEndDate] = useState('2024-01-01');
  const [initialCapital, setInitialCapital] = useState('100000');
  const [backtestRun, setBacktestRun] = useState(false);
  const [equityData] = useState(generateBacktestEquity());
  const [monthlyReturns] = useState(generateMonthlyReturns());

  const handleBacktest = () => {
    setBacktestRun(true);
  };

  const results: BacktestResult[] = [
    { metric: 'Total Return', value: '27.4%', unit: '', comparison: 'vs 12.3% benchmark' },
    { metric: 'CAGR', value: '27.4%', unit: '', comparison: '+15.1% outperformance' },
    { metric: 'Max Drawdown', value: '-12.5%', unit: '', comparison: 'vs -18.2% benchmark' },
    { metric: 'Sharpe Ratio', value: 1.85, unit: '', comparison: 'vs 1.2 benchmark' },
    { metric: 'Win Rate', value: '68%', unit: '', comparison: '85 wins / 42 losses' },
    { metric: 'Profit Factor', value: 2.14, unit: '', comparison: 'Avg win / Avg loss' },
    { metric: 'Trades', value: 127, unit: '', comparison: '68% win rate' },
    { metric: 'Best Month', value: '+8.5%', unit: '', comparison: 'November 2023' },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-white/20 rounded-lg p-2 backdrop-blur">
          <p className="text-white font-semibold text-sm">Day {payload[0].payload.day}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-xs">
              {entry.name}: ${entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="liquid-glass border border-white/20 rounded-xl p-6 backdrop-blur">
        <h3 className="text-2xl font-bold text-white mb-2">Backtesting Engine</h3>
        <p className="text-gray-400">Test trading strategies on historical market data</p>
      </div>

      {/* Configuration Panel */}
      <motion.div
        className="liquid-glass border border-white/20 rounded-xl p-6 backdrop-blur"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h4 className="text-lg font-semibold text-white mb-6">Backtest Configuration</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Strategy Selection */}
          <div>
            <label className="text-xs text-gray-400 block mb-2 font-semibold">Trading Strategy</label>
            <select
              value={strategy}
              onChange={(e) => setStrategy(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40"
            >
              <option value="momentum">Momentum Trading</option>
              <option value="meanreversion">Mean Reversion</option>
              <option value="sma_crossover">SMA Crossover</option>
              <option value="rsi_based">RSI Based</option>
              <option value="macd">MACD Strategy</option>
              <option value="bollinger">Bollinger Bands</option>
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="text-xs text-gray-400 block mb-2 font-semibold">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="text-xs text-gray-400 block mb-2 font-semibold">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40"
            />
          </div>

          {/* Initial Capital */}
          <div>
            <label className="text-xs text-gray-400 block mb-2 font-semibold">Initial Capital</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-white">$</span>
              <input
                type="number"
                value={initialCapital}
                onChange={(e) => setInitialCapital(e.target.value)}
                className="w-full pl-7 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40"
              />
            </div>
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-white/5 border border-white/10 rounded-lg">
          <div>
            <label className="text-xs text-gray-400 block mb-2">Commission (%)</label>
            <input
              type="number"
              defaultValue="0.1"
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:border-white/40"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-2">Position Size (%)</label>
            <input
              type="number"
              defaultValue="100"
              max="100"
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:border-white/40"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-2">Max Drawdown (%)</label>
            <input
              type="number"
              defaultValue="20"
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:border-white/40"
            />
          </div>
        </div>

        {/* Run Button */}
        <button
          onClick={handleBacktest}
          className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold transition"
        >
          Run Backtest
        </button>
      </motion.div>

      {/* Results Section - Only show if backtest has been run */}
      {backtestRun && (
        <>
          {/* Results Summary */}
          <motion.div
            className="liquid-glass border border-green-500/30 rounded-xl p-6 backdrop-blur bg-green-500/5"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h4 className="text-lg font-semibold text-green-400 mb-4">✓ Backtest Complete</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {results.slice(0, 4).map((result, index) => (
                <motion.div
                  key={result.metric}
                  className="p-3 bg-white/5 border border-white/10 rounded-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <p className="text-xs text-gray-400 mb-1">{result.metric}</p>
                  <p className="text-xl font-bold text-white">{result.value}{result.unit}</p>
                  <p className="text-xs text-green-400 mt-1">{result.comparison}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Equity Curve */}
          <motion.div
            className="liquid-glass border border-white/20 rounded-xl p-6 backdrop-blur"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h4 className="text-lg font-semibold text-white mb-4">Strategy Equity Curve</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={equityData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} />
                  <YAxis stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="equity" stroke="#3b82f6" strokeWidth={2} name="Strategy" dot={false} />
                  <Line type="monotone" dataKey="benchmark" stroke="#10b981" strokeWidth={2} name="Benchmark" dot={false} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Monthly Returns */}
          <motion.div
            className="liquid-glass border border-white/20 rounded-xl p-6 backdrop-blur"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h4 className="text-lg font-semibold text-white mb-4">Monthly Returns</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyReturns} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} />
                  <YAxis stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="strategy" fill="#3b82f6" name="Strategy" />
                  <Bar dataKey="benchmark" fill="#10b981" name="Benchmark" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Detailed Metrics */}
          <motion.div
            className="liquid-glass border border-white/20 rounded-xl p-6 backdrop-blur"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h4 className="text-lg font-semibold text-white mb-4">Detailed Metrics</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {results.map((result, index) => (
                <motion.div
                  key={result.metric}
                  className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <p className="text-xs text-gray-400 mb-2">{result.metric}</p>
                  <p className="text-xl font-bold text-white mb-1">{result.value}{result.unit}</p>
                  <p className="text-xs text-blue-400">{result.comparison}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Trade List */}
          <motion.div
            className="liquid-glass border border-white/20 rounded-xl p-6 backdrop-blur"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h4 className="text-lg font-semibold text-white mb-4">Recent Trades</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-4 py-3 text-left text-gray-400 font-semibold">#</th>
                    <th className="px-4 py-3 text-left text-gray-400 font-semibold">Symbol</th>
                    <th className="px-4 py-3 text-right text-gray-400 font-semibold">Entry</th>
                    <th className="px-4 py-3 text-right text-gray-400 font-semibold">Exit</th>
                    <th className="px-4 py-3 text-right text-gray-400 font-semibold">Profit</th>
                    <th className="px-4 py-3 text-right text-gray-400 font-semibold">%</th>
                    <th className="px-4 py-3 text-right text-gray-400 font-semibold">Days</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 1, symbol: 'AAPL', entry: '$150.25', exit: '$165.80', profit: '$1,555', pct: '+10.4%', days: 12 },
                    { id: 2, symbol: 'MSFT', entry: '$310.50', exit: '$305.25', profit: '-$526', pct: '-1.7%', days: 5 },
                    { id: 3, symbol: 'GOOGL', entry: '$120.00', exit: '$132.15', profit: '$1,215', pct: '+10.1%', days: 18 },
                    { id: 4, symbol: 'NVDA', entry: '$425.00', exit: '$468.50', profit: '$4,350', pct: '+10.1%', days: 9 },
                    { id: 5, symbol: 'TSLA', entry: '$200.00', exit: '$185.50', profit: '-$1,450', pct: '-7.3%', days: 7 },
                  ].map((trade) => (
                    <tr key={trade.id} className="border-b border-white/5 hover:bg-white/5 transition">
                      <td className="px-4 py-3 text-white">{trade.id}</td>
                      <td className="px-4 py-3 font-semibold text-white">{trade.symbol}</td>
                      <td className="px-4 py-3 text-right text-gray-300">{trade.entry}</td>
                      <td className="px-4 py-3 text-right text-gray-300">{trade.exit}</td>
                      <td className={`px-4 py-3 text-right font-semibold ${
                        trade.profit.startsWith('-') ? 'text-red-400' : 'text-green-400'
                      }`}>
                        {trade.profit}
                      </td>
                      <td className={`px-4 py-3 text-right font-semibold ${
                        trade.pct.startsWith('-') ? 'text-red-400' : 'text-green-400'
                      }`}>
                        {trade.pct}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-300">{trade.days}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Export Options */}
          <motion.div
            className="liquid-glass border border-white/20 rounded-xl p-6 backdrop-blur"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h4 className="text-lg font-semibold text-white mb-4">Export Results</h4>
            <div className="flex gap-3 flex-wrap">
              <button className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition">
                Export as PDF
              </button>
              <button className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition">
                Export as CSV
              </button>
              <button className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition">
                Share Report
              </button>
            </div>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
