'use client';

import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';

interface Risk {
  id: string;
  name: string;
  probability: number;
  impact: number;
  category: string;
  mitigation_status: 'open' | 'in_progress' | 'mitigated';
}

export default function RiskMatrix() {
  const [risks, setRisks] = useState<Risk[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRisks = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/lexis/risks');
        const data = await response.json();
        setRisks(data || []);
      } catch (error) {
        console.error('Failed to fetch risks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRisks();
  }, []);

  const getRiskColor = (probability: number, impact: number) => {
    const score = probability * impact;
    if (score >= 0.6) return { bg: 'bg-red-500/10', border: 'border-red-500', text: 'text-red-400' };
    if (score >= 0.3) return { bg: 'bg-yellow-500/10', border: 'border-yellow-500', text: 'text-yellow-400' };
    return { bg: 'bg-green-500/10', border: 'border-green-500', text: 'text-green-400' };
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.07, delayChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.85 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, type: 'spring' } },
  };

  return (
    <div className="bg-slate-900 rounded-lg border border-amber-900/50 p-6">
      <h2 className="text-lg font-bold text-amber-300 mb-4">Risk Matrix</h2>

      {isLoading ? (
        <div className="text-slate-400">Analyzing risks...</div>
      ) : (
        <motion.div
          className="space-y-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {risks.length === 0 ? (
            <div className="text-slate-500 text-center py-8">No risks identified</div>
          ) : (
            risks.map((risk) => {
              const colors = getRiskColor(risk.probability, risk.impact);
              return (
                <motion.div
                  key={risk.id}
                  variants={itemVariants}
                  className={`border-l-2 ${colors.border} ${colors.bg} rounded px-3 py-2`}
                  whileHover={{ x: 4 }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-sm">{risk.name}</span>
                    <span className={`text-xs px-2 py-1 rounded ${colors.text}`}>
                      {(risk.probability * risk.impact * 100).toFixed(0)}%
                    </span>
                  </div>

                  <div className="text-xs text-slate-400 mb-2">{risk.category}</div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-500">Probability: </span>
                      {(risk.probability * 100).toFixed(0)}%
                    </div>
                    <div>
                      <span className="text-slate-500">Impact: </span>
                      {(risk.impact * 100).toFixed(0)}%
                    </div>
                  </div>

                  <div className="mt-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${
                        risk.mitigation_status === 'mitigated'
                          ? 'bg-green-500/20 text-green-300'
                          : risk.mitigation_status === 'in_progress'
                          ? 'bg-blue-500/20 text-blue-300'
                          : 'bg-red-500/20 text-red-300'
                      }`}
                    >
                      {risk.mitigation_status}
                    </span>
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>
      )}
    </div>
  );
}
