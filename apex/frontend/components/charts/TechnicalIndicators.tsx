'use client';

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

interface IndicatorData {
  date: string;
  rsi: number;
  macd: number;
  macdSignal: number;
  macdHistogram: number;
  bbUpper: number;
  bbMiddle: number;
  bbLower: number;
  price: number;
}

// Mock technical indicator data
const generateIndicatorData = (): IndicatorData[] => {
  const data: IndicatorData[] = [];
  let price = 150;

  for (let i = 0; i < 100; i++) {
    price += (Math.random() - 0.5) * 3;

    const rsi = 30 + Math.sin(i * 0.1) * 35 + Math.random() * 5;
    const macd = Math.sin(i * 0.08) * 5;
    const macdSignal = Math.sin(i * 0.08 - 0.3) * 4;

    const date = new Date();
    date.setDate(date.getDate() - (100 - i));

    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      rsi: Math.max(0, Math.min(100, rsi)),
      macd: macd,
      macdSignal: macdSignal,
      macdHistogram: macd - macdSignal,
      bbUpper: price + 5,
      bbMiddle: price,
      bbLower: price - 5,
      price: parseFloat(price.toFixed(2)),
    });
  }

  return data;
};

const SIGNALS = [
  { name: 'RSI (Relative Strength Index)', value: 58.3, signal: 'Neutral', description: 'Measures momentum' },
  { name: 'MACD', value: 0.85, signal: 'Bullish', description: 'Trend-following momentum' },
  { name: 'Bollinger Bands', value: 155.42, signal: 'Neutral', description: 'Volatility indicator' },
  { name: 'ADX (Trend Strength)', value: 42.5, signal: 'Strong Trend', description: 'Trend direction & strength' },
  { name: 'Stochastic', value: 72.3, signal: 'Overbought', description: 'Momentum oscillator' },
  { name: 'ATR (Volatility)', value: 3.24, signal: 'Moderate', description: 'Average true range' },
];

export default function TechnicalIndicators({ symbol = 'AAPL' }: { symbol?: string }) {
  const data = generateIndicatorData();

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-slate-900/95 border border-white/20 rounded-lg p-3 backdrop-blur">
          <p className="text-white font-semibold text-sm">{item.date}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-xs">
              {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
            </p>
          ))}
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
        <h3 className="text-2xl font-bold text-white mb-4">{symbol} - Technical Analysis</h3>
      </div>

      {/* Key Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {SIGNALS.map((indicator, index) => (
          <motion.div
            key={indicator.name}
            className="p-4 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 transition"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="mb-2">
              <p className="text-xs font-semibold text-gray-400">{indicator.name}</p>
              <p className="text-sm text-gray-500">{indicator.description}</p>
            </div>
            <div className="flex justify-between items-end mb-2">
              <p className="text-2xl font-bold text-white">{indicator.value}</p>
              <p className={`text-xs font-bold px-2 py-1 rounded ${
                indicator.signal.includes('Bullish') || indicator.signal.includes('Strong')
                  ? 'bg-green-500/20 text-green-400'
                  : indicator.signal.includes('Bearish')
                  ? 'bg-red-500/20 text-red-400'
                  : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                {indicator.signal}
              </p>
            </div>

            {/* Status Bar */}
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  indicator.signal.includes('Bullish') || indicator.signal.includes('Strong')
                    ? 'bg-green-500'
                    : indicator.signal.includes('Bearish')
                    ? 'bg-red-500'
                    : 'bg-yellow-500'
                }`}
                style={{ width: `${Math.random() * 100}%` }}
              ></div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* RSI Chart */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-white mb-3">RSI (14) - Momentum Indicator</h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} />
              <YAxis domain={[0, 100]} stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="rsi" stroke="#3b82f6" strokeWidth={2} dot={false} name="RSI" />
              <line x1="0" y1="70" x2="100%" y2="70" stroke="rgba(255,100,100,0.3)" strokeDasharray="3 3" />
              <line x1="0" y1="30" x2="100%" y2="30" stroke="rgba(100,255,100,0.3)" strokeDasharray="3 3" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          <span className="text-green-400">Green Zone</span>: Oversold (&lt;30) |
          <span className="text-red-400 ml-2">Red Zone</span>: Overbought (&gt;70)
        </p>
      </div>

      {/* MACD Chart */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-white mb-3">MACD - Trend-Following Momentum</h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} />
              <YAxis stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="macdHistogram" fill="#10b981" opacity={0.6} name="MACD Histogram" />
              <Line type="monotone" dataKey="macd" stroke="#3b82f6" strokeWidth={2} name="MACD Line" />
              <Line type="monotone" dataKey="macdSignal" stroke="#f59e0b" strokeWidth={2} name="Signal Line" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-gray-400 mt-2">Positive histogram: Bullish momentum | Negative: Bearish momentum</p>
      </div>

      {/* Bollinger Bands Chart */}
      <div>
        <h4 className="text-sm font-semibold text-white mb-3">Bollinger Bands - Volatility & Support/Resistance</h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} />
              <YAxis stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2.5} dot={false} name="Price" />
              <Line type="monotone" dataKey="bbUpper" stroke="#ef4444" strokeWidth={1} strokeDasharray="3 3" dot={false} name="Upper Band" />
              <Line type="monotone" dataKey="bbMiddle" stroke="#fbbf24" strokeWidth={1.5} dot={false} name="Middle Band (SMA)" />
              <Line type="monotone" dataKey="bbLower" stroke="#10b981" strokeWidth={1} strokeDasharray="3 3" dot={false} name="Lower Band" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-gray-400 mt-2">Price near upper band: Potential resistance | Price near lower band: Potential support</p>
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 bg-white/10 border border-white/10 rounded-lg">
        <h4 className="text-sm font-semibold text-white mb-2">Technical Analysis Summary</h4>
        <ul className="text-xs text-gray-300 space-y-1">
          <li>• <strong>Overall Signal:</strong> Mixed (RSI Neutral, MACD Bullish, Bollinger Bands Neutral)</li>
          <li>• <strong>Trend:</strong> Uptrend with consolidation (Watch for breakout)</li>
          <li>• <strong>Support Level:</strong> $150.25</li>
          <li>• <strong>Resistance Level:</strong> $160.50</li>
        </ul>
      </div>
    </motion.div>
  );
}
