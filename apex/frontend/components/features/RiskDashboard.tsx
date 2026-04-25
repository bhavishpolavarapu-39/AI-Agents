'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface RiskMetric {
  label: string;
  value: number | string;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  description: string;
}

const generateVaRTrend = () => {
  return [
    { date: '1 day ago', var95: 2.5, var99: 3.8 },
    { date: '2 days ago', var95: 2.3, var99: 3.5 },
    { date: '3 days ago', var95: 2.8, var99: 4.2 },
    { date: '4 days ago', var95: 2.1, var99: 3.2 },
    { date: '5 days ago', var95: 2.6, var99: 3.9 },
    { date: 'Today', var95: 3.2, var99: 4.8 },
  ];
};

const generateStressTest = () => {
  return [
    { scenario: '-10% Market', loss: -8.5 },
    { scenario: '-20% Market', loss: -16.3 },
    { scenario: '+10% Market', loss: 8.9 },
    { scenario: 'Rate ↑ 1%', loss: -4.2 },
    { scenario: 'Volatility ↑', loss: -5.7 },
    { scenario: 'Crisis', loss: -22.1 },
  ];
};

export default function RiskDashboard() {
  const [varData] = useState(generateVaRTrend());
  const [stressData] = useState(generateStressTest());

  const riskMetrics: RiskMetric[] = [
    {
      label: 'Value at Risk (95%)',
      value: 3.2,
      unit: '%',
      status: 'warning',
      description: '95% confident portfolio won\'t lose more than 3.2% in 1 day',
    },
    {
      label: 'Value at Risk (99%)',
      value: 4.8,
      unit: '%',
      status: 'warning',
      description: '99% confident portfolio won\'t lose more than 4.8% in 1 day',
    },
    {
      label: 'Sharpe Ratio',
      value: 1.85,
      unit: '',
      status: 'good',
      description: 'Risk-adjusted return metric (>1.0 is good)',
    },
    {
      label: 'Sortino Ratio',
      value: 2.42,
      unit: '',
      status: 'good',
      description: 'Downside risk-adjusted return',
    },
    {
      label: 'Portfolio Beta',
      value: 1.12,
      unit: '',
      status: 'good',
      description: '12% more volatile than market',
    },
    {
      label: 'Volatility (Annual)',
      value: 18.5,
      unit: '%',
      status: 'good',
      description: 'Standard deviation of portfolio returns',
    },
  ];

  const greeks = [
    { label: 'Delta', value: 0.65, description: 'Price sensitivity to market moves', range: '0.0 - 1.0' },
    { label: 'Gamma', value: 0.042, description: 'Rate of delta change', range: '0.0 - 0.5' },
    { label: 'Vega', value: 0.28, description: 'Sensitivity to volatility changes', range: '0.0 - 1.0' },
    { label: 'Theta', value: -0.015, description: 'Time decay (daily)', range: '-0.5 - 0.5' },
    { label: 'Rho', value: 0.18, description: 'Interest rate sensitivity', range: '-1.0 - 1.0' },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-white/20 rounded-lg p-2 backdrop-blur">
          <p className="text-white font-semibold text-sm">{payload[0].payload.date}</p>
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

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="liquid-glass border border-white/20 rounded-xl p-6 backdrop-blur">
        <h3 className="text-2xl font-bold text-white mb-2">Portfolio Risk Analysis</h3>
        <p className="text-gray-400">Comprehensive risk metrics including VaR, Greeks, stress tests, and volatility analysis</p>
      </div>

      {/* Risk Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {riskMetrics.map((metric, index) => {
          const bgColor = metric.status === 'good' ? 'bg-green-500/10 border-green-500/30' :
                         metric.status === 'warning' ? 'bg-yellow-500/10 border-yellow-500/30' :
                         'bg-red-500/10 border-red-500/30';
          const textColor = metric.status === 'good' ? 'text-green-400' :
                           metric.status === 'warning' ? 'text-yellow-400' :
                           'text-red-400';

          return (
            <motion.div
              key={metric.label}
              className={`liquid-glass border rounded-lg p-4 backdrop-blur ${bgColor}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
            >
              <p className="text-xs text-gray-400 mb-2">{metric.label}</p>
              <div className="mb-2">
                <p className="text-3xl font-bold text-white">
                  {metric.value}{metric.unit}
                </p>
              </div>
              <p className={`text-xs font-semibold mb-2 ${textColor}`}>
                {metric.status === 'good' ? '✓ Good' : metric.status === 'warning' ? '⚠ Warning' : '⚠ Critical'}
              </p>
              <p className="text-xs text-gray-400">{metric.description}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* VaR Trend Chart */}
        <motion.div
          className="liquid-glass border border-white/20 rounded-xl p-6 backdrop-blur"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h4 className="text-lg font-semibold text-white mb-4">Value at Risk Trend</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={varData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" style={{ fontSize: '11px' }} />
                <YAxis stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="var95" stroke="#f59e0b" strokeWidth={2} name="VaR 95%" dot={false} />
                <Line type="monotone" dataKey="var99" stroke="#ef4444" strokeWidth={2} name="VaR 99%" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            <span className="text-yellow-400">95% confidence:</span> Portfolio won't lose more than 3.2% on worst day
          </p>
        </motion.div>

        {/* Stress Test Results */}
        <motion.div
          className="liquid-glass border border-white/20 rounded-xl p-6 backdrop-blur"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h4 className="text-lg font-semibold text-white mb-4">Stress Test Results</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stressData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="scenario" stroke="rgba(255,255,255,0.5)" style={{ fontSize: '11px' }} angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} />
                <Tooltip />
                <Bar dataKey="loss" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            <span className="text-blue-400">Worst case:</span> Portfolio loses 22.1% in a market crisis
          </p>
        </motion.div>
      </div>

      {/* Portfolio Greeks */}
      <motion.div
        className="liquid-glass border border-white/20 rounded-xl p-6 backdrop-blur"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h4 className="text-lg font-semibold text-white mb-4">Portfolio Greeks</h4>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {greeks.map((greek, index) => (
            <motion.div
              key={greek.label}
              className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
            >
              <p className="text-sm font-bold text-white mb-2">{greek.label}</p>
              <p className="text-2xl font-bold text-blue-400 mb-2">{greek.value.toFixed(3)}</p>
              <p className="text-xs text-gray-400 mb-2">{greek.description}</p>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-400 rounded-full"
                  style={{
                    width: `${Math.abs(greek.value) * 50}%`,
                  }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Range: {greek.range}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Risk Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Volatility Analysis */}
        <motion.div
          className="liquid-glass border border-white/20 rounded-xl p-6 backdrop-blur"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h4 className="text-lg font-semibold text-white mb-4">Volatility Profile</h4>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <p className="text-sm text-gray-400">Daily Volatility</p>
                <p className="text-sm font-bold text-white">1.47%</p>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-blue-400 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <p className="text-sm text-gray-400">Weekly Volatility</p>
                <p className="text-sm font-bold text-white">3.28%</p>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-400 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <p className="text-sm text-gray-400">Annual Volatility</p>
                <p className="text-sm font-bold text-white">18.5%</p>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-orange-400 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Risk Recommendations */}
        <motion.div
          className="liquid-glass border border-white/20 rounded-xl p-6 backdrop-blur"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h4 className="text-lg font-semibold text-white mb-4">Risk Recommendations</h4>
          <div className="space-y-3">
            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-xs font-semibold text-green-400 mb-1">✓ CONTINUE MONITORING</p>
              <p className="text-xs text-gray-400">Current Sharpe ratio (1.85) indicates good risk-adjusted returns</p>
            </div>
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-xs font-semibold text-yellow-400 mb-1">⚠ REVIEW CONCENTRATION</p>
              <p className="text-xs text-gray-400">Tech exposure at 45% - consider diversification</p>
            </div>
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-xs font-semibold text-blue-400 mb-1">ℹ OPTIMIZE ALLOCATION</p>
              <p className="text-xs text-gray-400">Consider increasing fixed income allocation to reduce volatility</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Risk Legend */}
      <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
        <p className="text-xs font-semibold text-gray-400 mb-3">Risk Levels</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-400 rounded"></div>
            <span className="text-xs text-gray-400"><span className="text-green-400 font-semibold">Good:</span> Risk within acceptable range</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-yellow-400 rounded"></div>
            <span className="text-xs text-gray-400"><span className="text-yellow-400 font-semibold">Warning:</span> Monitor closely</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-red-400 rounded"></div>
            <span className="text-xs text-gray-400"><span className="text-red-400 font-semibold">Critical:</span> Take immediate action</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
