'use client';

import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';

interface JourneyStage {
  id: string;
  name: string;
  stage_number: number;
  satisfaction_score: number;
  completion_rate: number;
  pain_points: number;
  sentiment: 'positive' | 'neutral' | 'negative';
}

export default function CustomerJourneyMap() {
  const [stages, setStages] = useState<JourneyStage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJourney = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/compass/customer-journey');
        const data = await response.json();
        setStages(data || []);
      } catch (error) {
        console.error('Failed to fetch customer journey:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJourney();
  }, []);

  const getSentimentColor = (sentiment: string) => {
    const colors = {
      positive: { bg: 'bg-green-500/10', border: 'border-green-500', text: 'text-green-400' },
      neutral: { bg: 'bg-yellow-500/10', border: 'border-yellow-500', text: 'text-yellow-400' },
      negative: { bg: 'bg-red-500/10', border: 'border-red-500', text: 'text-red-400' },
    };
    return colors[sentiment as keyof typeof colors] || colors.neutral;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="bg-slate-900 rounded-lg border border-purple-900/50 p-6">
      <h2 className="text-lg font-bold text-purple-300 mb-4">Customer Journey</h2>

      {isLoading ? (
        <div className="text-slate-400">Mapping customer journey...</div>
      ) : (
        <motion.div
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {stages.length === 0 ? (
            <div className="text-slate-500 text-center py-8">No journey data</div>
          ) : (
            stages.map((stage) => {
              const sentimentColor = getSentimentColor(stage.sentiment);
              return (
                <motion.div
                  key={stage.id}
                  variants={itemVariants}
                  className={`border-l-4 ${sentimentColor.border} ${sentimentColor.bg} rounded px-4 py-3`}
                  whileHover={{ x: 4 }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="bg-slate-800 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                        <span className="font-bold text-sm text-purple-300">{stage.stage_number}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{stage.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${sentimentColor.text}`}>
                        {stage.satisfaction_score.toFixed(1)}
                      </div>
                      <div className="text-xs text-slate-400">/ 10</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs mb-3 text-slate-400">
                    <div>
                      <span className="text-slate-500">Completion: </span>
                      {stage.completion_rate.toFixed(0)}%
                    </div>
                    <div>
                      <span className="text-slate-500">Pain Points: </span>
                      {stage.pain_points}
                    </div>
                    <div>
                      <span className={`text-xs px-2 py-0.5 rounded ${sentimentColor.text}`}>
                        {stage.sentiment.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className={`h-full ${
                        stage.sentiment === 'positive'
                          ? 'bg-green-500'
                          : stage.sentiment === 'neutral'
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: stage.completion_rate / 100 }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      style={{ originX: 0 }}
                    />
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
