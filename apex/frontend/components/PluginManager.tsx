'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Plugin {
  id: string;
  name: string;
  description: string;
  active: boolean;
}

export default function PluginManager() {
  const [plugins, setPlugins] = useState<Plugin[]>([
    { id: 'rebalancer', name: 'Portfolio Rebalancer', description: 'Optimize allocation', active: true },
    { id: 'risk_analyzer', name: 'Risk Analyzer', description: 'Analyze risk metrics', active: true },
    { id: 'tax_optimizer', name: 'Tax Optimizer', description: 'Tax loss harvesting', active: true },
    { id: 'market_watcher', name: 'Market Watcher', description: 'Market alerts', active: true },
  ]);
  const [activePlugin, setActivePlugin] = useState<string | null>(null);
  const [pluginResult, setPluginResult] = useState<any>(null);

  const runPlugin = async (pluginId: string) => {
    setActivePlugin(pluginId);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/apex/plugins/${pluginId}/run`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Plugin error');
      const data = await response.json();
      setPluginResult(data);
    } catch (error) {
      setPluginResult({ error: 'Backend not available' });
    }
  };

  return (
    <motion.div
      className="bg-slate-900 rounded-lg border border-green-900/50 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-lg font-bold text-green-300 mb-4">Smart Plugins</h2>

      <div className="space-y-3">
        {plugins.map((plugin) => (
          <motion.div
            key={plugin.id}
            className={`p-3 rounded border cursor-pointer ${plugin.active ? 'border-green-500/50 bg-green-500/10 hover:bg-green-500/20' : 'border-slate-700'}`}
            whileHover={{ x: 4 }}
            onClick={() => plugin.active && runPlugin(plugin.id)}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold text-sm text-green-400">{plugin.name}</div>
                <div className="text-xs text-slate-400">{plugin.description}</div>
              </div>
              {plugin.active && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>}
            </div>

            {activePlugin === plugin.id && pluginResult && (
              <motion.div className="mt-3 pt-3 border-t border-green-900/50 text-xs text-slate-300">
                {pluginResult.result && <p>✓ {pluginResult.result}</p>}
                {pluginResult.recommendations && (
                  <ul className="mt-2 space-y-1">
                    {pluginResult.recommendations.map((rec: string, i: number) => (
                      <li key={i}>• {rec}</li>
                    ))}
                  </ul>
                )}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
