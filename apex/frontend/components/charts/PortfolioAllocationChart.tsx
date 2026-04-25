'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

interface Position {
  symbol: string;
  name: string;
  value: number;
  allocation: number;
  gain: number;
  gainPercent: number;
}

const MOCK_POSITIONS: Position[] = [
  { symbol: 'AAPL', name: 'Apple Inc', value: 45000, allocation: 22.5, gain: 5400, gainPercent: 13.5 },
  { symbol: 'MSFT', name: 'Microsoft', value: 38000, allocation: 19, gain: 3040, gainPercent: 8.7 },
  { symbol: 'GOOGL', name: 'Alphabet', value: 32000, allocation: 16, gain: -960, gainPercent: -2.9 },
  { symbol: 'NVDA', name: 'NVIDIA', value: 28000, allocation: 14, gain: 4620, gainPercent: 19.8 },
  { symbol: 'TSLA', name: 'Tesla', value: 21000, allocation: 10.5, gain: -1470, gainPercent: -6.5 },
  { symbol: 'META', name: 'Meta', value: 18000, allocation: 9, gain: 900, gainPercent: 5.3 },
  { symbol: 'AMZN', name: 'Amazon', value: 18000, allocation: 9, gain: 2700, gainPercent: 17.6 },
];

const COLORS = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
];

export default function PortfolioAllocationChart() {
  const totalValue = MOCK_POSITIONS.reduce((sum, p) => sum + p.value, 0);
  const totalGain = MOCK_POSITIONS.reduce((sum, p) => sum + p.gain, 0);
  const totalGainPercent = (totalGain / (totalValue - totalGain)) * 100;

  const chartData = MOCK_POSITIONS.map(p => ({
    name: p.symbol,
    value: p.allocation,
    fullName: p.name,
    holdings: p.value,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const position = MOCK_POSITIONS.find(p => p.symbol === data.name);
      return (
        <div className="bg-slate-900/95 border border-white/20 rounded-lg p-3 backdrop-blur">
          <p className="text-white font-semibold">{data.fullName} ({data.name})</p>
          <p className="text-xs text-gray-400">Allocation: {data.value.toFixed(1)}%</p>
          <p className="text-xs text-gray-400">Value: ${data.holdings.toLocaleString()}</p>
          {position && (
            <>
              <p className={`text-xs mt-1 ${position.gainPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                Gain/Loss: {position.gainPercent >= 0 ? '+' : ''}{position.gainPercent.toFixed(2)}%
              </p>
              <p className="text-xs text-gray-500">
                ${position.gain >= 0 ? '+' : ''}${position.gain.toLocaleString()}
              </p>
            </>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      className="liquid-glass border border-white/20 rounded-xl p-6 backdrop-blur"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">Portfolio Allocation</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-400">Total Value</p>
            <p className="text-2xl font-bold text-white">${totalValue.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Total Gain/Loss</p>
            <p className={`text-2xl font-bold ${totalGain >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totalGain >= 0 ? '+' : ''}${totalGain.toLocaleString()} ({totalGainPercent >= 0 ? '+' : ''}{totalGainPercent.toFixed(2)}%)
            </p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} ${value.toFixed(1)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {COLORS.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Position Details */}
        <div className="space-y-3 overflow-y-auto max-h-80">
          {MOCK_POSITIONS.map((position, index) => (
            <motion.div
              key={position.symbol}
              className="p-3 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 transition"
              whileHover={{ x: 4 }}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                    <span className="font-bold text-white">{position.symbol}</span>
                    <span className="text-xs text-gray-400">{position.name}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">{position.allocation.toFixed(1)}%</p>
                  <p className="text-xs text-gray-400">${position.value.toLocaleString()}</p>
                </div>
              </div>

              {/* Allocation Bar */}
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden mb-2">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                  style={{ width: `${position.allocation}%` }}
                ></div>
              </div>

              {/* Gain/Loss */}
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Gain/Loss:</span>
                <span className={position.gainPercent >= 0 ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'}>
                  {position.gainPercent >= 0 ? '+' : ''}{position.gainPercent.toFixed(2)}% (${position.gain >= 0 ? '+' : ''}${position.gain.toLocaleString()})
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
        <div>
          <p className="text-xs text-gray-400">Positions</p>
          <p className="text-lg font-bold text-white">{MOCK_POSITIONS.length}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Best Performer</p>
          <p className="text-sm font-bold text-green-400">NVDA +19.8%</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Worst Performer</p>
          <p className="text-sm font-bold text-red-400">TSLA -6.5%</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Concentration</p>
          <p className="text-sm font-bold text-white">Top 3: 57.5%</p>
        </div>
      </div>
    </motion.div>
  );
}
