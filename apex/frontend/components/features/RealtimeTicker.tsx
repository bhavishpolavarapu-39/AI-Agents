'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TickerItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
}

const TICKER_STOCKS: TickerItem[] = [
  { symbol: 'AAPL', name: 'Apple', price: 195.42, change: 4.32, changePercent: 2.26, volume: 52.3 },
  { symbol: 'MSFT', name: 'Microsoft', price: 417.89, change: 7.62, changePercent: 1.85, volume: 18.9 },
  { symbol: 'GOOGL', name: 'Alphabet', price: 156.72, change: -1.95, changePercent: -1.23, volume: 21.5 },
  { symbol: 'NVDA', name: 'NVIDIA', price: 875.32, change: 36.11, changePercent: 4.31, volume: 35.2 },
  { symbol: 'TSLA', name: 'Tesla', price: 242.18, change: -5.67, changePercent: -2.28, volume: 142.3 },
  { symbol: 'META', name: 'Meta', price: 478.56, change: 6.95, changePercent: 1.47, volume: 15.2 },
  { symbol: 'AMZN', name: 'Amazon', price: 189.45, change: 6.73, changePercent: 3.68, volume: 45.1 },
  { symbol: 'JPM', name: 'JPMorgan', price: 189.23, change: 1.69, changePercent: 0.90, volume: 8.5 },
];

export default function RealtimeTicker() {
  const [stocks, setStocks] = useState<TickerItem[]>(TICKER_STOCKS);
  const [displayIndex, setDisplayIndex] = useState(0);

  // Simulate price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prevStocks =>
        prevStocks.map(stock => ({
          ...stock,
          price: stock.price + (Math.random() - 0.5) * 2,
          change: (Math.random() - 0.5) * 5,
          changePercent: (Math.random() - 0.5) * 3,
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayIndex(prev => (prev + 1) % stocks.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [stocks.length]);

  const displayedStocks = [
    stocks[displayIndex],
    stocks[(displayIndex + 1) % stocks.length],
    stocks[(displayIndex + 2) % stocks.length],
  ];

  return (
    <motion.div
      className="liquid-glass border border-white/20 rounded-xl p-6 backdrop-blur overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="text-2xl font-bold text-white mb-6">Market Ticker</h3>

      {/* Live Ticker Strip */}
      <div className="mb-6 p-4 bg-gradient-to-r from-red-500/10 via-transparent to-green-500/10 border border-white/10 rounded-lg overflow-hidden">
        <motion.div
          className="flex gap-8"
          animate={{ x: [0, -1000] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          {[...TICKER_STOCKS, ...TICKER_STOCKS].map((stock, idx) => (
            <div key={idx} className="flex items-center gap-3 whitespace-nowrap flex-shrink-0">
              <span className="font-bold text-white">{stock.symbol}</span>
              <span className="text-gray-300">${stock.price.toFixed(2)}</span>
              <span className={`font-semibold ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Ticker Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {displayedStocks.map((stock, index) => (
          <motion.div
            key={stock.symbol}
            className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition cursor-pointer"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-bold text-white">{stock.symbol}</p>
                <p className="text-xs text-gray-400">{stock.name}</p>
              </div>
              <div className={`text-xs font-bold px-2 py-1 rounded ${
                stock.change >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {stock.change >= 0 ? '↑' : '↓'}
              </div>
            </div>

            <div className="mb-3">
              <p className="text-2xl font-bold text-white">${stock.price.toFixed(2)}</p>
              <p className={`text-sm font-semibold ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
              </p>
            </div>

            <div className="pt-3 border-t border-white/10">
              <p className="text-xs text-gray-400">Volume</p>
              <p className="text-lg font-bold text-white">{stock.volume}M</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* All Stocks List */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <h4 className="text-lg font-semibold text-white mb-4">All Stocks</h4>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {stocks.map((stock) => (
            <motion.div
              key={stock.symbol}
              className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition"
              whileHover={{ x: 4 }}
            >
              <div className="flex items-center gap-4 flex-1">
                <div>
                  <p className="font-bold text-white">{stock.symbol}</p>
                  <p className="text-xs text-gray-400">{stock.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-white">${stock.price.toFixed(2)}</p>
                <p className={`text-sm font-semibold ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Market Status */}
      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center gap-3">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <p className="text-sm text-gray-300">
          <span className="text-green-400 font-semibold">Market Open</span> - Updates every 2 seconds
        </p>
      </div>
    </motion.div>
  );
}
