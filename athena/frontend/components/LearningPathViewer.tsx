'use client';

import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';

interface LearningMilestone {
  id: string;
  title: string;
  description: string;
  progress_percent: number;
  completed: boolean;
  estimated_days: number;
}

export default function LearningPathViewer() {
  const [milestones, setMilestones] = useState<LearningMilestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLearningPath = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/athena/learning-path');
        const data = await response.json();
        setMilestones(data || []);
      } catch (error) {
        console.error('Failed to fetch learning path:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLearningPath();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="bg-slate-900 rounded-lg border border-purple-900/50 p-6">
      <h2 className="text-lg font-bold text-purple-300 mb-4">Learning Path</h2>

      {isLoading ? (
        <div className="text-slate-400">Loading learning path...</div>
      ) : (
        <motion.div
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {milestones.length === 0 ? (
            <div className="text-slate-500 text-center py-8">No learning path assigned</div>
          ) : (
            milestones.map((milestone) => (
              <motion.div
                key={milestone.id}
                variants={itemVariants}
                className={`border-l-4 ${
                  milestone.completed
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-purple-500 bg-purple-500/10'
                } rounded px-4 py-3`}
                layout
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-semibold text-sm">{milestone.title}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{milestone.description}</div>
                  </div>
                  {milestone.completed ? (
                    <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-300 font-mono">
                      DONE
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-300 font-mono">
                      {milestone.estimated_days}d
                    </span>
                  )}
                </div>

                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className={`h-full ${milestone.completed ? 'bg-green-500' : 'bg-purple-400'}`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: milestone.progress_percent / 100 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    style={{ originX: 0 }}
                  />
                </div>

                <div className="text-xs text-slate-500 mt-2">{milestone.progress_percent}% complete</div>
              </motion.div>
            ))
          )}
        </motion.div>
      )}
    </div>
  );
}
