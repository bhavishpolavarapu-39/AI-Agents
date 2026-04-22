'use client';

export default function AlertsPanel() {
  const alerts = [
    { id: 1, name: 'High CPU Usage', service: 'API Gateway', severity: 'high' },
    { id: 2, name: 'Disk Space Low', service: 'Cache', severity: 'medium' },
  ];

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
      <h2 className="text-lg font-semibold mb-4 text-slate-100">Active Alerts ({alerts.length})</h2>
      <div className="space-y-2">
        {alerts.map((alert) => (
          <div key={alert.id} className="bg-slate-700/50 p-3 rounded border-l-4 border-orange-500">
            <div className="font-semibold text-slate-200">{alert.name}</div>
            <div className="text-sm text-slate-400">{alert.service}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
