'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function StockSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/apex/search/stocks?query=${query}&limit=10`);
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('Search failed:', error);
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
        <h3 className="text-2xl font-bold text-white mb-2">Stock & Crypto Search</h3>
        <p className="text-sm text-slate-500">Search global securities across all major exchanges</p>
      </div>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search symbol or company name..."
          className="flex-1 bg-slate-800/50 border border-green-900/30 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-green-500/50"
        />
        <motion.button
          onClick={handleSearch}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isLoading}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-slate-700 disabled:to-slate-700 text-white font-semibold px-6 py-2 rounded-lg transition"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </motion.button>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {results.length === 0 && !isLoading && (
          <p className="text-center text-slate-500 py-8">Enter a symbol to search (e.g., AAPL, GOOGL, BTC)</p>
        )}
        {results.map((result, i) => (
          <motion.div
            key={i}
            className="p-4 bg-slate-800/30 rounded-lg border border-green-900/10 hover:border-green-500/30 transition cursor-pointer"
            whileHover={{ x: 4 }}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold text-white">{result.symbol}</div>
                <div className="text-xs text-slate-400">{result.name}</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-400">${result.price?.toFixed(2) || 'N/A'}</div>
                <div className={`text-sm ${result.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {result.change >= 0 ? '+' : ''}{result.change?.toFixed(2) || '0'}%
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
