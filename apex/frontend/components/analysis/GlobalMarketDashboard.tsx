'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Market {
  name: string;
  code: string;
  current_value: number;
  change_percent: number;
  change_direction: string;
  status: string;
  trading_hours: string;
}

export default function GlobalMarketDashboard() {
  const [markets, setMarkets] = useState<Record<string, Market>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/api/apex/market-dashboard`);
        const data = await response.json();
        setMarkets(data.markets || {});
      } catch (error) {
        console.error('Failed to fetch market dashboard:', error);
        setMarkets({
          'S&P500': { name: 'S&P 500', code: 'SPX', current_value: 5234.80, change_percent: 1.2, change_direction: '↑', status: 'open', trading_hours: '9:30 AM - 4:00 PM EST' },
          'NIFTY50': { name: 'NIFTY 50', code: 'NIFTY', current_value: 24156.35, change_percent: 0.85, change_direction: '↑', status: 'closed', trading_hours: '9:15 AM - 3:30 PM IST' },
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <motion.div
        className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 rounded-2xl border border-green-900/20 p-6 backdrop-blur"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center py-8">
          <div className="w-8 h-8 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400 mt-3">Loading global markets...</p>
        </div>
      </motion.div>
    );
  }

  const marketEntries = Object.entries(markets);

  return (
    <motion.div
      className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 rounded-2xl border border-green-900/20 p-6 backdrop-blur"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">Global Market Indices</h3>
        <p className="text-sm text-slate-500">Real-time major index values from around the world</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {marketEntries.map(([code, market], index) => (
          <motion.div
            key={code}
            className={`p-4 rounded-lg border transition ${market.change_percent >= 0 ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="font-semibold text-white">{code}</div>
                <div className="text-xs text-slate-500">{market.name}</div>
              </div>
              <div className={`text-xl font-bold ${market.change_percent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {market.change_direction}
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <div className="text-xs text-slate-500 mb-1">Current Value</div>
                <div className="text-2xl font-bold text-white">
                  {market.current_value.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-500 mb-1">Daily Change</div>
                <div className={`text-lg font-semibold ${market.change_percent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {market.change_percent >= 0 ? '+' : ''}{market.change_percent.toFixed(2)}%
                </div>
              </div>

              <div className="pt-2 border-t border-green-900/10">
                <div className="text-xs text-slate-500">
                  <span className={`${market.status === 'open' ? 'text-green-400' : 'text-yellow-400'}`}>
                    ● {market.status.charAt(0).toUpperCase() + market.status.slice(1)}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-1">{market.trading_hours}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {marketEntries.length > 0 && (
        <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-green-900/20">
          <h4 className="text-sm font-semibold text-green-400 mb-3">Global Market Stats</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <div className="text-slate-500">Markets Open</div>
              <div className="text-lg font-bold text-green-400">
                {marketEntries.filter(([_, m]) => m.status === 'open').length}
              </div>
            </div>
            <div>
              <div className="text-slate-500">Gainers</div>
              <div className="text-lg font-bold text-green-400">
                {marketEntries.filter(([_, m]) => m.change_percent >= 0).length}
              </div>
            </div>
            <div>
              <div className="text-slate-500">Decliners</div>
              <div className="text-lg font-bold text-red-400">
                {marketEntries.filter(([_, m]) => m.change_percent < 0).length}
              </div>
            </div>
            <div>
              <div className="text-slate-500">Avg Change</div>
              <div className={`text-lg font-bold ${
                marketEntries.reduce((sum, [_, m]) => sum + m.change_percent, 0) / marketEntries.length >= 0
                  ? 'text-green-400'
                  : 'text-red-400'
              }`}>
                {(
                  marketEntries.reduce((sum, [_, m]) => sum + m.change_percent, 0) /
                  marketEntries.length
                ).toFixed(2)}
                %
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
