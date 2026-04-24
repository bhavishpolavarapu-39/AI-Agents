'use client';

import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';

interface Holdings {
  id: string;
  symbol: string;
  name: string;
  shares: number;
  current_price: number;
  total_value: number;
  gain_loss: number;
  gain_loss_percent: number;
  allocation_percent: number;
}

export default function PortfolioSummary() {
  const [holdings, setHoldings] = useState<Holdings[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHoldings = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/apex/holdings');
        const data = await response.json();
        setHoldings(data || []);
      } catch (error) {
        console.error('Failed to fetch holdings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHoldings();
  }, []);

  const totalValue = holdings.reduce((sum, h) => sum + h.total_value, 0);
  const totalGainLoss = holdings.reduce((sum, h) => sum + h.gain_loss, 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="bg-slate-900 rounded-lg border border-green-900/50 p-6">
      <h2 className="text-lg font-bold text-green-300 mb-4">Portfolio Holdings</h2>

      {isLoading ? (
        <div className="text-slate-400">Loading portfolio...</div>
      ) : (
        <>
          <motion.div className="grid grid-cols-2 gap-4 mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-slate-800/50 rounded p-3">
              <div className="text-xs text-slate-400 mb-1">Total Value</div>
              <div className="text-2xl font-bold text-green-400">${totalValue.toFixed(2)}</div>
            </div>
            <div className="bg-slate-800/50 rounded p-3">
              <div className="text-xs text-slate-400 mb-1">Total Gain/Loss</div>
              <div className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ${totalGainLoss.toFixed(2)}
              </div>
            </div>
          </motion.div>

          <motion.div
            className="space-y-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {holdings.length === 0 ? (
              <div className="text-slate-500 text-center py-8">No holdings</div>
            ) : (
              holdings.map((holding) => (
                <motion.div
                  key={holding.id}
                  variants={itemVariants}
                  className={`border-l-2 ${
                    holding.gain_loss_percent >= 0
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-red-500 bg-red-500/10'
                  } rounded px-3 py-2`}
                  whileHover={{ x: 4 }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-semibold text-sm">{holding.name}</div>
                      <div className="text-xs text-slate-400">{holding.symbol}</div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-sm font-bold ${
                          holding.gain_loss_percent >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {holding.gain_loss_percent >= 0 ? '[+]' : '[-]'}{holding.gain_loss_percent.toFixed(2)}%
                      </div>
                      <div className="text-xs text-slate-400">${holding.current_price.toFixed(2)}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs mb-2 text-slate-400">
                    <div>Shares: {holding.shares}</div>
                    <div>Value: ${holding.total_value.toFixed(2)}</div>
                  </div>

                  <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      className="h-full bg-green-400"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: (holding.allocation_percent / 100) * 1.5 }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      style={{ originX: 0 }}
                    />
                  </div>

                  <div className="text-xs text-slate-500 mt-1">{holding.allocation_percent.toFixed(1)}% allocation</div>
                </motion.div>
              ))
            )}
          </motion.div>
        </>
      )}
    </div>
  );
}
