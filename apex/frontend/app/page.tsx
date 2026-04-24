'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PortfolioSummary from '@/components/PortfolioSummary';
import ChatAgent from '@/components/ChatAgent';
import PluginManager from '@/components/PluginManager';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl opacity-10 animate-pulse delay-1000"></div>
      </div>

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 border-b border-green-900/20 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
                APEX
              </h1>
              <p className="text-xs text-slate-500 font-medium tracking-wide">Portfolio Intelligence System</p>
            </motion.div>
            <motion.div
              className="flex gap-3 items-center"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-right">
                <div className="text-sm font-semibold text-green-400">AI Agent</div>
                <div className="text-xs text-slate-500">Ready</div>
              </div>
              <motion.div
                className="w-3 h-3 bg-green-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              ></motion.div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Hero Stats Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <StatCard label="Total Value" value="$47,926" change="+8.3%" positive />
          <StatCard label="Holdings" value="4" change="Tech Heavy" neutral />
          <StatCard label="Sharpe Ratio" value="0.95" change="Balanced" positive />
          <StatCard label="Max Drawdown" value="-8.2%" change="Managed" neutral />
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Portfolio & Chat */}
          <div className="lg:col-span-2 space-y-6">
            {/* Portfolio Holdings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <PortfolioSummary />
            </motion.div>

            {/* AI Chat */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <ChatAgent />
            </motion.div>
          </div>

          {/* Right Column - Plugins & Info */}
          <div className="space-y-6">
            {/* Plugins */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <PluginManager />
            </motion.div>

            {/* Quick Info Card */}
            <motion.div
              className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-green-900/30 rounded-xl p-6 backdrop-blur"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h3 className="text-lg font-bold text-green-300 mb-4">Market Insights</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">YTD Return</span>
                  <span className="text-green-400 font-semibold">+8.3%</span>
                </div>
                <div className="h-px bg-green-900/20"></div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Portfolio Beta</span>
                  <span className="text-slate-300 font-semibold">1.12</span>
                </div>
                <div className="h-px bg-green-900/20"></div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Diversification</span>
                  <span className="text-emerald-400 font-semibold">Excellent</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, change, positive, neutral }: any) {
  return (
    <motion.div
      className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-green-900/20 rounded-xl p-4 backdrop-blur hover:border-green-900/40 transition-all"
      whileHover={{ scale: 1.02, borderColor: 'rgba(52, 211, 153, 0.4)' }}
    >
      <div className="text-xs text-slate-500 font-medium mb-2">{label}</div>
      <div className="text-2xl font-bold text-white mb-2">{value}</div>
      <div className={`text-xs font-medium ${positive ? 'text-green-400' : neutral ? 'text-slate-400' : 'text-red-400'}`}>
        {change}
      </div>
    </motion.div>
  );
}
