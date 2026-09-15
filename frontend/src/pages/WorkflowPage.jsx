import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const MOCK_WORKFLOW = [
  { proposal_id: 'd1', stage_name: 'State Officer Approval', proposal_number: 'PROP/CHN/2024/002', project_name: 'Chennai Peripheral Ring Road', urgency: 'urgent', deadline: '2024-04-10T17:00:00Z', status: 'pending', submitted_by_name: 'Meenakshi Rajan' },
  { proposal_id: 'd2', stage_name: 'District Collector Review', proposal_number: 'PROP/CHN/2024/003', project_name: 'Port Road Corridor', urgency: 'normal', deadline: '2024-04-20T17:00:00Z', status: 'pending', submitted_by_name: 'Kumaran Selvam' },
];

export default function WorkflowPage() {
  const [items, setItems] = useState(MOCK_WORKFLOW);

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Workflow Queue</div>
          <div className="section-subtitle">Pending approvals and actions in your queue</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {['Pending', 'In Review', 'Completed'].map((s, i) => (
          <div key={s} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 36, fontWeight: 800, color: ['#f59e0b','#3b82f6','#10b981'][i] }}>
              {i === 0 ? items.filter(x => x.status === 'pending').length : i === 1 ? 1 : 4}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{s}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-title mb-4">Pending Actions</div>
        {items.map((item, i) => {
          const overdue = new Date(item.deadline) < new Date();
          return (
            <div key={i} style={{ display: 'flex', gap: 16, padding: 16, background: 'var(--bg-card-2)', borderRadius: 10, border: `1px solid ${overdue ? 'rgba(239,68,68,0.3)' : 'var(--border)'}`, marginBottom: 12, alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{item.stage_name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.proposal_number} · {item.project_name}</div>
                <div style={{ fontSize: 11, marginTop: 4 }}>
                  <span style={{ color: overdue ? 'var(--color-danger)' : 'var(--text-muted)' }}>
                    {overdue ? '⚠ OVERDUE' : '⏰ Due'}: {new Date(item.deadline).toLocaleDateString('en-IN')}
                  </span>
                  <span style={{ marginLeft: 12 }}>Submitted by: {item.submitted_by_name}</span>
                </div>
              </div>
              <span className={`badge badge-${item.urgency === 'urgent' ? 'high' : 'low'}`}>{item.urgency?.toUpperCase()}</span>
              <div className="flex gap-2">
                <button className="btn btn-sm" style={{ background: 'rgba(16,185,129,0.15)', color: '#6ee7b7', border: 'none' }}>✓ Approve</button>
                <button className="btn btn-sm btn-danger">✗ Reject</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
