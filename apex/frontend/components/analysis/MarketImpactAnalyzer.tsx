'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function MarketImpactAnalyzer() {
  const [primaryMarket, setPrimaryMarket] = useState('NSE');
  const [priceChange, setPriceChange] = useState(2);
  const [impactData, setImpactData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const markets = ['NSE', 'BSE', 'NYSE', 'NASDAQ', 'LSE', 'TSE', 'HKEX', 'DAX'];

  const fetchImpact = async () => {
    setIsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(
        `${apiUrl}/api/apex/market-correlation/impact?primary_market=${primaryMarket}&price_change=${priceChange}`
      );
      const data = await response.json();
      setImpactData(data);
    } catch (error) {
      console.error('Failed to fetch impact:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 rounded-2xl border border-green-900/20 p-6 backdrop-blur"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">Market Impact Analyzer</h3>
        <p className="text-sm text-slate-500">See how one market's move affects the rest</p>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="text-sm font-semibold text-slate-300 mb-2 block">Primary Market</label>
          <select
            value={primaryMarket}
            onChange={(e) => setPrimaryMarket(e.target.value)}
            className="w-full bg-slate-800/50 border border-green-900/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500/50"
          >
            {markets.map((market) => (
              <option key={market} value={market}>
                {market}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-300 mb-2 block">Price Change %</label>
          <div className="flex gap-2">
            <input type="range" min="-5" max="5" step="0.5" value={priceChange} onChange={(e) => setPriceChange(parseFloat(e.target.value))} className="flex-1" />
            <input type="number" value={priceChange} onChange={(e) => setPriceChange(parseFloat(e.target.value))} className="w-20 bg-slate-800/50 border border-green-900/30 rounded-lg px-2 py-2 text-white focus:outline-none" />
          </div>
        </div>
      </div>

      <motion.button
        onClick={fetchImpact}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-slate-700 disabled:to-slate-700 text-white font-semibold py-2 rounded-lg transition mb-6"
      >
        {isLoading ? 'Analyzing...' : 'Analyze Impact'}
      </motion.button>

      {impactData && (
        <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="p-4 bg-slate-800/50 rounded-lg border border-green-900/20">
            <h4 className="text-sm font-semibold text-green-400 mb-2">Ripple Effect</h4>
            <p className="text-sm text-slate-300">{impactData.ripple_effect_summary}</p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-300">Expected Market Changes</h4>
            {Object.entries(impactData.impact_on_markets || {})
              .sort((a, b) => Math.abs(b[1].expected_change_percent) - Math.abs(a[1].expected_change_percent))
              .slice(0, 5)
              .map(([market, impact]) => (
                <motion.div key={market} className="p-3 bg-slate-800/30 rounded-lg border border-green-900/10" whileHover={{ x: 4 }}>
                  <div className="flex justify-between items-center">
                    <div className="font-semibold text-white">{market}</div>
                    <div className={`text-lg font-bold ${impact.direction === '↑' ? 'text-green-400' : 'text-red-400'}`}>
                      {impact.direction} {Math.abs(impact.expected_change_percent).toFixed(2)}%
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Correlation: {impact.correlation?.toFixed(2) || 'N/A'}</div>
                </motion.div>
              ))}
          </div>
        </motion.div>
      )}

      {!impactData && !isLoading && (
        <div className="text-center py-8 text-slate-500">
          <p>Select market and price change, then click analyze</p>
        </div>
      )}
    </motion.div>
  );
}
