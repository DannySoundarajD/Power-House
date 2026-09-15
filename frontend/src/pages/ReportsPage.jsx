import { useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const MOCK_REPORT = [
  { project_code: 'CHN-ARPT-001', name: 'Parandur Greenfield Airport', project_type: 'airport', total_area_ha: 1900, area_acquired_ha: 680, area_possessed_ha: 320, assessed: 1169.25, paid: 624.25, total_parcels: 5, achieved_milestones: 3, total_milestones: 6 },
  { project_code: 'CHN-METR-002', name: 'Chennai Metro Phase 2', project_type: 'metro', total_area_ha: 48.5, area_acquired_ha: 28.6, area_possessed_ha: 22.4, assessed: 802.5, paid: 645.0, total_parcels: 3, achieved_milestones: 4, total_milestones: 5 },
  { project_code: 'CHN-SECR-003', name: 'New TN Secretariat', project_type: 'urban_development', total_area_ha: 12, area_acquired_ha: 10.5, area_possessed_ha: 8, assessed: 0, paid: 0, total_parcels: 0, achieved_milestones: 2, total_milestones: 3 },
  { project_code: 'CHN-NHWY-004', name: 'NH-48 Highway Widening', project_type: 'highway', total_area_ha: 180, area_acquired_ha: 130, area_possessed_ha: 110, assessed: 875.5, paid: 362.0, total_parcels: 0, achieved_milestones: 3, total_milestones: 4 },
  { project_code: 'CHN-PORT-006', name: 'Kamarajar Port Road', project_type: 'port', total_area_ha: 95, area_acquired_ha: 48, area_possessed_ha: 28, assessed: 0, paid: 0, total_parcels: 0, achieved_milestones: 1, total_milestones: 4 },
  { project_code: 'CHN-RING-008', name: 'Peripheral Ring Road', project_type: 'highway', total_area_ha: 310, area_acquired_ha: 140, area_possessed_ha: 80, assessed: 0, paid: 0, total_parcels: 2, achieved_milestones: 1, total_milestones: 4 },
];

const REPORT_TYPES = [
  { id: 'project-summary', label: '📋 Project Summary Report' },
  { id: 'compensation', label: '💰 Compensation Report' },
  { id: 'timeline', label: '📅 Timeline Adherence Report' },
  { id: 'rr-status', label: '🏡 R&R Progress Report' },
];

function downloadCSV(data, filename) {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const csv = [headers.join(','), ...data.map(row => headers.map(h => JSON.stringify(row[h] ?? '')).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  a.click(); URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState('project-summary');
  const [data] = useState(MOCK_REPORT);

  const totalAssessed = data.reduce((a, b) => a + (b.assessed || 0), 0);
  const totalPaid = data.reduce((a, b) => a + (b.paid || 0), 0);

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">MIS Reports</div>
          <div className="section-subtitle">Management Information System — Customizable reports & analytics</div>
        </div>
        <div className="flex gap-3">
          <button className="btn btn-ghost btn-sm" onClick={() => downloadCSV(data, `nlams-report-${Date.now()}.csv`)}>
            📥 Export CSV
          </button>
          <button className="btn btn-primary btn-sm">🖨 Print Report</button>
        </div>
      </div>

      {/* Report Selector */}
      <div className="flex gap-3 mb-6" style={{ flexWrap: 'wrap' }}>
        {REPORT_TYPES.map(r => (
          <button key={r.id} className="btn btn-ghost btn-sm" onClick={() => setSelectedReport(r.id)}
            style={{ background: selectedReport === r.id ? 'var(--bg-card)' : 'transparent',
              border: `1px solid ${selectedReport === r.id ? 'var(--color-primary-light)' : 'var(--border)'}`,
              color: selectedReport === r.id ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
            {r.label}
          </button>
        ))}
      </div>

      {/* Summary KPIs */}
      <div className="kpi-grid mb-6" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="kpi-card"><div className="kpi-value">8</div><div className="kpi-label">Total Projects</div></div>
        <div className="kpi-card"><div className="kpi-value">3,139</div><div className="kpi-label">Total Area Proposed (Ha)</div></div>
        <div className="kpi-card"><div className="kpi-value" style={{ color: '#f59e0b' }}>₹{totalAssessed.toFixed(1)}L</div><div className="kpi-label">Comp. Assessed</div></div>
        <div className="kpi-card"><div className="kpi-value" style={{ color: '#10b981' }}>₹{totalPaid.toFixed(1)}L</div><div className="kpi-label">Comp. Paid</div></div>
      </div>

      {/* Chart */}
      <div className="card mb-6">
        <div className="card-header">
          <div className="card-title">Area Acquisition Progress — Project wise</div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data.map(d => ({
            name: d.project_code,
            'Proposed (Ha)': parseFloat(d.total_area_ha),
            'Acquired (Ha)': parseFloat(d.area_acquired_ha),
            'Possessed (Ha)': parseFloat(d.area_possessed_ha),
          }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} />
            <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
            <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 11, color: '#64748b' }} />
            <Bar dataKey="Proposed (Ha)" fill="#6366f1" radius={[3,3,0,0]} />
            <Bar dataKey="Acquired (Ha)" fill="#10b981" radius={[3,3,0,0]} />
            <Bar dataKey="Possessed (Ha)" fill="#059669" radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Data Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Project-wise Summary Report — Chennai District</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            Generated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} · NLAMS v1.0
          </div>
        </div>
        <div className="table-container" style={{ border: 'none' }}>
          <table>
            <thead>
              <tr>
                <th>Project Code</th><th>Name</th><th>Type</th>
                <th>Proposed Ha</th><th>Acquired Ha</th><th>Possessed Ha</th>
                <th>Comp. Assessed</th><th>Comp. Paid</th><th>Milestones</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d, i) => (
                <tr key={i}>
                  <td className="mono text-xs" style={{ color: 'var(--color-accent)' }}>{d.project_code}</td>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{d.name}</td>
                  <td style={{ fontSize: 11, textTransform: 'capitalize' }}>{d.project_type?.replace(/_/g, ' ')}</td>
                  <td>{parseFloat(d.total_area_ha).toLocaleString('en-IN')}</td>
                  <td style={{ color: 'var(--color-success)', fontWeight: 600 }}>{parseFloat(d.area_acquired_ha).toFixed(1)}</td>
                  <td style={{ color: '#059669', fontWeight: 600 }}>{parseFloat(d.area_possessed_ha).toFixed(1)}</td>
                  <td>{d.assessed > 0 ? `₹${d.assessed}L` : '—'}</td>
                  <td style={{ color: d.paid > 0 ? 'var(--color-success)' : 'var(--text-muted)' }}>{d.paid > 0 ? `₹${d.paid}L` : '—'}</td>
                  <td>
                    <span style={{ color: d.achieved_milestones >= d.total_milestones ? 'var(--color-success)' : 'var(--color-warning)', fontWeight: 600 }}>
                      {d.achieved_milestones}/{d.total_milestones}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
