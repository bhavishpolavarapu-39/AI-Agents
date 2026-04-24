'use client';

import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';

interface Node {
  id: string;
  label: string;
  type: 'hypothesis' | 'research' | 'literature' | 'experiment';
  connections: number;
}

export default function KnowledgeGraph() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/lumina/knowledge-graph');
        const data = await response.json();
        setNodes(data || []);
      } catch (error) {
        console.error('Failed to fetch knowledge graph:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNodes();
  }, []);

  const getTypeColor = (type: string) => {
    const colors = {
      hypothesis: '#7C3AED',
      research: '#06B6D4',
      literature: '#1E40AF',
      experiment: '#7C3AED',
    };
    return colors[type as keyof typeof colors] || '#06B6D4';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, type: 'spring' } },
  };

  return (
    <div className="bg-slate-900 rounded-lg border border-purple-900/50 p-6">
      <h2 className="text-lg font-bold text-purple-300 mb-4">Knowledge Graph</h2>

      {isLoading ? (
        <div className="text-slate-400">Building knowledge graph...</div>
      ) : (
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {nodes.length === 0 ? (
            <div className="text-slate-500 col-span-full text-center py-8">No nodes yet</div>
          ) : (
            nodes.map((node) => (
              <motion.div
                key={node.id}
                variants={itemVariants}
                className="bg-slate-800 border border-purple-900/30 rounded p-3 hover:border-purple-500/50 transition"
                whileHover={{ scale: 1.05 }}
              >
                <div
                  className="w-3 h-3 rounded-full mb-2"
                  style={{ backgroundColor: getTypeColor(node.type) }}
                />
                <div className="text-sm font-semibold text-slate-100 mb-1">{node.label}</div>
                <div className="text-xs text-slate-500">{node.connections} connections</div>
              </motion.div>
            ))
          )}
        </motion.div>
      )}
    </div>
  );
}
