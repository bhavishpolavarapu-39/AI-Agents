'use client';

export default function ServiceHealth() {
  const services = [
    { name: 'API Gateway', status: 'healthy', latency: 45, error: 0.01, uptime: 99.95 },
    { name: 'Database', status: 'healthy', latency: 12, error: 0.0, uptime: 99.99 },
    { name: 'Cache', status: 'degraded', latency: 250, error: 0.05, uptime: 98.5 },
  ];

  const getStatusColor = (status: string) => {
    if (status === 'healthy') return 'bg-green-900/20 border-green-700';
    if (status === 'degraded') return 'bg-yellow-900/20 border-yellow-700';
    return 'bg-red-900/20 border-red-700';
  };

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
      <h2 className="text-lg font-semibold mb-4 text-slate-100">System Health</h2>
      <div className="space-y-3">
        {services.map((service) => (
          <div key={service.name} className={`rounded p-3 border ${getStatusColor(service.status)}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-slate-200">{service.name}</span>
              <span className={`text-xs px-2 py-1 rounded ${
                service.status === 'healthy' ? 'bg-green-900 text-green-200' :
                service.status === 'degraded' ? 'bg-yellow-900 text-yellow-200' :
                'bg-red-900 text-red-200'
              }`}>
                {service.status}
              </span>
            </div>
            <div className="text-xs text-slate-400 space-y-1">
              <p>Latency P99: {service.latency}ms</p>
              <p>Error Rate: {(service.error * 100).toFixed(2)}%</p>
              <p>Uptime: {service.uptime.toFixed(2)}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
