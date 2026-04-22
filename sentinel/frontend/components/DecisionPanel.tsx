'use client';

import { useState } from 'react';

export default function DecisionPanel({ incident }: any) {
  const [approving, setApproving] = useState(false);

  const handleApprove = async () => {
    setApproving(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/sentinel/incidents/${incident.incident_id}/approve`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ approved: true })
        }
      );
      console.log('Approved:', await response.json());
    } catch (err) {
      console.error(err);
    } finally {
      setApproving(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
      <h2 className="text-lg font-semibold mb-4 text-slate-100">Decision Panel</h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-300 mb-2">Incident</h3>
          <p className="text-slate-400">{incident.incident_id}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-300 mb-2">Root Cause</h3>
          <p className="text-slate-400">{incident.root_cause}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-300 mb-2">Affected Users</h3>
          <p className="text-slate-400">{incident.affected_users || 0}</p>
        </div>
        <button
          onClick={handleApprove}
          disabled={approving}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded transition disabled:opacity-50"
        >
          {approving ? 'Approving...' : 'Approve & Execute'}
        </button>
      </div>
    </div>
  );
}
