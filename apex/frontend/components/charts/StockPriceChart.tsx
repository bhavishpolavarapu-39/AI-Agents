'use client';

import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';
import TechnicalIndicatorSelector from './TechnicalIndicatorSelector';
import { apiClient } from '@/services/api';

interface PriceData {
  date: string;
  price: number;
  high: number;
  low: number;
  open: number;
  close: number;
  volume: number;
  sma20: number;
  sma50: number;
}

type TimeFrame = '1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL';
type ChartType = 'line' | 'area' | 'ohlc';

// Mock data generator
const generateMockData = (days: number): PriceData[] => {
  const data: PriceData[] = [];
  let price = 150;
  let sma20Sum = 0;
  let sma50Sum = 0;

  for (let i = 0; i < days; i++) {
    const change = (Math.random() - 0.48) * 5;
    price += change;

    const open = price - Math.random() * 3;
    const close = price + Math.random() * 2;
    const high = Math.max(open, close) + Math.random() * 2;
    const low = Math.min(open, close) - Math.random() * 2;

    sma20Sum += close;
    sma50Sum += close;

    const date = new Date();
    date.setDate(date.getDate() - (days - i));

    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: parseFloat(price.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      open: parseFloat(open.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume: Math.floor(Math.random() * 5000000) + 1000000,
      sma20: i >= 19 ? parseFloat((sma20Sum / 20).toFixed(2)) : NaN,
      sma50: i >= 49 ? parseFloat((sma50Sum / 50).toFixed(2)) : NaN,
    });
  }

  return data;
};

const TIMEFRAME_DAYS: Record<TimeFrame, number> = {
  '1D': 1,
  '1W': 7,
  '1M': 30,
  '3M': 90,
  '1Y': 365,
  'ALL': 730,
};

export default function StockPriceChart({ symbol = 'AAPL' }: { symbol?: string }) {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('1M');
  const [chartType, setChartType] = useState<ChartType>('line');
  const [showSMA, setShowSMA] = useState(true);
  const [showVolume, setShowVolume] = useState(true);
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [realData, setRealData] = useState<PriceData[]>([]);
  const [useRealData, setUseRealData] = useState(true);

  const days = TIMEFRAME_DAYS[timeFrame];

  // Fetch real data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await apiClient.getStockChart(symbol, timeFrame.toLowerCase());
        if (response.success && response.data) {
          // Transform API response to chart format
          const chartData = response.data.c?.map((close: number, index: number) => ({
            date: new Date(response.data.t[index] * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            price: close,
            high: response.data.h?.[index] || close,
            low: response.data.l?.[index] || close,
            open: response.data.o?.[index] || close,
            close: close,
            volume: response.data.v?.[index] || 0,
            sma20: index >= 19 ? response.data.c?.slice(Math.max(0, index - 19), index + 1).reduce((a: number, b: number) => a + b, 0) / 20 : NaN,
            sma50: index >= 49 ? response.data.c?.slice(Math.max(0, index - 49), index + 1).reduce((a: number, b: number) => a + b, 0) / 50 : NaN,
          })) || [];
          setRealData(chartData);
        }
      } catch (error) {
        console.error('Failed to fetch real data:', error);
        setUseRealData(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol, timeFrame]);

  const data = useRealData && realData.length > 0 ? realData : generateMockData(days);

  const minPrice = Math.min(...data.map(d => d.low)) - 5;
  const maxPrice = Math.max(...data.map(d => d.high)) + 5;
  const currentPrice = data[data.length - 1].close;
  const previousPrice = data[0].close;
  const changePercent = ((currentPrice - previousPrice) / previousPrice) * 100;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 border border-white/20 rounded-lg p-3 backdrop-blur">
          <p className="text-white font-semibold">{data.date}</p>
          {chartType === 'ohlc' && (
            <>
              <p className="text-xs text-gray-400">Open: ${data.open.toFixed(2)}</p>
              <p className="text-xs text-gray-400">High: ${data.high.toFixed(2)}</p>
              <p className="text-xs text-gray-400">Low: ${data.low.toFixed(2)}</p>
              <p className="text-xs text-gray-400">Close: ${data.close.toFixed(2)}</p>
            </>
          )}
          {chartType !== 'ohlc' && (
            <p className={`text-sm font-semibold ${data.price >= previousPrice ? 'text-green-400' : 'text-red-400'}`}>
              ${data.price.toFixed(2)}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">Vol: {(data.volume / 1000000).toFixed(1)}M</p>
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
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-2xl font-bold text-white">{symbol}</h3>
              <div className={`px-2 py-1 rounded text-xs font-bold ${
                realData.length > 0 && useRealData
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                {realData.length > 0 && useRealData ? '🔴 Live' : '📊 Demo'}
              </div>
            </div>
            <p className="text-3xl font-bold text-white mt-2">${currentPrice.toFixed(2)}</p>
            <p className={`text-sm mt-1 ${changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}% {timeFrame}
            </p>
            {loading && <p className="text-xs text-blue-400 mt-1">Fetching real data...</p>}
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          {/* Top Controls Row */}
          <div className="flex justify-between items-center gap-4">
            <div className="flex gap-2">
              {/* Timeframe Selector */}
              <div>
            <label className="text-xs font-semibold text-gray-400 mb-2 block">Timeframe</label>
            <div className="flex gap-2 flex-wrap">
              {(['1D', '1W', '1M', '3M', '1Y', 'ALL'] as TimeFrame[]).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeFrame(tf)}
                  className={`px-3 py-1 rounded text-xs font-medium transition ${
                    timeFrame === tf
                      ? 'bg-white text-black'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Chart Type Selector */}
          <div>
            <label className="text-xs font-semibold text-gray-400 mb-2 block">Chart Type</label>
            <div className="flex gap-2 flex-wrap">
              {(['line', 'area', 'ohlc'] as ChartType[]).map((ct) => (
                <button
                  key={ct}
                  onClick={() => setChartType(ct)}
                  className={`px-3 py-1 rounded text-xs font-medium transition capitalize ${
                    chartType === ct
                      ? 'bg-white text-black'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {ct}
                </button>
              ))}
            </div>
          </div>
            </div>

            {/* Technical Indicator Selector */}
            <TechnicalIndicatorSelector onIndicatorsChange={setSelectedIndicators} />
          </div>

          {/* Indicators Toggle */}
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-300 hover:text-white">
              <input
                type="checkbox"
                checked={showSMA}
                onChange={(e) => setShowSMA(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              Show SMA (20/50)
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-300 hover:text-white">
              <input
                type="checkbox"
                checked={showVolume}
                onChange={(e) => setShowVolume(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              Show Volume
            </label>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-96">
        {chartType === 'line' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} />
              <YAxis stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} domain={[minPrice, maxPrice]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#3b82f6"
                dot={false}
                strokeWidth={2}
                name={`${symbol} Price`}
              />
              {showSMA && <Line type="monotone" dataKey="sma20" stroke="#fbbf24" strokeWidth={1.5} name="SMA 20" />}
              {showSMA && <Line type="monotone" dataKey="sma50" stroke="#f87171" strokeWidth={1.5} name="SMA 50" />}
            </LineChart>
          </ResponsiveContainer>
        )}

        {chartType === 'area' && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} />
              <YAxis stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} domain={[minPrice, maxPrice]} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorPrice)"
                name={`${symbol} Price`}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {chartType === 'ohlc' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} />
              <YAxis stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} domain={[minPrice, maxPrice]} />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="close"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                name="Close Price"
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Volume Chart */}
      {showVolume && (
        <div className="w-full h-32 mt-6 border-t border-white/10 pt-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" style={{ fontSize: '10px' }} />
              <YAxis stroke="rgba(255,255,255,0.5)" style={{ fontSize: '10px' }} />
              <Bar dataKey="volume" fill="#6366f1" opacity={0.6} name="Volume" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Stats Footer */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6 pt-6 border-t border-white/10">
        <div>
          <p className="text-xs text-gray-400">High</p>
          <p className="text-sm font-bold text-white">${Math.max(...data.map(d => d.high)).toFixed(2)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Low</p>
          <p className="text-sm font-bold text-white">${Math.min(...data.map(d => d.low)).toFixed(2)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Avg Volume</p>
          <p className="text-sm font-bold text-white">{(data.reduce((a, b) => a + b.volume, 0) / data.length / 1000000).toFixed(1)}M</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">52W High</p>
          <p className="text-sm font-bold text-white">${(Math.max(...data.map(d => d.high)) * 1.1).toFixed(2)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">52W Low</p>
          <p className="text-sm font-bold text-white">${(Math.min(...data.map(d => d.low)) * 0.9).toFixed(2)}</p>
        </div>
      </div>
    </motion.div>
  );
}
