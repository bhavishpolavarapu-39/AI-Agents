'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function CorrelationMatrix() {
  const [matrix, setMatrix] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMarket, setSelectedMarket] = useState(null);

  useEffect(() => {
    const fetchMatrix = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/api/apex/market-correlation/matrix`);
        const data = await response.json();
        setMatrix(data.correlation_matrix || {});
      } catch (error) {
        console.error('Failed to fetch correlation matrix:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMatrix();
  }, []);

  const getColor = (value) => {
    if (value > 0.7) return '#10b981';
    if (value > 0.5) return '#34d399';
    if (value > 0) return '#6ee7b7';
    if (value > -0.3) return '#94a3b8';
    if (value > -0.5) return '#fbbf24';
    return '#ef4444';
  };

  const markets = Object.keys(matrix);

  if (isLoading) {
    return (
      <motion.div
        className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 rounded-2xl border border-green-900/20 p-6 backdrop-blur"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center py-8">
          <div className="w-8 h-8 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400 mt-3">Loading correlation matrix...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 rounded-2xl border border-green-900/20 p-6 backdrop-blur"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">Market Correlation Matrix</h3>
        <p className="text-sm text-slate-500">How global markets move together (-1 to +1)</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr>
              <th className="px-2 py-2 text-left text-slate-400"></th>
              {markets.map((market) => (
                <th key={market} className="px-3 py-2 text-center text-slate-400 font-medium cursor-pointer hover:text-green-400" onClick={() => setSelectedMarket(selectedMarket === market ? null : market)}>
                  {market}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {markets.map((market1) => (
              <tr key={market1} className={selectedMarket === market1 ? 'bg-green-500/10' : ''}>
                <td className="px-2 py-2 text-slate-400 font-medium">{market1}</td>
                {markets.map((market2) => {
                  const value = matrix[market1]?.[market2] || 0;
                  const isSelected = selectedMarket === market1 || selectedMarket === market2;
                  return (
                    <motion.td
                      key={`${market1}-${market2}`}
                      className={`px-3 py-2 text-center text-white font-medium rounded transition ${isSelected ? 'ring-2 ring-green-500' : ''}`}
                      style={{ backgroundColor: getColor(value), opacity: isSelected ? 1 : 0.7 }}
                      whileHover={{ scale: 1.1, opacity: 1 }}
                      title={`${market1} - ${market2}: ${value.toFixed(2)}`}
                    >
                      {value.toFixed(2)}
                    </motion.td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-green-900/20">
        <h4 className="text-sm font-semibold text-green-400 mb-2">Key Insights</h4>
        <ul className="text-xs text-slate-300 space-y-1">
          <li>• Strong synchronization between developed markets</li>
          <li>• NSE-S&P500: 0.64 - India-US sync</li>
          <li>• NSE-BSE: 0.92 - Domestic market correlation</li>
        </ul>
      </div>
    </motion.div>
  );
}
