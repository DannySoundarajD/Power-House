import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const MOCK_COMP = [
  { project_name: 'Parandur Greenfield Airport', total_assessed: 1169.25, total_paid: 624.25, fully_paid: 2, partially_paid: 1, pending: 2 },
  { project_name: 'Chennai Metro Rail Phase 2', total_assessed: 802.5, total_paid: 645.0, fully_paid: 2, partially_paid: 1, pending: 0 },
  { project_name: 'NH-48 Highway Widening', total_assessed: 875.5, total_paid: 362.0, fully_paid: 3, partially_paid: 2, pending: 5 },
];

export default function CompensationPage() {
  const [summary, setSummary] = useState({ total_assessed: 2847.25, total_paid: 1631.25, fully_paid: 7, partially_paid: 4, pending: 7 });
  const [data, setData] = useState(MOCK_COMP);

  const paidPct = summary.total_assessed > 0 ? (summary.total_paid / summary.total_assessed * 100).toFixed(1) : 0;

  return (
    <div>
      <div className="section-header">
        <div><div className="section-title">Compensation Tracker</div>
        <div className="section-subtitle">RFCTLARR Act 2013 — Award disbursement monitoring</div></div>
      </div>

      <div className="kpi-grid mb-6">
        {[
          { label: 'Total Assessed', value: `₹${summary.total_assessed?.toLocaleString('en-IN')}L`, color: '#f59e0b', icon: '📊' },
          { label: 'Total Disbursed', value: `₹${summary.total_paid?.toLocaleString('en-IN')}L`, color: '#10b981', icon: '🏦' },
          { label: 'Disbursement Rate', value: `${paidPct}%`, color: '#3b82f6', icon: '📈' },
          { label: 'Fully Paid Parcels', value: summary.fully_paid, color: '#059669', icon: '✅' },
          { label: 'Partially Paid', value: summary.partially_paid, color: '#f97316', icon: '⚠️' },
          { label: 'Pending Payment', value: summary.pending, color: '#ef4444', icon: '⏳' },
        ].map(k => (
          <div key={k.label} className="kpi-card">
            <div className="kpi-icon" style={{ background: `${k.color}20`, width: 40, height: 40, fontSize: 18 }}>
              <span style={{ color: k.color }}>{k.icon}</span>
            </div>
            <div className="kpi-value" style={{ fontSize: 24 }}>{k.value}</div>
            <div className="kpi-label">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="card mb-6">
        <div className="card-header">
          <div className="card-title">Project-wise Compensation</div>
          <div className="card-subtitle">Assessed vs Disbursed (₹ Lakhs)</div>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data.map(d => ({ name: d.project_name?.split(' ').slice(0, 3).join(' '), Assessed: parseFloat(d.total_assessed), Paid: parseFloat(d.total_paid) }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
            <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }} />
            <Bar dataKey="Assessed" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Paid" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="table-container">
        <table>
          <thead><tr><th>Project</th><th>Assessed (₹L)</th><th>Paid (₹L)</th><th>Rate</th><th>Fully Paid</th><th>Partial</th><th>Pending</th></tr></thead>
          <tbody>
            {data.map((d, i) => {
              const pct = d.total_assessed > 0 ? (d.total_paid / d.total_assessed * 100).toFixed(1) : 0;
              return (
                <tr key={i}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{d.project_name}</td>
                  <td style={{ fontWeight: 600 }}>₹{parseFloat(d.total_assessed).toLocaleString('en-IN')}</td>
                  <td style={{ color: 'var(--color-success)', fontWeight: 600 }}>₹{parseFloat(d.total_paid).toLocaleString('en-IN')}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="progress-bar" style={{ flex: 1 }}>
                        <div className="progress-fill" style={{ width: `${pct}%`, background: parseFloat(pct) >= 80 ? '#10b981' : parseFloat(pct) >= 50 ? '#f59e0b' : '#ef4444' }} />
                      </div>
                      <span style={{ fontSize: 11, minWidth: 36 }}>{pct}%</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--color-success)', fontWeight: 600 }}>{d.fully_paid}</td>
                  <td style={{ color: 'var(--color-warning)' }}>{d.partially_paid}</td>
                  <td style={{ color: d.pending > 0 ? 'var(--color-danger)' : 'var(--text-muted)', fontWeight: d.pending > 0 ? 600 : 400 }}>{d.pending}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
