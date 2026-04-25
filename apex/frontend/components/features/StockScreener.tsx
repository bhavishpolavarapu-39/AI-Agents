'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface ScreenerStock {
  symbol: string;
  name: string;
  price: number;
  pe: number;
  pb: number;
  dividend: number;
  roe: number;
  debtToEquity: number;
  eps: number;
  revenue: number;
  margin: number;
  change: number;
}

const ALL_STOCKS: ScreenerStock[] = [
  { symbol: 'AAPL', name: 'Apple Inc', price: 195.42, pe: 28.5, pb: 42.5, dividend: 0.92, roe: 89.5, debtToEquity: 1.84, eps: 6.84, revenue: 394.3, margin: 26.3, change: 2.26 },
  { symbol: 'MSFT', name: 'Microsoft', price: 417.89, pe: 32.1, pb: 12.8, dividend: 0.68, roe: 42.3, debtToEquity: 0.62, eps: 13.02, revenue: 198.3, margin: 42.1, change: 1.85 },
  { symbol: 'GOOGL', name: 'Alphabet', price: 156.72, pe: 25.2, pb: 5.2, dividend: 0, roe: 18.2, debtToEquity: 0.06, eps: 6.22, revenue: 282.8, margin: 22.5, change: -1.23 },
  { symbol: 'NVDA', name: 'NVIDIA', price: 875.32, pe: 65.3, pb: 45.2, dividend: 0, roe: 85.4, debtToEquity: 0.45, eps: 13.38, revenue: 60.9, margin: 52.1, change: 4.31 },
  { symbol: 'JPM', name: 'JPMorgan', price: 189.23, pe: 12.3, pb: 1.2, dividend: 3.2, roe: 15.8, debtToEquity: 8.5, eps: 15.41, revenue: 122.9, margin: 31.2, change: 0.90 },
  { symbol: 'TSLA', name: 'Tesla', price: 242.18, pe: 68.2, pb: 8.5, dividend: 0, roe: 22.5, debtToEquity: 0.14, eps: 3.55, revenue: 81.5, margin: 16.8, change: -2.28 },
  { symbol: 'JNJ', name: 'Johnson & Johnson', price: 156.45, pe: 15.8, pb: 3.2, dividend: 2.7, roe: 21.3, debtToEquity: 0.35, eps: 9.89, revenue: 94.9, margin: 21.4, change: 1.45 },
  { symbol: 'WMT', name: 'Walmart', price: 84.32, pe: 26.5, pb: 8.2, dividend: 1.5, roe: 14.2, debtToEquity: 0.62, eps: 3.18, revenue: 611.3, margin: 2.8, change: 0.78 },
];

type FilterKey = 'pe' | 'pb' | 'dividend' | 'roe' | 'margin' | 'debtToEquity';

interface Filters {
  peMin: number;
  peMax: number;
  pbMin: number;
  pbMax: number;
  dividendMin: number;
  roeMin: number;
  marginMin: number;
  debtToEquityMax: number;
}

export default function StockScreener() {
  const [filters, setFilters] = useState<Filters>({
    peMin: 0,
    peMax: 100,
    pbMin: 0,
    pbMax: 50,
    dividendMin: 0,
    roeMin: 0,
    marginMin: 0,
    debtToEquityMax: 10,
  });

  const filteredStocks = ALL_STOCKS.filter(stock =>
    stock.pe >= filters.peMin &&
    stock.pe <= filters.peMax &&
    stock.pb >= filters.pbMin &&
    stock.pb <= filters.pbMax &&
    stock.dividend >= filters.dividendMin &&
    stock.roe >= filters.roeMin &&
    stock.margin >= filters.marginMin &&
    stock.debtToEquity <= filters.debtToEquityMax
  );

  const updateFilter = (key: keyof Filters, value: number) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <motion.div
      className="liquid-glass border border-white/20 rounded-xl p-6 backdrop-blur"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <h3 className="text-2xl font-bold text-white mb-6">Stock Screener</h3>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 pb-6 border-b border-white/10">
        <div>
          <label className="text-xs font-semibold text-gray-400 block mb-2">P/E Ratio: {filters.peMin.toFixed(0)} - {filters.peMax.toFixed(0)}</label>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={filters.peMin}
            onChange={e => updateFilter('peMin', parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-400 block mb-2">P/B Ratio: {filters.pbMin.toFixed(1)} - {filters.pbMax.toFixed(1)}</label>
          <input
            type="range"
            min="0"
            max="50"
            step="0.1"
            value={filters.pbMin}
            onChange={e => updateFilter('pbMin', parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-400 block mb-2">Dividend Yield: {filters.dividendMin.toFixed(2)}%+</label>
          <input
            type="range"
            min="0"
            max="10"
            step="0.1"
            value={filters.dividendMin}
            onChange={e => updateFilter('dividendMin', parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-400 block mb-2">ROE: {filters.roeMin.toFixed(1)}%+</label>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={filters.roeMin}
            onChange={e => updateFilter('roeMin', parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-400 block mb-2">Profit Margin: {filters.marginMin.toFixed(1)}%+</label>
          <input
            type="range"
            min="0"
            max="60"
            step="0.5"
            value={filters.marginMin}
            onChange={e => updateFilter('marginMin', parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-400 block mb-2">Debt/Equity: {filters.debtToEquityMax.toFixed(2)}-</label>
          <input
            type="range"
            min="0"
            max="10"
            step="0.1"
            value={filters.debtToEquityMax}
            onChange={e => updateFilter('debtToEquityMax', parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Results */}
      <div className="mb-4">
        <p className="text-sm text-gray-400">Found <span className="text-white font-bold">{filteredStocks.length}</span> stocks matching your criteria</p>
      </div>

      {/* Stock List */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-3 py-2 text-left text-gray-400 font-semibold">Symbol</th>
              <th className="px-3 py-2 text-right text-gray-400 font-semibold">Price</th>
              <th className="px-3 py-2 text-right text-gray-400 font-semibold">P/E</th>
              <th className="px-3 py-2 text-right text-gray-400 font-semibold">P/B</th>
              <th className="px-3 py-2 text-right text-gray-400 font-semibold">Div%</th>
              <th className="px-3 py-2 text-right text-gray-400 font-semibold">ROE</th>
              <th className="px-3 py-2 text-right text-gray-400 font-semibold">Margin</th>
              <th className="px-3 py-2 text-right text-gray-400 font-semibold">D/E</th>
              <th className="px-3 py-2 text-right text-gray-400 font-semibold">Score</th>
            </tr>
          </thead>
          <tbody>
            {filteredStocks.map((stock, index) => {
              const score = Math.min(100,
                (100 - Math.min(stock.pe, 50)) * 0.3 +
                (100 - Math.min(stock.pb, 50)) * 0.2 +
                Math.min(stock.roe, 50) * 0.2 +
                Math.min(stock.margin, 50) * 0.2 +
                Math.min(stock.dividend, 5) * 0.1
              );

              return (
                <motion.tr
                  key={stock.symbol}
                  className="border-b border-white/5 hover:bg-white/5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <td className="px-3 py-2">
                    <div className="font-bold text-white">{stock.symbol}</div>
                    <div className="text-gray-500 text-xs">{stock.name}</div>
                  </td>
                  <td className="px-3 py-2 text-right font-semibold text-white">${stock.price.toFixed(2)}</td>
                  <td className="px-3 py-2 text-right text-gray-300">{stock.pe.toFixed(1)}</td>
                  <td className="px-3 py-2 text-right text-gray-300">{stock.pb.toFixed(1)}</td>
                  <td className="px-3 py-2 text-right text-green-400">{stock.dividend.toFixed(2)}%</td>
                  <td className="px-3 py-2 text-right text-gray-300">{stock.roe.toFixed(1)}%</td>
                  <td className="px-3 py-2 text-right text-gray-300">{stock.margin.toFixed(1)}%</td>
                  <td className="px-3 py-2 text-right text-gray-300">{stock.debtToEquity.toFixed(2)}</td>
                  <td className="px-3 py-2 text-right">
                    <div className="inline-block bg-white/10 border border-white/20 rounded px-2 py-1 font-bold text-white">{score.toFixed(0)}</div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredStocks.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          No stocks match your criteria. Try adjusting the filters.
        </div>
      )}
    </motion.div>
  );
}
