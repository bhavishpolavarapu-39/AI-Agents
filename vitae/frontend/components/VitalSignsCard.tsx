'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface VitalSign {
  name: string;
  value: number;
  unit: string;
  normal_range: [number, number];
  status: 'normal' | 'warning' | 'critical';
}

interface VitalSignsCardProps {
  vitals: VitalSign[];
  isLoading?: boolean;
}

export default function VitalSignsCard({ vitals, isLoading = false }: VitalSignsCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500' };
      case 'warning':
        return { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500' };
      case 'critical':
        return { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500' };
      default:
        return { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500' };
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="bg-slate-900 rounded-lg border border-green-900/50 p-6">
      <h2 className="text-lg font-bold text-green-300 mb-4">Vital Signs</h2>

      {isLoading ? (
        <div className="text-slate-400">Loading vital signs...</div>
      ) : (
        <motion.div
          className="space-y-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {vitals.map((vital) => {
            const colors = getStatusColor(vital.status);
            const percentage = ((vital.value - vital.normal_range[0]) / (vital.normal_range[1] - vital.normal_range[0])) * 100;

            return (
              <motion.div
                key={vital.name}
                variants={itemVariants}
                className={`border-l-2 ${colors.border} ${colors.bg} rounded px-3 py-2`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-sm">{vital.name}</span>
                  <span className={`text-sm font-bold ${colors.text}`}>
                    {vital.value} {vital.unit}
                  </span>
                </div>

                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className={`h-full ${
                      vital.status === 'normal'
                        ? 'bg-green-500'
                        : vital.status === 'warning'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: Math.min(percentage / 100, 1) }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    style={{ originX: 0 }}
                  />
                </div>

                <div className="text-xs text-slate-500 mt-1">
                  Normal: {vital.normal_range[0]} - {vital.normal_range[1]} {vital.unit}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
