import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { useNavigate } from 'react-router-dom';

const STAGE_COLORS = {
  proposed: '#6366f1',
  section_11_notification: '#3b82f6',
  section_19_declaration: '#8b5cf6',
  award_declared: '#f59e0b',
  compensation_assessed: '#f97316',
  compensation_paid: '#10b981',
  possession_taken: '#059669',
  closed: '#6b7280',
};

const STAGE_LABELS = {
  proposed: 'Proposed',
  section_11_notification: 'Sec.11 Notified',
  section_19_declaration: 'Sec.19 Declared',
  award_declared: 'Award Declared',
  compensation_assessed: 'Comp. Assessed',
  compensation_paid: 'Comp. Paid',
  possession_taken: 'Possession Taken',
  closed: 'Closed',
};

const SEVERITY_ICONS = { critical: '🔴', high: '🟠', medium: '🟡', low: '🟢' };

function formatNumber(n, dec = 0) {
  if (!n) return '0';
  return parseFloat(n).toLocaleString('en-IN', { maximumFractionDigits: dec });
}

function KPICard({ icon, label, value, unit, color, progress, subValue }) {
  return (
    <div className="kpi-card">
      <div className="kpi-icon" style={{ background: `${color}20` }}>
        <span style={{ color }}>{icon}</span>
      </div>
      <div className="kpi-value">{value}</div>
      {unit && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{unit}</div>}
      <div className="kpi-label">{label}</div>
      {subValue && <div className="kpi-trend text-muted">{subValue}</div>}
      {progress !== undefined && (
        <div className="kpi-progress-bar" style={{ marginTop: 10 }}>
          <div className="kpi-progress-fill" style={{ width: `${Math.min(progress, 100)}%`, background: color }} />
        </div>
      )}
      <span className="kpi-bg-icon">{icon}</span>
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px' }}>
      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ fontSize: 13, fontWeight: 600, color: p.color }}>
          {p.name}: {formatNumber(p.value)} {p.name.includes('Ha') ? 'Ha' : 'L'}
        </p>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/dashboard/summary')
      .then(r => setData(r.data))
      .catch(() => setData(MOCK_DATA))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-state"><div className="spinner" /><p>Loading dashboard...</p></div>;

  const kpi = data?.kpi || {};
  const stages = data?.stageBreakdown || [];
  const comp = data?.compensationTrend || [];
  const rr = data?.rrProgress || [];
  const alerts = data?.recentAlerts || [];
  const types = data?.projectTypeBreakdown || [];

  const paidPct = kpi.total_comp_assessed_lakh > 0
    ? (kpi.total_comp_paid_lakh / kpi.total_comp_assessed_lakh * 100).toFixed(1)
    : 0;

  const rrDone = rr.find(r => r.rr_status === 'completed');
  const rrTotal = rr.reduce((a, b) => a + parseInt(b.families || 0), 0);
  const rrPct = rrTotal > 0 ? Math.round((parseInt(rrDone?.families || 0) / rrTotal) * 100) : 0;

  const acquisitionPct = kpi.total_area_proposed_ha > 0
    ? Math.round(kpi.total_area_acquired_ha / kpi.total_area_proposed_ha * 100)
    : 0;

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">National Dashboard</div>
          <div className="section-subtitle">Chennai District — Real-time Land Acquisition Status · as of {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
        </div>
        <div className="flex gap-3">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/map')}>🗺 View Map</button>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/reports')}>📊 Export Report</button>
        </div>
      </div>

      {/* KPI Row 1 */}
      <div className="kpi-grid">
        <KPICard icon="🏗" label="Total Projects" value={formatNumber(kpi.total_projects)} color="#3b82f6" />
        <KPICard icon="📐" label="Area Proposed" value={formatNumber(kpi.total_area_proposed_ha, 1)} unit="Hectares" color="#6366f1"
          progress={100} subValue={`${formatNumber(kpi.total_area_acquired_ha, 1)} Ha acquired`} />
        <KPICard icon="📣" label="Area Notified" value={formatNumber(kpi.total_area_notified_ha, 1)} unit="Hectares" color="#8b5cf6"
          progress={kpi.total_area_proposed_ha > 0 ? (kpi.total_area_notified_ha / kpi.total_area_proposed_ha * 100) : 0} />
        <KPICard icon="✅" label="Area Acquired" value={formatNumber(kpi.total_area_acquired_ha, 1)} unit="Hectares" color="#10b981"
          progress={acquisitionPct} subValue={`${acquisitionPct}% of proposed`} />
        <KPICard icon="🏠" label="Possession Taken" value={formatNumber(kpi.total_area_possessed_ha, 1)} unit="Hectares" color="#059669"
          progress={kpi.total_area_acquired_ha > 0 ? (kpi.total_area_possessed_ha / kpi.total_area_acquired_ha * 100) : 0} />
        <KPICard icon="💰" label="Compensation Assessed" value={`₹${formatNumber(kpi.total_comp_assessed_lakh, 1)}`} unit="Lakhs" color="#f59e0b"
          progress={100} />
        <KPICard icon="🏦" label="Compensation Paid" value={`₹${formatNumber(kpi.total_comp_paid_lakh, 1)}`} unit="Lakhs" color="#f97316"
          progress={parseFloat(paidPct)} subValue={`${paidPct}% disbursed`} />
        <KPICard icon="👨‍👩‍👧" label="Affected Families" value={formatNumber(kpi.total_affected_families)} color="#ef4444"
          subValue={`${kpi.total_displaced_families} displaced`} />
      </div>

      {/* Charts Row */}
      <div className="grid-2 mb-6">
        {/* Stage Breakdown */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Projects by Acquisition Stage</div>
              <div className="card-subtitle">Current pipeline distribution</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stages.map(s => ({ name: STAGE_LABELS[s.current_stage] || s.current_stage, count: parseInt(s.count) }))} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Projects" radius={[4, 4, 0, 0]}>
                {stages.map((s, i) => (
                  <Cell key={i} fill={STAGE_COLORS[s.current_stage] || '#64748b'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Project Type */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Projects by Type</div>
              <div className="card-subtitle">Infrastructure categories</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie data={types} dataKey="count" nameKey="project_type" cx="50%" cy="50%" innerRadius={50} outerRadius={80}>
                  {types.map((t, i) => (
                    <Cell key={i} fill={['#3b82f6','#6366f1','#10b981','#f59e0b','#8b5cf6','#f97316','#ef4444','#06b6d4'][i % 8]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => [`${val} projects`]} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1, fontSize: 12 }}>
              {types.map((t, i) => (
                <div key={i} className="flex items-center gap-2" style={{ marginBottom: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: ['#3b82f6','#6366f1','#10b981','#f59e0b','#8b5cf6','#f97316','#ef4444','#06b6d4'][i % 8] }} />
                  <span style={{ color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{t.project_type?.replace(/_/g, ' ')}</span>
                  <span style={{ marginLeft: 'auto', fontWeight: 600, color: 'var(--text-primary)' }}>{t.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid-2-1">
        {/* Compensation Chart */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Compensation Overview</div>
              <div className="card-subtitle">Assessed vs Paid (₹ Lakhs) — by project type</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={comp.map(c => ({
              type: c.project_type?.replace(/_/g, ' '),
              'Assessed (L)': parseFloat(c.assessed || 0).toFixed(1),
              'Paid (L)': parseFloat(c.paid || 0).toFixed(1),
            }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="type" tick={{ fontSize: 10, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#64748b' }} />
              <Bar dataKey="Assessed (L)" fill="#f59e0b" radius={[3,3,0,0]} />
              <Bar dataKey="Paid (L)" fill="#10b981" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Alerts Panel */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Active Alerts</div>
              <div className="card-subtitle">{alerts.filter(a => !a.is_resolved).length} unresolved</div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/alerts')}>View All</button>
          </div>
          <div>
            {alerts.map(a => (
              <div key={a.id} className="alert-item" style={{ marginBottom: 8 }}>
                <span className="alert-icon">{SEVERITY_ICONS[a.severity]}</span>
                <div className="alert-content">
                  <div className="alert-title">{a.title}</div>
                  <div className="alert-meta">{a.project_name} · {a.severity?.toUpperCase()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* R&R Progress */}
      <div className="card mt-6">
        <div className="card-header">
          <div>
            <div className="card-title">Rehabilitation & Resettlement Progress</div>
            <div className="card-subtitle">Family-wise R&R status across all projects</div>
          </div>
          <span className="badge badge-s19">{rrPct}% Complete</span>
        </div>
        <div style={{ display: 'flex', gap: 32 }}>
          {rr.map((r, i) => {
            const colors = { not_started: '#6b7280', in_progress: '#f59e0b', completed: '#10b981' };
            const labels = { not_started: 'Not Started', in_progress: 'In Progress', completed: 'Completed' };
            return (
              <div key={i} style={{ flex: 1, textAlign: 'center', padding: 20, background: 'var(--bg-card-2)', borderRadius: 12, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: colors[r.rr_status] }}>{r.families}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Families</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: colors[r.rr_status], marginTop: 8 }}>{labels[r.rr_status] || r.rr_status}</div>
                <div style={{ marginTop: 12, height: 4, borderRadius: 2, background: 'var(--border)' }}>
                  <div style={{ height: '100%', borderRadius: 2, width: `${(r.families / rrTotal) * 100}%`, background: colors[r.rr_status], transition: 'width 1s' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Fallback mock data when backend is offline
const MOCK_DATA = {
  kpi: {
    total_projects: 8,
    total_area_proposed_ha: 3139.7,
    total_area_notified_ha: 2231.2,
    total_area_acquired_ha: 1534.9,
    total_area_possessed_ha: 1031.2,
    total_comp_assessed_lakh: 2847.25,
    total_comp_paid_lakh: 1631.25,
    total_affected_families: 10,
    total_displaced_families: 7,
    total_rr_completed: 4,
  },
  stageBreakdown: [
    { current_stage: 'proposed', count: 1 },
    { current_stage: 'section_11_notification', count: 2 },
    { current_stage: 'section_19_declaration', count: 1 },
    { current_stage: 'compensation_assessed', count: 1 },
    { current_stage: 'compensation_paid', count: 1 },
    { current_stage: 'possession_taken', count: 1 },
    { current_stage: 'closed', count: 2 },
  ],
  projectTypeBreakdown: [
    { project_type: 'airport', count: 1 },
    { project_type: 'metro', count: 1 },
    { project_type: 'highway', count: 2 },
    { project_type: 'urban_development', count: 1 },
    { project_type: 'port', count: 1 },
    { project_type: 'industrial_corridor', count: 2 },
  ],
  compensationTrend: [
    { project_type: 'airport', assessed: 1169.25, paid: 624.25 },
    { project_type: 'metro', assessed: 802.5, paid: 645.0 },
    { project_type: 'highway', assessed: 875.5, paid: 362.0 },
  ],
  rrProgress: [
    { rr_status: 'not_started', families: 5 },
    { rr_status: 'in_progress', families: 2 },
    { rr_status: 'completed', families: 3 },
  ],
  recentAlerts: [
    { id: 1, severity: 'critical', title: 'Award Declaration Overdue - Parandur Airport', project_name: 'Parandur Greenfield Airport', is_resolved: false },
    { id: 2, severity: 'high', title: 'CPRR Section 19 Declaration Pending', project_name: 'Chennai Peripheral Ring Road', is_resolved: false },
    { id: 3, severity: 'high', title: 'Compensation Pending - Ennore Fishing Community', project_name: 'Port Road Corridor', is_resolved: false },
  ],
};
