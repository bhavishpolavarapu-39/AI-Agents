'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Alert {
  id: string;
  symbol: string;
  type: 'price' | 'volume' | 'technical' | 'news';
  condition: string;
  threshold: string;
  status: 'active' | 'triggered' | 'inactive';
  dateCreated: string;
  lastTriggered?: string;
}

const EXISTING_ALERTS: Alert[] = [
  {
    id: '1',
    symbol: 'AAPL',
    type: 'price',
    condition: 'Price crosses above',
    threshold: '$200',
    status: 'active',
    dateCreated: '5 days ago',
  },
  {
    id: '2',
    symbol: 'MSFT',
    type: 'price',
    condition: 'Price drops below',
    threshold: '$400',
    status: 'triggered',
    dateCreated: '3 days ago',
    lastTriggered: '2 hours ago',
  },
  {
    id: '3',
    symbol: 'GOOGL',
    type: 'volume',
    condition: 'Volume exceeds',
    threshold: '50M shares',
    status: 'active',
    dateCreated: '1 week ago',
  },
  {
    id: '4',
    symbol: 'NVDA',
    type: 'technical',
    condition: 'RSI above',
    threshold: '70 (overbought)',
    status: 'active',
    dateCreated: '10 days ago',
  },
  {
    id: '5',
    symbol: 'TSLA',
    type: 'news',
    condition: 'Negative news detected',
    threshold: 'Sentiment < 30',
    status: 'inactive',
    dateCreated: '2 weeks ago',
  },
];

export default function AlertsSystem() {
  const [alerts, setAlerts] = useState<Alert[]>(EXISTING_ALERTS);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'active' | 'triggered' | 'inactive'>('active');
  const [newAlert, setNewAlert] = useState({
    symbol: 'AAPL',
    type: 'price' as const,
    condition: 'Price crosses above',
    threshold: '',
  });

  const filteredAlerts = filterType === 'all' ? alerts : alerts.filter(a => a.status === filterType);

  const handleCreateAlert = () => {
    if (!newAlert.threshold) return;

    const alert: Alert = {
      id: Math.random().toString(),
      symbol: newAlert.symbol,
      type: newAlert.type,
      condition: newAlert.condition,
      threshold: newAlert.threshold,
      status: 'active',
      dateCreated: 'just now',
    };

    setAlerts([alert, ...alerts]);
    setShowCreateModal(false);
    setNewAlert({
      symbol: 'AAPL',
      type: 'price',
      condition: 'Price crosses above',
      threshold: '',
    });
  };

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  const toggleAlert = (id: string) => {
    setAlerts(alerts.map(a =>
      a.id === id
        ? { ...a, status: a.status === 'active' ? 'inactive' : 'active' }
        : a
    ));
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'price':
        return '💰';
      case 'volume':
        return '📊';
      case 'technical':
        return '📈';
      case 'news':
        return '📰';
      default:
        return '🔔';
    }
  };

  const getAlertColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 border-green-500/30 text-green-400';
      case 'triggered':
        return 'bg-red-500/10 border-red-500/30 text-red-400';
      case 'inactive':
        return 'bg-gray-500/10 border-gray-500/30 text-gray-400';
      default:
        return 'bg-white/10 border-white/20 text-white';
    }
  };

  const triggerredCount = alerts.filter(a => a.status === 'triggered').length;
  const activeCount = alerts.filter(a => a.status === 'active').length;

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="liquid-glass border border-white/20 rounded-xl p-6 backdrop-blur">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Alert Management</h3>
            <p className="text-gray-400">Create and manage price, volume, technical, and news alerts</p>
          </div>
          <button
            onClick={() => setShowCreateModal(!showCreateModal)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            + New Alert
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-gray-400 mb-1">Total Alerts</p>
            <p className="text-2xl font-bold text-white">{alerts.length}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Active</p>
            <p className="text-2xl font-bold text-green-400">{activeCount}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Triggered</p>
            <p className="text-2xl font-bold text-red-400">{triggerredCount}</p>
          </div>
        </div>
      </div>

      {/* Create Alert Modal */}
      {showCreateModal && (
        <motion.div
          className="liquid-glass border border-white/20 rounded-xl p-6 backdrop-blur bg-gradient-to-r from-blue-500/10 to-transparent"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h4 className="text-lg font-bold text-white mb-4">Create New Alert</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Symbol Input */}
            <div>
              <label className="text-xs text-gray-400 block mb-2">Stock Symbol</label>
              <input
                type="text"
                value={newAlert.symbol}
                onChange={(e) => setNewAlert({ ...newAlert, symbol: e.target.value.toUpperCase() })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/40"
                placeholder="AAPL"
              />
            </div>

            {/* Alert Type */}
            <div>
              <label className="text-xs text-gray-400 block mb-2">Alert Type</label>
              <select
                value={newAlert.type}
                onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value as any })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40"
              >
                <option value="price">Price Alert</option>
                <option value="volume">Volume Alert</option>
                <option value="technical">Technical Alert</option>
                <option value="news">News Alert</option>
              </select>
            </div>

            {/* Condition */}
            <div>
              <label className="text-xs text-gray-400 block mb-2">Condition</label>
              <select
                value={newAlert.condition}
                onChange={(e) => setNewAlert({ ...newAlert, condition: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40"
              >
                <option value="Price crosses above">Price crosses above</option>
                <option value="Price drops below">Price drops below</option>
                <option value="Volume exceeds">Volume exceeds</option>
                <option value="RSI above">RSI above</option>
                <option value="RSI below">RSI below</option>
                <option value="MACD crossover">MACD crossover</option>
                <option value="Negative news detected">Negative news detected</option>
              </select>
            </div>

            {/* Threshold */}
            <div>
              <label className="text-xs text-gray-400 block mb-2">Threshold Value</label>
              <input
                type="text"
                value={newAlert.threshold}
                onChange={(e) => setNewAlert({ ...newAlert, threshold: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/40"
                placeholder="e.g., $200, 50M, 70"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCreateAlert}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition"
            >
              Create Alert
            </button>
            <button
              onClick={() => setShowCreateModal(false)}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Filter Buttons */}
      <div className="flex gap-2">
        {(['all', 'active', 'triggered', 'inactive'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setFilterType(filter)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filterType === filter
                ? 'bg-white text-black'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            {filter === 'triggered' ? `Triggered (${triggerredCount})` : filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm">No {filterType !== 'all' ? filterType : ''} alerts</p>
          </div>
        ) : (
          filteredAlerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              className={`liquid-glass border rounded-lg p-4 backdrop-blur ${getAlertColor(alert.status)}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  {/* Icon */}
                  <div className="text-2xl mt-1">{getAlertIcon(alert.type)}</div>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-lg font-bold text-white">{alert.symbol}</p>
                      <span className={`text-xs font-bold px-2 py-1 rounded ${
                        alert.status === 'active'
                          ? 'bg-green-500/30 text-green-300'
                          : alert.status === 'triggered'
                          ? 'bg-red-500/30 text-red-300'
                          : 'bg-gray-500/30 text-gray-300'
                      }`}>
                        {alert.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 mb-1">
                      {alert.condition} {alert.threshold}
                    </p>
                    <div className="flex gap-4 text-xs text-gray-400">
                      <span>Type: {alert.type}</span>
                      <span>Created: {alert.dateCreated}</span>
                      {alert.lastTriggered && <span>Last triggered: {alert.lastTriggered}</span>}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleAlert(alert.id)}
                    className={`px-3 py-1 rounded text-xs font-semibold transition ${
                      alert.status === 'active'
                        ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30'
                        : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                    }`}
                  >
                    {alert.status === 'active' ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    onClick={() => deleteAlert(alert.id)}
                    className="px-3 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded text-xs font-semibold transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Alert Settings */}
      <motion.div
        className="liquid-glass border border-white/20 rounded-xl p-6 backdrop-blur"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h4 className="text-lg font-semibold text-white mb-4">Notification Settings</h4>
        <div className="space-y-4">
          {[
            { label: 'Email Notifications', enabled: true },
            { label: 'Browser Notifications', enabled: true },
            { label: 'Mobile Push Notifications', enabled: false },
            { label: 'SMS Alerts (Premium)', enabled: false },
          ].map((setting) => (
            <div key={setting.label} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
              <p className="text-sm text-gray-300">{setting.label}</p>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={setting.enabled} className="sr-only peer" />
                <div className={`w-11 h-6 rounded-full transition ${setting.enabled ? 'bg-green-600' : 'bg-gray-600'}`}></div>
              </label>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Alert History */}
      <motion.div
        className="liquid-glass border border-white/20 rounded-xl p-6 backdrop-blur"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h4 className="text-lg font-semibold text-white mb-4">Recent Alert Activity</h4>
        <div className="space-y-2">
          {[
            { action: 'MSFT alert triggered', time: '2 hours ago', type: 'price' },
            { action: 'NVDA alert created', time: '10 days ago', type: 'technical' },
            { action: 'GOOGL volume alert triggered', time: '3 days ago', type: 'volume' },
            { action: 'AAPL alert created', time: '5 days ago', type: 'price' },
          ].map((item) => (
            <div key={item.action} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition">
              <div className="flex items-center gap-3">
                <span className="text-lg">{getAlertIcon(item.type)}</span>
                <p className="text-sm text-gray-300">{item.action}</p>
              </div>
              <p className="text-xs text-gray-400">{item.time}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
