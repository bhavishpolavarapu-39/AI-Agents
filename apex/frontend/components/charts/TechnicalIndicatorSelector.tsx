'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Indicator {
  id: string;
  name: string;
  description: string;
  category: 'trend' | 'momentum' | 'volatility';
  periods: number[];
  selected: boolean;
  selectedPeriods: number[];
}

const ALL_INDICATORS: Record<string, Omit<Indicator, 'selected' | 'selectedPeriods'>> = {
  sma: {
    id: 'sma',
    name: 'Simple Moving Average (SMA)',
    description: 'Average price over N periods - identifies trend direction',
    category: 'trend',
    periods: [5, 10, 20, 50, 100, 200],
  },
  ema: {
    id: 'ema',
    name: 'Exponential Moving Average (EMA)',
    description: 'Weighted average giving more importance to recent prices',
    category: 'trend',
    periods: [5, 10, 12, 26, 50, 200],
  },
  rsi: {
    id: 'rsi',
    name: 'Relative Strength Index (RSI)',
    description: 'Momentum oscillator (0-100) - identifies overbought (>70) and oversold (<30)',
    category: 'momentum',
    periods: [14, 21],
  },
  macd: {
    id: 'macd',
    name: 'MACD (Moving Average Convergence Divergence)',
    description: 'Trend-following momentum indicator using two moving averages',
    category: 'momentum',
    periods: [12, 26, 9],
  },
  bbands: {
    id: 'bbands',
    name: 'Bollinger Bands',
    description: 'Volatility bands around moving average - shows support/resistance levels',
    category: 'volatility',
    periods: [20],
  },
  atr: {
    id: 'atr',
    name: 'Average True Range (ATR)',
    description: 'Volatility indicator measuring average price movement range',
    category: 'volatility',
    periods: [14],
  },
  adx: {
    id: 'adx',
    name: 'Average Directional Index (ADX)',
    description: 'Measures trend strength without indicating direction',
    category: 'trend',
    periods: [14],
  },
  stoch: {
    id: 'stoch',
    name: 'Stochastic Oscillator',
    description: 'Momentum indicator (0-100) - identifies overbought (>80) and oversold (<20)',
    category: 'momentum',
    periods: [14, 3, 3],
  },
};

interface TechnicalIndicatorSelectorProps {
  onIndicatorsChange: (indicators: string[]) => void;
}

export default function TechnicalIndicatorSelector({ onIndicatorsChange }: TechnicalIndicatorSelectorProps) {
  const [indicators, setIndicators] = useState<Record<string, Indicator>>({});
  const [expandedCategory, setExpandedCategory] = useState<'trend' | 'momentum' | 'volatility' | null>(null);
  const [showPanel, setShowPanel] = useState(false);

  const handleToggleIndicator = (indicatorId: string) => {
    setIndicators((prev) => {
      const newIndicators = { ...prev };
      if (newIndicators[indicatorId]) {
        delete newIndicators[indicatorId];
      } else {
        const baseIndicator = ALL_INDICATORS[indicatorId];
        newIndicators[indicatorId] = {
          ...baseIndicator,
          selected: true,
          selectedPeriods: baseIndicator.periods.length === 1 ? baseIndicator.periods : [baseIndicator.periods[0]],
        };
      }
      onIndicatorsChange(Object.keys(newIndicators));
      return newIndicators;
    });
  };

  const handleTogglePeriod = (indicatorId: string, period: number) => {
    setIndicators((prev) => {
      const newIndicators = { ...prev };
      if (newIndicators[indicatorId]) {
        const selectedPeriods = newIndicators[indicatorId].selectedPeriods;
        if (selectedPeriods.includes(period)) {
          newIndicators[indicatorId].selectedPeriods = selectedPeriods.filter((p) => p !== period);
        } else {
          newIndicators[indicatorId].selectedPeriods = [...selectedPeriods, period].sort((a, b) => a - b);
        }
      }
      return newIndicators;
    });
  };

  const categories = ['trend', 'momentum', 'volatility'] as const;

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition flex items-center gap-2"
      >
        <span>📊 Indicators</span>
        <span className={`text-xs bg-white/20 px-2 py-1 rounded ${Object.keys(indicators).length > 0 ? 'bg-green-500/30' : ''}`}>
          {Object.keys(indicators).length}
        </span>
      </button>

      {/* Indicator Panel */}
      <AnimatePresence>
        {showPanel && (
          <motion.div
            className="absolute top-12 right-0 w-96 max-h-96 bg-slate-900/95 border border-white/20 rounded-xl p-4 backdrop-blur overflow-y-auto z-50"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
          >
            <h3 className="text-lg font-bold text-white mb-4">Technical Indicators</h3>

            {/* Selected Indicators Summary */}
            {Object.keys(indicators).length > 0 && (
              <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <p className="text-xs text-green-400 font-semibold mb-2">
                  {Object.keys(indicators).length} Indicator{Object.keys(indicators).length !== 1 ? 's' : ''} Selected
                </p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(indicators).map(([id, indicator]) => (
                    <div key={id} className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded flex items-center gap-1">
                      <span>{indicator.name.split('(')[0].trim()}</span>
                      <button
                        onClick={() => handleToggleIndicator(id)}
                        className="ml-1 text-green-400 hover:text-red-400 font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Category Tabs */}
            <div className="flex gap-2 mb-4 border-b border-white/10 pb-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
                  className={`px-3 py-1.5 rounded text-xs font-semibold transition capitalize ${
                    expandedCategory === category
                      ? 'bg-white text-black'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Indicators by Category */}
            <div className="space-y-3">
              {categories.map((category) => {
                const categoryIndicators = Object.values(ALL_INDICATORS).filter((ind) => ind.category === category);

                return (
                  <div key={category}>
                    {(expandedCategory === null || expandedCategory === category) && (
                      <motion.div className="space-y-2" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                        {categoryIndicators.map((indicator) => {
                          const isSelected = !!indicators[indicator.id];
                          return (
                            <motion.div
                              key={indicator.id}
                              className={`p-3 rounded-lg border transition cursor-pointer ${
                                isSelected
                                  ? 'bg-blue-500/20 border-blue-500/50'
                                  : 'bg-white/5 border-white/10 hover:bg-white/10'
                              }`}
                              onClick={() => handleToggleIndicator(indicator.id)}
                              whileHover={{ scale: 1.02 }}
                            >
                              <div className="flex items-start gap-2 mb-2">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => {}}
                                  className="mt-1 w-4 h-4 rounded cursor-pointer"
                                />
                                <div className="flex-1">
                                  <p className="font-semibold text-white text-sm">{indicator.name}</p>
                                  <p className="text-xs text-gray-400">{indicator.description}</p>
                                </div>
                              </div>

                              {/* Period Selection */}
                              {isSelected && (
                                <motion.div
                                  className="ml-6 mt-2 pt-2 border-t border-white/10"
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                >
                                  <p className="text-xs text-gray-400 mb-2">Periods:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {indicator.periods.map((period) => (
                                      <button
                                        key={period}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleTogglePeriod(indicator.id, period);
                                        }}
                                        className={`px-2 py-1 rounded text-xs font-semibold transition ${
                                          indicators[indicator.id]?.selectedPeriods.includes(period)
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                        }`}
                                      >
                                        {period}
                                      </button>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer Info */}
            <div className="mt-4 pt-3 border-t border-white/10">
              <p className="text-xs text-gray-400">
                💡 Combine multiple indicators for better analysis. Trend indicators show direction, momentum indicators show speed, and volatility indicators show range.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
