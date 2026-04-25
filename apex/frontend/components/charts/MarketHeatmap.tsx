'use client';

import { motion } from 'framer-motion';

interface Sector {
  name: string;
  symbols: string[];
  performance: number;
  volume: number;
  leaders: string[];
  laggards: string[];
}

const SECTOR_DATA: Sector[] = [
  { name: 'Technology', symbols: ['AAPL', 'MSFT', 'GOOGL', 'NVDA', 'META'], performance: 8.5, volume: 2.3, leaders: ['NVDA', 'MSFT'], laggards: ['META'] },
  { name: 'Healthcare', symbols: ['JNJ', 'PFE', 'UNH', 'ABBV'], performance: 3.2, volume: 1.1, leaders: ['UNH'], laggards: ['PFE'] },
  { name: 'Financials', symbols: ['JPM', 'BAC', 'WFC', 'GS'], performance: 2.1, volume: 1.5, leaders: ['JPM'], laggards: ['WFC'] },
  { name: 'Energy', symbols: ['XOM', 'CVX', 'COP'], performance: -1.5, volume: 0.8, leaders: ['CVX'], laggards: ['COP'] },
  { name: 'Consumer', symbols: ['AMZN', 'WMT', 'TGT', 'HD'], performance: 5.3, volume: 1.9, leaders: ['AMZN'], laggards: ['TGT'] },
  { name: 'Industrials', symbols: ['BA', 'CAT', 'LMT', 'GE'], performance: 1.8, volume: 0.9, leaders: ['LMT'], laggards: ['BA'] },
  { name: 'Real Estate', symbols: ['PLD', 'AMT', 'EQIX'], performance: -2.3, volume: 0.6, leaders: ['AMT'], laggards: ['PLD'] },
  { name: 'Utilities', symbols: ['NEE', 'DUK', 'SO'], performance: 0.5, volume: 0.7, leaders: ['NEE'], laggards: ['SO'] },
];

const getHeatmapColor = (performance: number) => {
  if (performance > 10) return '#10b981';
  if (performance > 5) return '#34d399';
  if (performance > 2) return '#6ee7b7';
  if (performance > 0) return '#d1fae5';
  if (performance > -2) return '#fed7aa';
  if (performance > -5) return '#fbda48';
  return '#ef4444';
};

const getTextColor = (performance: number) => {
  return Math.abs(performance) > 5 ? '#000000' : '#ffffff';
};

export default function MarketHeatmap() {
  const maxPerformance = Math.max(...SECTOR_DATA.map(s => s.performance));
  const minPerformance = Math.min(...SECTOR_DATA.map(s => s.performance));
  const avgPerformance = SECTOR_DATA.reduce((sum, s) => sum + s.performance, 0) / SECTOR_DATA.length;
  const totalVolume = SECTOR_DATA.reduce((sum, s) => sum + s.volume, 0);

  const gainers = SECTOR_DATA.filter(s => s.performance > 0).length;
  const losers = SECTOR_DATA.length - gainers;

  return (
    <motion.div
      className="liquid-glass border border-white/20 rounded-xl p-6 backdrop-blur"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white mb-4">Market Sector Heatmap</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-400">Best Sector</p>
            <p className="text-lg font-bold text-green-400">+{maxPerformance.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Worst Sector</p>
            <p className="text-lg font-bold text-red-400">{minPerformance.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Average</p>
            <p className="text-lg font-bold text-white">{avgPerformance.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Gainers/Losers</p>
            <p className="text-lg font-bold"><span className="text-green-400">{gainers}</span>/<span className="text-red-400">{losers}</span></p>
          </div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="space-y-3 mb-6">
        {SECTOR_DATA.map((sector, index) => {
          const bgColor = getHeatmapColor(sector.performance);
          const textColor = getTextColor(sector.performance);

          return (
            <motion.div
              key={sector.name}
              className="rounded-lg overflow-hidden border border-white/10 transition hover:border-white/30"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {/* Sector Header */}
              <div
                className="p-4 transition"
                style={{ backgroundColor: bgColor, color: textColor }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-lg">{sector.name}</h4>
                    <p className="text-xs opacity-75">{sector.symbols.join(', ')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{sector.performance >= 0 ? '+' : ''}{sector.performance.toFixed(1)}%</p>
                    <p className="text-xs opacity-75">Vol: {sector.volume}B</p>
                  </div>
                </div>

                {/* Performance Bar */}
                <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-white/30 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, Math.abs(sector.performance) * 5)}%` }}
                    transition={{ duration: 0.8, delay: index * 0.05 }}
                  ></motion.div>
                </div>
              </div>

              {/* Sector Details */}
              <div className="p-4 bg-white/5 border-t border-white/10">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-2">Leaders</p>
                    <div className="flex flex-wrap gap-1">
                      {sector.leaders.map(leader => (
                        <span
                          key={leader}
                          className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded border border-green-500/30"
                        >
                          {leader}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-2">Laggards</p>
                    <div className="flex flex-wrap gap-1">
                      {sector.laggards.map(laggard => (
                        <span
                          key={laggard}
                          className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded border border-red-500/30"
                        >
                          {laggard}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
        <p className="text-xs font-semibold text-gray-400 mb-3">Performance Scale</p>
        <div className="flex gap-2 flex-wrap">
          {[
            { label: '>10%', color: '#10b981' },
            { label: '5-10%', color: '#34d399' },
            { label: '2-5%', color: '#6ee7b7' },
            { label: '0-2%', color: '#d1fae5' },
            { label: '-2-0%', color: '#fed7aa' },
            { label: '-5--2%', color: '#fbda48' },
            { label: '<-5%', color: '#ef4444' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded border border-white/20"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-xs text-gray-400">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
