'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface WatchlistItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: string;
  pe: number;
}

const MOCK_WATCHLIST: WatchlistItem[] = [
  { symbol: 'AAPL', name: 'Apple Inc', price: 195.42, change: 4.32, changePercent: 2.26, volume: 52.3, marketCap: '3.1T', pe: 28.5 },
  { symbol: 'GOOGL', name: 'Alphabet Inc', price: 156.72, change: -1.95, changePercent: -1.23, volume: 21.5, marketCap: '1.6T', pe: 25.2 },
  { symbol: 'MSFT', name: 'Microsoft', price: 417.89, change: 7.62, changePercent: 1.85, volume: 18.9, marketCap: '3.1T', pe: 32.1 },
  { symbol: 'NVDA', name: 'NVIDIA', price: 875.32, change: 36.11, changePercent: 4.31, volume: 35.2, marketCap: '2.2T', pe: 65.3 },
  { symbol: 'TSLA', name: 'Tesla', price: 242.18, change: -5.67, changePercent: -2.28, volume: 142.3, marketCap: '768B', pe: 68.2 },
];

const ALL_STOCKS: WatchlistItem[] = [
  ...MOCK_WATCHLIST,
  { symbol: 'META', name: 'Meta', price: 478.56, change: 6.95, changePercent: 1.47, volume: 15.2, marketCap: '1.2T', pe: 22.8 },
  { symbol: 'AMZN', name: 'Amazon', price: 189.45, change: 6.73, changePercent: 3.68, volume: 45.1, marketCap: '1.9T', pe: 58.9 },
  { symbol: 'JPM', name: 'JPMorgan', price: 189.23, change: 1.69, changePercent: 0.90, volume: 8.5, marketCap: '524B', pe: 12.3 },
];

type SortBy = 'symbol' | 'change' | 'price' | 'marketCap';

export default function Watchlist() {
  const [items, setItems] = useState<WatchlistItem[]>(MOCK_WATCHLIST);
  const [showAddModal, setShowAddModal] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy>('symbol');

  const addToWatchlist = (stock: WatchlistItem) => {
    if (!items.find(i => i.symbol === stock.symbol)) {
      setItems([...items, stock]);
    }
    setShowAddModal(false);
  };

  const removeFromWatchlist = (symbol: string) => {
    setItems(items.filter(i => i.symbol !== symbol));
  };

  const sortedItems = [...items].sort((a, b) => {
    switch (sortBy) {
      case 'symbol':
        return a.symbol.localeCompare(b.symbol);
      case 'change':
        return b.changePercent - a.changePercent;
      case 'price':
        return b.price - a.price;
      case 'marketCap':
        return parseInt(b.marketCap) - parseInt(a.marketCap);
      default:
        return 0;
    }
  });

  return (
    <motion.div
      className="liquid-glass border border-white/20 rounded-xl p-6 backdrop-blur"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-white">My Watchlist</h3>
          <button
            onClick={() => setShowAddModal(!showAddModal)}
            className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100"
          >
            + Add Stock
          </button>
        </div>

        {/* Sort Controls */}
        <div className="flex gap-2">
          {(['symbol', 'change', 'price', 'marketCap'] as SortBy[]).map(sort => (
            <button
              key={sort}
              onClick={() => setSortBy(sort)}
              className={`px-3 py-1 rounded text-xs font-medium transition ${
                sortBy === sort
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {sort === 'marketCap' ? 'Market Cap' : sort.charAt(0).toUpperCase() + sort.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Add Stock Modal */}
      {showAddModal && (
        <motion.div
          className="mb-6 p-4 bg-white/10 border border-white/20 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h4 className="text-white font-semibold mb-3">Add to Watchlist</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {ALL_STOCKS.filter(s => !items.find(i => i.symbol === s.symbol)).map(stock => (
              <button
                key={stock.symbol}
                onClick={() => addToWatchlist(stock)}
                className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-left transition"
              >
                <div className="font-bold text-white">{stock.symbol}</div>
                <div className="text-xs text-gray-400">{stock.name}</div>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Watchlist Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-4 py-3 text-left text-gray-400 font-semibold">Symbol</th>
              <th className="px-4 py-3 text-right text-gray-400 font-semibold">Price</th>
              <th className="px-4 py-3 text-right text-gray-400 font-semibold">Change</th>
              <th className="px-4 py-3 text-right text-gray-400 font-semibold">% Change</th>
              <th className="px-4 py-3 text-right text-gray-400 font-semibold">Market Cap</th>
              <th className="px-4 py-3 text-right text-gray-400 font-semibold">P/E</th>
              <th className="px-4 py-3 text-center text-gray-400 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedItems.map((item, index) => (
              <motion.tr
                key={item.symbol}
                className="border-b border-white/5 hover:bg-white/5 transition"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <td className="px-4 py-3">
                  <div className="font-bold text-white">{item.symbol}</div>
                  <div className="text-xs text-gray-400">{item.name}</div>
                </td>
                <td className="px-4 py-3 text-right font-semibold text-white">${item.price.toFixed(2)}</td>
                <td className={`px-4 py-3 text-right font-semibold ${item.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}
                </td>
                <td className={`px-4 py-3 text-right font-semibold ${item.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                </td>
                <td className="px-4 py-3 text-right text-gray-300">{item.marketCap}</td>
                <td className="px-4 py-3 text-right text-gray-300">{item.pe.toFixed(1)}</td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => removeFromWatchlist(item.symbol)}
                    className="text-red-400 hover:text-red-300 text-xs font-medium"
                  >
                    Remove
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stats */}
      <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-xs text-gray-400">Total Watched</p>
          <p className="text-lg font-bold text-white">{items.length}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Avg Change</p>
          <p className={`text-lg font-bold ${items.reduce((sum, i) => sum + i.changePercent, 0) / items.length >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {(items.reduce((sum, i) => sum + i.changePercent, 0) / items.length).toFixed(2)}%
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Gainers</p>
          <p className="text-lg font-bold text-green-400">{items.filter(i => i.changePercent > 0).length}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Losers</p>
          <p className="text-lg font-bold text-red-400">{items.filter(i => i.changePercent < 0).length}</p>
        </div>
      </div>
    </motion.div>
  );
}
