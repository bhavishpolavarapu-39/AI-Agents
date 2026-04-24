'use client';

import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';

interface Device {
  id: string;
  name: string;
  type: 'light' | 'thermostat' | 'lock' | 'camera' | 'plug';
  status: 'on' | 'off' | 'unavailable';
  battery_percent?: number;
  current_state: string;
}

export default function DeviceControlGrid() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/halo/devices');
        const data = await response.json();
        setDevices(data || []);
      } catch (error) {
        console.error('Failed to fetch devices:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDevices();
  }, []);

  const toggleDevice = async (deviceId: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/halo/devices/${deviceId}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const updated = await response.json();
        setDevices(devices.map((d) => (d.id === deviceId ? updated : d)));
      }
    } catch (error) {
      console.error('Failed to toggle device:', error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, type: 'spring' } },
  };

  return (
    <div className="bg-slate-900 rounded-lg border border-blue-900/50 p-6">
      <h2 className="text-lg font-bold text-blue-300 mb-4">Smart Devices</h2>

      {isLoading ? (
        <div className="text-slate-400">Loading devices...</div>
      ) : (
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {devices.length === 0 ? (
            <div className="col-span-full text-slate-500 text-center py-8">No devices found</div>
          ) : (
            devices.map((device) => (
              <motion.button
                key={device.id}
                variants={itemVariants}
                onClick={() => toggleDevice(device.id)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  device.status === 'on'
                    ? 'border-green-500 bg-green-500/10'
                    : device.status === 'off'
                    ? 'border-slate-600 bg-slate-800/50'
                    : 'border-red-500 bg-red-500/10'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-xl font-bold mb-2">[D]</div>
                <div className="font-semibold text-sm mb-1">{device.name}</div>
                <div className="text-xs text-slate-400 mb-1">{device.type}</div>
                <div
                  className={`text-xs font-mono ${
                    device.status === 'on'
                      ? 'text-green-400'
                      : device.status === 'off'
                      ? 'text-slate-400'
                      : 'text-red-400'
                  }`}
                >
                  {device.status.toUpperCase()}
                </div>
                {device.battery_percent !== undefined && (
                  <div className="text-xs text-slate-500 mt-1">Battery: {device.battery_percent}%</div>
                )}
              </motion.button>
            ))
          )}
        </motion.div>
      )}
    </div>
  );
}
