'use client';

import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';

interface SupplyNode {
  id: string;
  name: string;
  type: 'supplier' | 'warehouse' | 'distributor' | 'customer';
  inventory_level: number;
  lead_time_days: number;
  status: 'active' | 'at_risk' | 'delayed';
}

export default function SupplyChainFlow() {
  const [nodes, setNodes] = useState<SupplyNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSupplyChain = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/nexus/supply-chain');
        const data = await response.json();
        setNodes(data || []);
      } catch (error) {
        console.error('Failed to fetch supply chain:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSupplyChain();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return { bg: 'bg-green-500/10', border: 'border-green-500', text: 'text-green-400' };
      case 'at_risk':
        return { bg: 'bg-yellow-500/10', border: 'border-yellow-500', text: 'text-yellow-400' };
      case 'delayed':
        return { bg: 'bg-red-500/10', border: 'border-red-500', text: 'text-red-400' };
      default:
        return { bg: 'bg-slate-500/10', border: 'border-slate-500', text: 'text-slate-400' };
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="bg-slate-900 rounded-lg border border-blue-900/50 p-6">
      <h2 className="text-lg font-bold text-blue-300 mb-4">Supply Chain Network</h2>

      {isLoading ? (
        <div className="text-slate-400">Mapping supply chain...</div>
      ) : (
        <motion.div
          className="space-y-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {nodes.length === 0 ? (
            <div className="text-slate-500 text-center py-8">No supply nodes</div>
          ) : (
            nodes.map((node) => {
              const colors = getStatusColor(node.status);
              return (
                <motion.div
                  key={node.id}
                  variants={itemVariants}
                  className={`border-l-2 ${colors.border} ${colors.bg} rounded px-3 py-2`}
                  whileHover={{ x: 4 }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-semibold text-sm">{node.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {node.type.replace(/_/g, ' ').toUpperCase()}
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded font-mono ${colors.text}`}>
                      {node.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-500">Inventory: </span>
                      {node.inventory_level}%
                    </div>
                    <div>
                      <span className="text-slate-500">Lead: </span>
                      {node.lead_time_days}d
                    </div>
                  </div>

                  <div className="w-full bg-slate-700 rounded-full h-1.5 mt-2 overflow-hidden">
                    <motion.div
                      className="h-full bg-blue-400"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: node.inventory_level / 100 }}
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
