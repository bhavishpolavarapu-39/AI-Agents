'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change_percent: number;
  market: string;
}

interface MarketInfo {
  status: string;
  hours: string;
}

type FilterType = 'top_gainers' | 'top_losers' | 'top_stocks';

const MOCK_STOCKS: Record<string, Stock[]> = {
  'NYSE': [
    { symbol: 'AAPL', name: 'Apple Inc', price: 195.42, change_percent: 2.45, market: 'NYSE' },
    { symbol: 'MSFT', name: 'Microsoft Corp', price: 417.89, change_percent: 1.82, market: 'NYSE' },
    { symbol: 'GOOGL', name: 'Alphabet Inc', price: 156.72, change_percent: -1.23, market: 'NYSE' },
    { symbol: 'AMZN', name: 'Amazon.com Inc', price: 189.45, change_percent: 3.56, market: 'NYSE' },
    { symbol: 'NVDA', name: 'NVIDIA Corp', price: 875.32, change_percent: 4.12, market: 'NYSE' },
    { symbol: 'TSLA', name: 'Tesla Inc', price: 242.18, change_percent: -2.34, market: 'NYSE' },
    { symbol: 'META', name: 'Meta Platforms', price: 478.56, change_percent: 1.45, market: 'NYSE' },
    { symbol: 'JPM', name: 'JPMorgan Chase', price: 189.23, change_percent: 0.89, market: 'NYSE' },
  ],
  'NASDAQ': [
    { symbol: 'QCOM', name: 'Qualcomm Inc', price: 189.45, change_percent: 2.78, market: 'NASDAQ' },
    { symbol: 'AMD', name: 'Advanced Micro Devices', price: 156.34, change_percent: 3.45, market: 'NASDAQ' },
    { symbol: 'INTC', name: 'Intel Corporation', price: 52.89, change_percent: -1.56, market: 'NASDAQ' },
    { symbol: 'NFLX', name: 'Netflix Inc', price: 234.56, change_percent: 2.12, market: 'NASDAQ' },
    { symbol: 'CSCO', name: 'Cisco Systems', price: 47.23, change_percent: 1.34, market: 'NASDAQ' },
    { symbol: 'ADBE', name: 'Adobe Inc', price: 492.34, change_percent: 0.76, market: 'NASDAQ' },
  ],
  'NSE': [
    { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2845.75, change_percent: 1.25, market: 'NSE' },
    { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3456.50, change_percent: 2.43, market: 'NSE' },
    { symbol: 'INFY', name: 'Infosys Limited', price: 1876.45, change_percent: 1.89, market: 'NSE' },
    { symbol: 'WIPRO', name: 'Wipro Limited', price: 423.45, change_percent: -0.45, market: 'NSE' },
    { symbol: 'HDFC', name: 'HDFC Bank', price: 1652.30, change_percent: 3.12, market: 'NSE' },
    { symbol: 'SBIN', name: 'State Bank of India', price: 612.45, change_percent: 2.56, market: 'NSE' },
  ],
  'BSE': [
    { symbol: 'SENSEX', name: 'BSE Sensex Index', price: 73856.45, change_percent: 0.95, market: 'BSE' },
    { symbol: 'BAJAJFINSV', name: 'Bajaj Financial Services', price: 1923.45, change_percent: 2.34, market: 'BSE' },
    { symbol: 'MARUTI', name: 'Maruti Suzuki India', price: 11234.56, change_percent: 1.67, market: 'BSE' },
    { symbol: 'LT', name: 'Larsen & Toubro', price: 3245.67, change_percent: 2.89, market: 'BSE' },
    { symbol: 'ITC', name: 'ITC Limited', price: 456.78, change_percent: -0.56, market: 'BSE' },
  ],
  'LSE': [
    { symbol: 'FTSE', name: 'FTSE 100 Index', price: 7684.23, change_percent: 0.67, market: 'LSE' },
    { symbol: 'BP', name: 'BP PLC', price: 456.78, change_percent: 1.45, market: 'LSE' },
    { symbol: 'UNILEVER', name: 'Unilever PLC', price: 3456.89, change_percent: 2.12, market: 'LSE' },
  ],
};

export default function MarketFilterBar() {
  const [selectedMarket, setSelectedMarket] = useState('NYSE');
  const [filterType, setFilterType] = useState<FilterType>('top_stocks');
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(false);

  const markets = ['NYSE', 'NASDAQ', 'NSE', 'BSE', 'LSE', 'TSE', 'HKEX', 'DAX'];

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

  useEffect(() => {
    loadStocks();
  }, [selectedMarket, filterType]);

  const loadStocks = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    let marketStocks = MOCK_STOCKS[selectedMarket] || MOCK_STOCKS['NYSE'];

    if (filterType === 'top_gainers') {
      marketStocks = [...marketStocks].sort((a, b) => b.change_percent - a.change_percent).slice(0, 5);
    } else if (filterType === 'top_losers') {
      marketStocks = [...marketStocks].sort((a, b) => a.change_percent - b.change_percent).slice(0, 5);
    } else {
      marketStocks = [...marketStocks].sort((a, b) => b.price - a.price).slice(0, 8);
    }

    setStocks(marketStocks);
    setLoading(false);
  };

  const info = marketInfo[selectedMarket] || { status: 'closed', hours: '' };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Market Selector */}
      <div>
        <label className="text-sm font-semibold text-white mb-3 block">Select Market</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {markets.map((market) => (
            <motion.button
              key={market}
              onClick={() => setSelectedMarket(market)}
              className={`p-3 rounded-lg border transition text-center font-medium ${
                selectedMarket === market
                  ? 'border-white/40 bg-white/20 text-white'
                  : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-sm font-bold">{market}</div>
              <div className={`w-2 h-2 rounded-full mx-auto mt-1 ${
                info.status === 'open' ? 'bg-green-500' : 'bg-yellow-500'
              }`}></div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Filter Options */}
      <div>
        <label className="text-sm font-semibold text-white mb-3 block">Filter by</label>
        <div className="flex gap-2">
          {[
            { id: 'top_gainers' as FilterType, label: 'Top Gainers' },
            { id: 'top_losers' as FilterType, label: 'Top Losers' },
            { id: 'top_stocks' as FilterType, label: 'Top Stocks' },
          ].map((filter) => (
            <motion.button
              key={filter.id}
              onClick={() => setFilterType(filter.id)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                filterType === filter.id
                  ? 'border-white/40 bg-white/20 text-white'
                  : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {filter.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Stocks List */}
      <div className="liquid-glass border border-white/20 rounded-xl p-6 backdrop-blur">
        <h3 className="text-lg font-bold text-white mb-4">
          {filterType === 'top_gainers' ? 'Top Gainers' : filterType === 'top_losers' ? 'Top Losers' : 'Top Stocks'} in {selectedMarket}
        </h3>

        {loading ? (
          <div className="text-center py-8">
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {stocks.length > 0 ? (
              stocks.map((stock) => (
                <motion.div
                  key={stock.symbol}
                  className="p-3 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 transition"
                  whileHover={{ x: 4 }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-bold text-white">{stock.symbol}</div>
                      <div className="text-xs text-gray-400">{stock.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-white">${stock.price.toFixed(2)}</div>
                      <div className={`text-sm font-semibold ${stock.change_percent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {stock.change_percent >= 0 ? '+' : ''}{stock.change_percent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">No stocks found</div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
