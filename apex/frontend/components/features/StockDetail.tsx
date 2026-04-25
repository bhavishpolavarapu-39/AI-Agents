'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StockData {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: string;
  peRatio: number;
  pbRatio: number;
  dividendYield: number;
  roe: number;
  revenue: number;
  earnings: number;
  profitMargin: number;
  debtToEquity: number;
  epsBcnt?: number;
  description: string;
}

const generatePriceHistory = () => {
  const data = [];
  let price = 150;
  for (let i = 30; i >= 0; i--) {
    price += (Math.random() - 0.5) * 3;
    data.push({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: parseFloat(price.toFixed(2)),
    });
  }
  return data;
};

const STOCK_DATA: StockData = {
  symbol: 'AAPL',
  name: 'Apple Inc',
  sector: 'Technology',
  price: 195.42,
  change: 4.32,
  changePercent: 2.26,
  marketCap: '3.1T',
  peRatio: 28.5,
  pbRatio: 42.5,
  dividendYield: 0.92,
  roe: 89.5,
  revenue: 394.3,
  earnings: 96.9,
  profitMargin: 26.3,
  debtToEquity: 1.84,
  epsBcnt: 6.84,
  description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. The company serves consumers, small and mid-sized businesses, and enterprises.'
};

interface AnalystRating {
  firm: string;
  rating: string;
  target: number;
}

const ANALYST_RATINGS: AnalystRating[] = [
  { firm: 'Morgan Stanley', rating: 'Overweight', target: 210 },
  { firm: 'Goldman Sachs', rating: 'Buy', target: 215 },
  { firm: 'JP Morgan', rating: 'Overweight', target: 205 },
  { firm: 'Bank of America', rating: 'Buy', target: 220 },
  { firm: 'Credit Suisse', rating: 'Neutral', target: 190 },
];

interface NewsItem {
  title: string;
  source: string;
  time: string;
  sentiment: 'positive' | 'negative' | 'neutral';
}

const NEWS_ITEMS: NewsItem[] = [
  { title: 'Apple Reports Strong Q2 Earnings Beat Expectations', source: 'Reuters', time: '2 hours ago', sentiment: 'positive' },
  { title: 'iPhone 16 Demand Remains Strong Amid Competition', source: 'Bloomberg', time: '4 hours ago', sentiment: 'positive' },
  { title: 'Apple Faces Supply Chain Challenges in China', source: 'CNBC', time: '6 hours ago', sentiment: 'negative' },
  { title: 'Services Revenue Grows 12% YoY', source: 'Seeking Alpha', time: '1 day ago', sentiment: 'positive' },
  { title: 'Regulatory Scrutiny Continues in EU Markets', source: 'Financial Times', time: '2 days ago', sentiment: 'negative' },
];

export default function StockDetail({ symbol = 'AAPL' }: { symbol?: string }) {
  const [priceData] = useState(generatePriceHistory());
  const [selectedTimeframe, setSelectedTimeframe] = useState('1M');

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-white/20 rounded-lg p-2 backdrop-blur">
          <p className="text-white font-semibold text-sm">${payload[0].value.toFixed(2)}</p>
          <p className="text-xs text-gray-400">{payload[0].payload.date}</p>
        </div>
      );
    }
    return null;
  };

  const positiveRatings = ANALYST_RATINGS.filter(r => r.rating === 'Buy' || r.rating === 'Overweight').length;
  const neutralRatings = ANALYST_RATINGS.filter(r => r.rating === 'Neutral').length;
  const negativeRatings = ANALYST_RATINGS.filter(r => r.rating === 'Sell' || r.rating === 'Underperform').length;

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="liquid-glass border border-white/20 rounded-xl p-6 backdrop-blur">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-4xl font-bold text-white">{STOCK_DATA.symbol}</h2>
            <p className="text-gray-400 text-lg">{STOCK_DATA.name}</p>
            <p className="text-gray-500 text-sm mt-1">{STOCK_DATA.sector}</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-white">${STOCK_DATA.price.toFixed(2)}</p>
            <p className={`text-xl font-bold ${STOCK_DATA.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {STOCK_DATA.change >= 0 ? '+' : ''}{STOCK_DATA.change.toFixed(2)} ({STOCK_DATA.changePercent >= 0 ? '+' : ''}{STOCK_DATA.changePercent.toFixed(2)}%)
            </p>
          </div>
        </div>
        <p className="text-gray-400 text-sm">{STOCK_DATA.description}</p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Market Cap', value: STOCK_DATA.marketCap },
          { label: 'P/E Ratio', value: STOCK_DATA.peRatio.toFixed(2) },
          { label: 'P/B Ratio', value: STOCK_DATA.pbRatio.toFixed(2) },
          { label: 'Dividend Yield', value: `${STOCK_DATA.dividendYield.toFixed(2)}%` },
          { label: 'ROE', value: `${STOCK_DATA.roe.toFixed(1)}%` },
          { label: 'Profit Margin', value: `${STOCK_DATA.profitMargin.toFixed(1)}%` },
          { label: 'Debt/Equity', value: STOCK_DATA.debtToEquity.toFixed(2) },
          { label: 'EPS', value: `$${STOCK_DATA.epsBcnt?.toFixed(2)}` },
        ].map((metric) => (
          <motion.div
            key={metric.label}
            className="liquid-glass border border-white/20 rounded-lg p-4 backdrop-blur"
            whileHover={{ scale: 1.05 }}
          >
            <p className="text-xs text-gray-400 mb-2">{metric.label}</p>
            <p className="text-lg font-bold text-white">{metric.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Price Chart */}
      <div className="liquid-glass border border-white/20 rounded-xl p-6 backdrop-blur">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Price Chart</h3>
          <div className="flex gap-2">
            {['1D', '1W', '1M', '3M', '1Y', 'ALL'].map((tf) => (
              <button
                key={tf}
                onClick={() => setSelectedTimeframe(tf)}
                className={`px-3 py-1 rounded text-xs font-medium transition ${
                  selectedTimeframe === tf
                    ? 'bg-white text-black'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={priceData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} />
              <YAxis stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="price" stroke="#3b82f6" fillOpacity={1} fill="url(#colorPrice)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Analyst Ratings and News */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Analyst Ratings */}
        <motion.div
          className="liquid-glass border border-white/20 rounded-xl p-6 backdrop-blur"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h3 className="text-xl font-bold text-white mb-4">Analyst Ratings</h3>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <p className="text-xs text-gray-400">Buy</p>
              <p className="text-2xl font-bold text-green-400">{positiveRatings}</p>
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-400">Hold</p>
              <p className="text-2xl font-bold text-yellow-400">{neutralRatings}</p>
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-400">Sell</p>
              <p className="text-2xl font-bold text-red-400">{negativeRatings}</p>
            </div>
          </div>
          <div className="space-y-3">
            {ANALYST_RATINGS.map((rating) => (
              <motion.div
                key={rating.firm}
                className="p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition"
                whileHover={{ x: 4 }}
              >
                <div className="flex justify-between items-center mb-1">
                  <p className="font-semibold text-white">{rating.firm}</p>
                  <p className={`text-xs font-bold px-2 py-1 rounded ${
                    rating.rating === 'Buy' || rating.rating === 'Overweight'
                      ? 'bg-green-500/20 text-green-400'
                      : rating.rating === 'Sell'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {rating.rating}
                  </p>
                </div>
                <p className="text-xs text-gray-400">Target: ${rating.target.toFixed(2)}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Latest News */}
        <motion.div
          className="liquid-glass border border-white/20 rounded-xl p-6 backdrop-blur"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h3 className="text-xl font-bold text-white mb-4">Latest News</h3>
          <div className="space-y-3">
            {NEWS_ITEMS.map((item) => (
              <motion.div
                key={item.title}
                className="p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition cursor-pointer"
                whileHover={{ x: 4 }}
              >
                <div className="flex items-start gap-3 mb-2">
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-1.5 ${
                    item.sentiment === 'positive' ? 'bg-green-400' : item.sentiment === 'negative' ? 'bg-red-400' : 'bg-gray-400'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-gray-400">{item.source}</p>
                      <p className="text-xs text-gray-500">{item.time}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Financials Summary */}
      <div className="liquid-glass border border-white/20 rounded-xl p-6 backdrop-blur">
        <h3 className="text-xl font-bold text-white mb-4">Financial Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div>
            <p className="text-xs text-gray-400 mb-2">Revenue (Annual)</p>
            <p className="text-2xl font-bold text-white">${STOCK_DATA.revenue}B</p>
            <p className="text-xs text-green-400 mt-1">↑ 12% YoY</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-2">Net Income</p>
            <p className="text-2xl font-bold text-white">${STOCK_DATA.earnings}B</p>
            <p className="text-xs text-green-400 mt-1">↑ 8% YoY</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-2">Free Cash Flow</p>
            <p className="text-2xl font-bold text-white">$92.5B</p>
            <p className="text-xs text-green-400 mt-1">↑ 15% YoY</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
