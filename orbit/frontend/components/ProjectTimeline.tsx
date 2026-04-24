'use client';

import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';

interface Task {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assigned_to: string;
  due_date: string;
  completion_percent: number;
}

export default function ProjectTimeline() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/orbit/tasks');
        const data = await response.json();
        setTasks(data || []);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: { bg: 'bg-blue-500/10', border: 'border-blue-500', text: 'text-blue-400' },
      medium: { bg: 'bg-yellow-500/10', border: 'border-yellow-500', text: 'text-yellow-400' },
      high: { bg: 'bg-orange-500/10', border: 'border-orange-500', text: 'text-orange-400' },
      critical: { bg: 'bg-red-500/10', border: 'border-red-500', text: 'text-red-400' },
    };
    return colors[priority as keyof typeof colors] || colors.low;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="bg-slate-900 rounded-lg border border-blue-900/50 p-6">
      <h2 className="text-lg font-bold text-blue-300 mb-4">Project Timeline</h2>

      {isLoading ? (
        <div className="text-slate-400">Loading tasks...</div>
      ) : (
        <motion.div
          className="space-y-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {tasks.length === 0 ? (
            <div className="text-slate-500 text-center py-8">No tasks scheduled</div>
          ) : (
            tasks.map((task) => {
              const priorityColor = getPriorityColor(task.priority);
              return (
                <motion.div
                  key={task.id}
                  variants={itemVariants}
                  className={`border-l-2 ${priorityColor.border} ${priorityColor.bg} rounded px-3 py-2`}
                  whileHover={{ x: 4 }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-sm">{task.title}</span>
                    <span className={`text-xs px-2 py-1 rounded font-mono ${priorityColor.text}`}>
                      {task.priority}
                    </span>
                  </div>

                  <div className="text-xs text-slate-400 mb-2">
                    [STATUS] Assigned to: {task.assigned_to}
                  </div>

                  <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden mb-1">
                    <motion.div
                      className="h-full bg-blue-400"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: task.completion_percent / 100 }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      style={{ originX: 0 }}
                    />
                  </div>

                  <div className="text-xs text-slate-500">
                    {task.completion_percent}% | Due: {new Date(task.due_date).toLocaleDateString()}
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
