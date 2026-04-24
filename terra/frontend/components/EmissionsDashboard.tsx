'use client';

import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';

interface EmissionSource {
  id: string;
  source: string;
  category: 'energy' | 'transport' | 'waste' | 'operations';
  current_emissions: number;
  target_emissions: number;
  unit: string;
  reduction_percent: number;
}

export default function EmissionsDashboard() {
  const [sources, setSources] = useState<EmissionSource[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEmissions = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/terra/emissions');
        const data = await response.json();
        setSources(data || []);
      } catch (error) {
        console.error('Failed to fetch emissions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmissions();
  }, []);

  const getCategoryColor = (category: string) => {
    const colors = {
      energy: { text: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500' },
      transport: { text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500' },
      waste: { text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500' },
      operations: { text: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500' },
    };
    return colors[category as keyof typeof colors] || colors.energy;
  };

  const totalCurrent = sources.reduce((sum, s) => sum + s.current_emissions, 0);
  const totalTarget = sources.reduce((sum, s) => sum + s.target_emissions, 0);
  const overallReduction = totalCurrent > 0 ? ((totalCurrent - totalTarget) / totalCurrent) * 100 : 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="bg-slate-900 rounded-lg border border-green-900/50 p-6">
      <h2 className="text-lg font-bold text-green-300 mb-4">Emissions Tracking</h2>

      {isLoading ? (
        <div className="text-slate-400">Loading emissions data...</div>
      ) : (
        <>
          <motion.div className="bg-slate-800/50 rounded p-4 mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-xs text-slate-400 mb-2">Overall Reduction Target</div>
            <div className="flex items-end gap-4">
              <div>
                <div className="text-3xl font-bold text-green-400">{overallReduction.toFixed(1)}%</div>
              </div>
              <div className="flex-1">
                <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className="h-full bg-green-500"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: (overallReduction / 50) }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    style={{ originX: 0 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="space-y-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {sources.length === 0 ? (
              <div className="text-slate-500 text-center py-8">No emission sources</div>
            ) : (
              sources.map((source) => {
                const categoryColor = getCategoryColor(source.category);
                const reduction = ((source.current_emissions - source.target_emissions) / source.current_emissions) * 100;

                return (
                  <motion.div
                    key={source.id}
                    variants={itemVariants}
                    className={`border-l-2 ${categoryColor.border} ${categoryColor.bg} rounded px-3 py-2`}
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-semibold text-sm">{source.source}</div>
                        <span className={`text-xs px-2 py-1 rounded mt-1 ${categoryColor.text}`}>
                          {source.category}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-green-400">{reduction.toFixed(1)}%</div>
                        <div className="text-xs text-slate-400">Reduced</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs mb-2 text-slate-400">
                      <div>Current: {source.current_emissions.toFixed(2)} {source.unit}</div>
                      <div>Target: {source.target_emissions.toFixed(2)} {source.unit}</div>
                    </div>

                    <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
                      <motion.div
                        className="h-full bg-green-500"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: Math.min((source.target_emissions / source.current_emissions) * 1.2, 1) }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        style={{ originX: 0 }}
                      />
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        </>
      )}
    </div>
  );
}
