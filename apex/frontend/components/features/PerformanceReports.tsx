'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';

interface PerformanceData {
  month: string;
  return: number;
  benchmark: number;
  excess: number;
}

interface Attribution {
  source: string;
  contribution: number;
  percentage: number;
}

const generatePerformanceData = (): PerformanceData[] => {
  return [
    { month: 'Jan', return: 4.2, benchmark: 2.5, excess: 1.7 },
    { month: 'Feb', return: -2.1, benchmark: -1.8, excess: -0.3 },
    { month: 'Mar', return: 5.8, benchmark: 4.1, excess: 1.7 },
    { month: 'Apr', return: 3.2, benchmark: 1.9, excess: 1.3 },
    { month: 'May', return: -1.5, benchmark: -0.8, excess: -0.7 },
    { month: 'Jun', return: 6.1, benchmark: 3.2, excess: 2.9 },
  ];
};

export default function PerformanceReports() {
  const [performanceData] = useState(generatePerformanceData());
  const [reportType, setReportType] = useState<'monthly' | 'annual' | 'attribution'>('monthly');
  const [timeframe, setTimeframe] = useState<'1M' | '3M' | '6M' | '1Y'>('6M');

  const ytdReturn = 15.7;
  const totalReturn = 28.4;
  const benchmarkReturn = 12.3;
  const excessReturn = 3.4;
  const maxDrawdown = -8.5;
  const winRate = 68;

  const attributionData: Attribution[] = [
    { source: 'Stock Selection', contribution: 4.2, percentage: 45 },
    { source: 'Sector Allocation', contribution: 2.1, percentage: 23 },
    { source: 'Factor Timing', contribution: 1.8, percentage: 19 },
    { source: 'Other', contribution: 0.7, percentage: 13 },
  ];

  const monthlyMetrics = [
    { month: 'January', return: '4.2%', trades: 12, winRate: '75%', avgWin: '1.2%', avgLoss: '-0.8%' },
    { month: 'February', return: '-2.1%', trades: 8, winRate: '50%', avgWin: '0.9%', avgLoss: '-1.1%' },
    { month: 'March', return: '5.8%', trades: 15, winRate: '73%', avgWin: '1.4%', avgLoss: '-0.9%' },
    { month: 'April', return: '3.2%', trades: 10, winRate: '70%', avgWin: '1.1%', avgLoss: '-0.7%' },
    { month: 'May', return: '-1.5%', trades: 7, winRate: '57%', avgWin: '0.8%', avgLoss: '-1.2%' },
    { month: 'June', return: '6.1%', trades: 13, winRate: '77%', avgWin: '1.3%', avgLoss: '-0.6%' },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-white/20 rounded-lg p-2 backdrop-blur">
          <p className="text-white font-semibold text-sm">{payload[0].payload.month}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-xs">
              {entry.name}: {entry.value.toFixed(2)}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  const handleExport = (format: 'pdf' | 'csv') => {
    alert(`Exporting report as ${format.toUpperCase()}...`);
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header with Export Options */}
      <div className="liquid-glass border border-white/20 rounded-xl p-6 backdrop-blur">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Performance Reports</h3>
            <p className="text-gray-400">Detailed analysis of portfolio performance and attribution</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleExport('pdf')}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition"
            >
              Export PDF
            </button>
            <button
              onClick={() => handleExport('csv')}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition"
            >
              Export CSV
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'YTD Return', value: `${ytdReturn}%`, color: 'text-green-400' },
            { label: 'Total Return', value: `${totalReturn}%`, color: 'text-green-400' },
            { label: 'Excess Return', value: `${excessReturn}%`, color: 'text-blue-400' },
            { label: 'Max Drawdown', value: `${maxDrawdown}%`, color: 'text-red-400' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
              <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 flex-wrap">
        <div>
          <label className="text-xs text-gray-400 mb-2 block">Report Type</label>
          <div className="flex gap-2">
            {(['monthly', 'annual', 'attribution'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setReportType(type)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  reportType === type
                    ? 'bg-white text-black'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-2 block">Timeframe</label>
          <div className="flex gap-2">
            {(['1M', '3M', '6M', '1Y'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-2 rounded-lg font-semibold transition text-sm ${
                  timeframe === tf
                    ? 'bg-white text-black'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Performance vs Benchmark Chart */}
      <motion.div
        className="liquid-glass border border-white/20 rounded-xl p-6 backdrop-blur"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h4 className="text-lg font-semibold text-white mb-4">Portfolio vs Benchmark</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} />
              <YAxis stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="return" stroke="#3b82f6" strokeWidth={2} name="Portfolio Return" dot={false} />
              <Line type="monotone" dataKey="benchmark" stroke="#10b981" strokeWidth={2} name="Benchmark" dot={false} strokeDasharray="5 5" />
              <Line type="monotone" dataKey="excess" stroke="#f59e0b" strokeWidth={2} name="Excess Return" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Monthly Metrics Table */}
      <motion.div
        className="liquid-glass border border-white/20 rounded-xl p-6 backdrop-blur"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h4 className="text-lg font-semibold text-white mb-4">Monthly Performance Details</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-4 py-3 text-left text-gray-400 font-semibold">Month</th>
                <th className="px-4 py-3 text-right text-gray-400 font-semibold">Return</th>
                <th className="px-4 py-3 text-right text-gray-400 font-semibold">Trades</th>
                <th className="px-4 py-3 text-right text-gray-400 font-semibold">Win Rate</th>
                <th className="px-4 py-3 text-right text-gray-400 font-semibold">Avg Win</th>
                <th className="px-4 py-3 text-right text-gray-400 font-semibold">Avg Loss</th>
              </tr>
            </thead>
            <tbody>
              {monthlyMetrics.map((metric) => (
                <motion.tr
                  key={metric.month}
                  className="border-b border-white/5 hover:bg-white/5 transition"
                  whileHover={{ x: 4 }}
                >
                  <td className="px-4 py-3 font-semibold text-white">{metric.month}</td>
                  <td className={`px-4 py-3 text-right font-semibold ${
                    parseFloat(metric.return) >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {metric.return}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-300">{metric.trades}</td>
                  <td className="px-4 py-3 text-right text-gray-300">{metric.winRate}</td>
                  <td className="px-4 py-3 text-right text-green-400">{metric.avgWin}</td>
                  <td className="px-4 py-3 text-right text-red-400">{metric.avgLoss}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Attribution Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attribution Pie Chart */}
        <motion.div
          className="liquid-glass border border-white/20 rounded-xl p-6 backdrop-blur"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h4 className="text-lg font-semibold text-white mb-4">Performance Attribution</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ source, percentage }) => `${source} ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="percentage"
                >
                  {attributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Attribution Details */}
        <motion.div
          className="liquid-glass border border-white/20 rounded-xl p-6 backdrop-blur"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h4 className="text-lg font-semibold text-white mb-4">Attribution Breakdown</h4>
          <div className="space-y-4">
            {attributionData.map((attr, index) => (
              <div key={attr.source}>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-300">{attr.source}</p>
                  <p className="text-sm font-bold text-white">{attr.contribution.toFixed(2)}%</p>
                </div>
                <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: COLORS[index] }}
                    initial={{ width: 0 }}
                    animate={{ width: `${attr.percentage}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  ></motion.div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-lg">
            <p className="text-xs font-semibold text-gray-400 mb-2">Total Excess Return</p>
            <p className="text-2xl font-bold text-green-400">+3.4%</p>
            <p className="text-xs text-gray-400 mt-1">Outperformance vs S&P 500 benchmark</p>
          </div>
        </motion.div>
      </div>

      {/* Performance Metrics Summary */}
      <motion.div
        className="liquid-glass border border-white/20 rounded-xl p-6 backdrop-blur"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h4 className="text-lg font-semibold text-white mb-4">Key Performance Metrics</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Return', value: `${totalReturn}%` },
            { label: 'YTD Return', value: `${ytdReturn}%` },
            { label: 'Benchmark Return', value: `${benchmarkReturn}%` },
            { label: 'Excess Return', value: `${excessReturn}%` },
            { label: 'Max Drawdown', value: `${maxDrawdown}%` },
            { label: 'Win Rate', value: `${winRate}%` },
            { label: 'Avg Monthly Return', value: '2.1%' },
            { label: 'Volatility', value: '18.5%' },
          ].map((metric) => (
            <div
              key={metric.label}
              className="p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition"
            >
              <p className="text-xs text-gray-400 mb-1">{metric.label}</p>
              <p className={`text-lg font-bold ${
                metric.value.startsWith('-') ? 'text-red-400' : 'text-green-400'
              }`}>
                {metric.value}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Report Notes */}
      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <p className="text-xs font-semibold text-blue-400 mb-2">📊 Report Generated</p>
        <p className="text-xs text-gray-400">
          Last updated: June 30, 2024 | Benchmark: S&P 500 | Currency: USD
        </p>
      </div>
    </motion.div>
  );
}
