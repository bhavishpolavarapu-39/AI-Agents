'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface ImpactData {
  primary_market: string;
  secondary_market: string;
  correlation: number;
  primary_change: number;
  estimated_secondary_change: number;
  description: string;
}

const CORRELATION_DATA: Record<string, Record<string, number>> = {
  'NSE': { 'BSE': 0.92, 'NYSE': 0.64, 'NASDAQ': 0.58, 'LSE': 0.52, 'TSE': 0.48 },
  'BSE': { 'NSE': 0.92, 'NYSE': 0.60, 'NASDAQ': 0.55, 'LSE': 0.50, 'TSE': 0.45 },
  'NYSE': { 'NASDAQ': 0.78, 'NSE': 0.64, 'BSE': 0.60, 'LSE': 0.75, 'TSE': 0.42 },
  'NASDAQ': { 'NYSE': 0.78, 'NSE': 0.58, 'BSE': 0.55, 'LSE': 0.72, 'TSE': 0.40 },
  'LSE': { 'NYSE': 0.75, 'NASDAQ': 0.72, 'NSE': 0.52, 'BSE': 0.50, 'TSE': 0.38 },
  'TSE': { 'NYSE': 0.42, 'NASDAQ': 0.40, 'NSE': 0.48, 'BSE': 0.45, 'LSE': 0.38 },
};

export default function MarketImpactAnalyzer() {
  const [primaryMarket, setPrimaryMarket] = useState('NSE');
  const [secondaryMarket, setSecondaryMarket] = useState('NYSE');
  const [priceChange, setPriceChange] = useState(2);
  const [impactData, setImpactData] = useState<ImpactData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const markets = ['NSE', 'BSE', 'NYSE', 'NASDAQ', 'LSE', 'TSE', 'HKEX', 'DAX'];

  const fetchImpact = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    const correlation = CORRELATION_DATA[primaryMarket]?.[secondaryMarket] || 0.5;
    const estimatedChange = priceChange * correlation;

    const data: ImpactData = {
      primary_market: primaryMarket,
      secondary_market: secondaryMarket,
      correlation: correlation,
      primary_change: priceChange,
      estimated_secondary_change: estimatedChange,
      description: `When ${primaryMarket} moves ${priceChange > 0 ? 'up' : 'down'} by ${Math.abs(priceChange)}%, the correlation coefficient of ${correlation.toFixed(2)} suggests ${secondaryMarket} would likely ${estimatedChange > 0 ? 'rise' : 'fall'} by approximately ${Math.abs(estimatedChange).toFixed(2)}%.`
    };

    setImpactData(data);
    setIsLoading(false);
  };

  const handleSwapMarkets = () => {
    const temp = primaryMarket;
    setPrimaryMarket(secondaryMarket);
    setSecondaryMarket(temp);
  };

  return (
    <motion.div
      className="liquid-glass border border-white/20 rounded-xl p-6 backdrop-blur"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">Market Impact Analyzer</h3>
        <p className="text-sm text-gray-400">Compare how one market's movement affects another</p>
      </div>

      <div className="space-y-4 mb-6">
        {/* Primary Market */}
        <div>
          <label className="text-sm font-semibold text-gray-300 mb-2 block">Primary Market (Moving)</label>
          <select
            value={primaryMarket}
            onChange={(e) => setPrimaryMarket(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white/40"
          >
            {markets.filter(m => m !== secondaryMarket).map((market) => (
              <option key={market} value={market} className="bg-black">
                {market}
              </option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <motion.button
            onClick={handleSwapMarkets}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 bg-white/10 border border-white/20 rounded-full hover:bg-white/20 transition"
            title="Swap markets"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </motion.button>
        </div>

        {/* Secondary Market */}
        <div>
          <label className="text-sm font-semibold text-gray-300 mb-2 block">Secondary Market (Affected)</label>
          <select
            value={secondaryMarket}
            onChange={(e) => setSecondaryMarket(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white/40"
          >
            {markets.filter(m => m !== primaryMarket).map((market) => (
              <option key={market} value={market} className="bg-black">
                {market}
              </option>
            ))}
          </select>
        </div>

        {/* Price Change Input */}
        <div>
          <label className="text-sm font-semibold text-gray-300 mb-2 block">Price Change in {primaryMarket} (%)</label>
          <div className="flex gap-3">
            <input
              type="range"
              min="-10"
              max="10"
              step="0.5"
              value={priceChange}
              onChange={(e) => setPriceChange(parseFloat(e.target.value))}
              className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
            />
            <input
              type="number"
              value={priceChange}
              onChange={(e) => setPriceChange(parseFloat(e.target.value))}
              className="w-20 bg-white/10 border border-white/20 rounded-lg px-2 py-2 text-white focus:outline-none"
            />
            <span className="text-white font-semibold py-2">%</span>
          </div>
        </div>
      </div>

      <motion.button
        onClick={fetchImpact}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={isLoading}
        className="w-full bg-white text-black hover:bg-gray-100 disabled:bg-gray-700 disabled:text-gray-400 text-white font-semibold py-3 rounded-lg transition mb-6"
      >
        {isLoading ? 'Analyzing...' : 'Analyze Impact'}
      </motion.button>

      {impactData && (
        <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Correlation Card */}
          <div className="p-4 bg-white/10 border border-white/20 rounded-lg">
            <h4 className="text-sm font-semibold text-white mb-2">Market Correlation</h4>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">{primaryMarket} ↔ {secondaryMarket}</span>
              <span className="text-2xl font-bold text-white">{impactData.correlation.toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {impactData.correlation > 0.7 ? 'Strong positive correlation' :
               impactData.correlation > 0.5 ? 'Moderate positive correlation' :
               impactData.correlation > 0 ? 'Weak positive correlation' : 'Negative correlation'}
            </p>
          </div>

          {/* Impact Analysis */}
          <div className="p-4 bg-white/10 border border-white/20 rounded-lg">
            <h4 className="text-sm font-semibold text-white mb-3">Impact Analysis</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">{primaryMarket} Movement</span>
                <span className={`text-lg font-bold ${impactData.primary_change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {impactData.primary_change >= 0 ? '+' : ''}{impactData.primary_change.toFixed(2)}%
                </span>
              </div>
              <div className="h-0.5 bg-white/10"></div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Estimated {secondaryMarket} Change</span>
                <span className={`text-lg font-bold ${impactData.estimated_secondary_change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {impactData.estimated_secondary_change >= 0 ? '+' : ''}{impactData.estimated_secondary_change.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="p-4 bg-white/10 border border-white/20 rounded-lg">
            <h4 className="text-sm font-semibold text-white mb-2">Analysis</h4>
            <p className="text-sm text-gray-300">{impactData.description}</p>
          </div>
        </motion.div>
      )}

      {!impactData && !isLoading && (
        <div className="text-center py-8 text-gray-400">
          <p className="text-sm">Select markets and price change, then click analyze</p>
        </div>
      )}
    </motion.div>
  );
}
