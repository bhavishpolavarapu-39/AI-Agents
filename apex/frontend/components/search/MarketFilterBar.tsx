'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface MarketInfo {
  status: string;
  hours: string;
}

export default function MarketFilterBar() {
  const [markets, setMarkets] = useState<string[]>([]);
  const [selected, setSelected] = useState('NYSE');

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/api/apex/market-filters`);
        const data = await response.json();
        setMarkets(data.markets || ['NYSE', 'NASDAQ', 'NSE', 'BSE']);
      } catch (error) {
        setMarkets(['NYSE', 'NASDAQ', 'NSE', 'BSE', 'LSE', 'TSE', 'HKEX', 'DAX']);
      }
    };
    fetchMarkets();
  }, []);

  const marketInfo: Record<string, MarketInfo> = {
    'NYSE': { status: 'open', hours: '9:30 AM - 4:00 PM EST' },
    'NASDAQ': { status: 'open', hours: '9:30 AM - 4:00 PM EST' },
    'NSE': { status: 'closed', hours: '9:15 AM - 3:30 PM IST' },
    'BSE': { status: 'closed', hours: '9:15 AM - 3:30 PM IST' },
    'LSE': { status: 'closed', hours: '8:00 AM - 4:30 PM GMT' },
    'TSE': { status: 'closed', hours: '9:00 AM - 3:00 PM JST' },
    'HKEX': { status: 'closed', hours: '9:30 AM - 4:00 PM HKT' },
    'DAX': { status: 'closed', hours: '8:00 AM - 10:00 PM CET' },
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 rounded-2xl border border-green-900/20 p-6 backdrop-blur"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">Global Market Filters</h3>
        <p className="text-sm text-slate-500">Select exchange to filter securities</p>
      </div>

      <div className="space-y-3">
        {markets.map((market) => {
          const info = marketInfo[market] || { status: 'closed', hours: '' };
          return (
            <motion.button
              key={market}
              onClick={() => setSelected(market)}
              className={`w-full p-3 rounded-lg border transition text-left ${
                selected === market
                  ? 'border-green-500/50 bg-green-500/10'
                  : 'border-green-900/20 bg-slate-800/30 hover:border-green-500/30'
              }`}
              whileHover={{ x: 4 }}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold text-white">{market}</div>
                  <div className="text-xs text-slate-400">{info.hours}</div>
                </div>
                <div
                  className={`w-3 h-3 rounded-full ${
                    info.status === 'open' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'
                  }`}
                ></div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
