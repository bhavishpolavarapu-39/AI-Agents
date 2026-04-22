'use client';

import { useState, useEffect } from 'react';

export default function IncidentTimeline({ onSelectIncident }: any) {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/sentinel/incidents')
      .then(res => res.json())
      .then(data => setIncidents(data.incidents))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
      <h2 className="text-lg font-semibold mb-4 text-slate-100">Recent Incidents</h2>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {incidents.map((incident: any) => (
          <div
            key={incident.incident_id}
            onClick={() => onSelectIncident(incident)}
            className="cursor-pointer bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded p-3 transition"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-slate-200">{incident.incident_id}</span>
              <span className={`text-xs px-2 py-1 rounded font-semibold ${
                incident.severity === 'critical' ? 'bg-red-900 text-red-200' :
                incident.severity === 'high' ? 'bg-orange-900 text-orange-200' :
                'bg-yellow-900 text-yellow-200'
              }`}>
                {incident.severity}
              </span>
            </div>
            <p className="text-sm text-slate-300">{incident.service}</p>
            <p className="text-xs text-slate-500 mt-1">{incident.root_cause}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
