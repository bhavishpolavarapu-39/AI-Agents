'use client';

import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';

interface Campaign {
  id: string;
  name: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  reach: number;
  engagement: number;
  conversion_rate: number;
  roi: number;
  budget_spent: number;
  budget_total: number;
}

export default function CampaignMetrics() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/canvas/campaigns');
        const data = await response.json();
        setCampaigns(data || []);
      } catch (error) {
        console.error('Failed to fetch campaigns:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const getStatusColor = (status: string) => {
    const colors = {
      draft: { bg: 'bg-slate-500/10', border: 'border-slate-500', text: 'text-slate-400' },
      active: { bg: 'bg-green-500/10', border: 'border-green-500', text: 'text-green-400' },
      paused: { bg: 'bg-yellow-500/10', border: 'border-yellow-500', text: 'text-yellow-400' },
      completed: { bg: 'bg-blue-500/10', border: 'border-blue-500', text: 'text-blue-400' },
    };
    return colors[status as keyof typeof colors] || colors.draft;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="bg-slate-900 rounded-lg border border-pink-900/50 p-6">
      <h2 className="text-lg font-bold text-pink-300 mb-4">Active Campaigns</h2>

      {isLoading ? (
        <div className="text-slate-400">Loading campaigns...</div>
      ) : (
        <motion.div
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {campaigns.length === 0 ? (
            <div className="text-slate-500 text-center py-8">No campaigns</div>
          ) : (
            campaigns.map((campaign) => {
              const statusColor = getStatusColor(campaign.status);
              const budgetPercent = (campaign.budget_spent / campaign.budget_total) * 100;

              return (
                <motion.div
                  key={campaign.id}
                  variants={itemVariants}
                  className={`border-l-2 ${statusColor.border} ${statusColor.bg} rounded px-4 py-3`}
                  whileHover={{ x: 4 }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{campaign.name}</div>
                      <span className={`inline-block text-xs px-2 py-1 rounded mt-1 ${statusColor.text}`}>
                        {campaign.status}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-pink-400">{campaign.roi.toFixed(0)}%</div>
                      <div className="text-xs text-slate-400">ROI</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs mb-3 text-slate-400">
                    <div>
                      <span className="text-slate-500">Reach: </span>
                      {(campaign.reach / 1000).toFixed(1)}k
                    </div>
                    <div>
                      <span className="text-slate-500">Engagement: </span>
                      {campaign.engagement.toFixed(1)}%
                    </div>
                    <div>
                      <span className="text-slate-500">Conv: </span>
                      {campaign.conversion_rate.toFixed(2)}%
                    </div>
                  </div>

                  <div className="flex gap-2 items-center">
                    <div className="flex-1">
                      <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                        <motion.div
                          className="h-full bg-pink-400"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: Math.min(budgetPercent / 100, 1) }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          style={{ originX: 0 }}
                        />
                      </div>
                    </div>
                    <div className="text-xs text-slate-500 whitespace-nowrap">
                      ${campaign.budget_spent.toFixed(0)}/${campaign.budget_total.toFixed(0)}
                    </div>
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
