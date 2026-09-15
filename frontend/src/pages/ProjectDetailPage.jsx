import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const STAGE_LABELS = {
  proposed: 'Proposed', section_11_notification: 'Section 11 Notified',
  section_19_declaration: 'Section 19 Declared', award_declared: 'Award Declared',
  compensation_assessed: 'Compensation Assessed', compensation_paid: 'Compensation Paid',
  possession_taken: 'Possession Taken', closed: 'Closed',
};

const STAGES_ORDER = ['proposed','section_11_notification','section_19_declaration','award_declared','compensation_assessed','compensation_paid','possession_taken','closed'];

function StageProgress({ current }) {
  const idx = STAGES_ORDER.indexOf(current);
  return (
    <div style={{ display: 'flex', align: 'center', gap: 0, overflow: 'hidden', borderRadius: 8, border: '1px solid var(--border)' }}>
      {STAGES_ORDER.map((s, i) => {
        const done = i <= idx;
        const active = i === idx;
        const colors = ['#6366f1','#3b82f6','#8b5cf6','#f59e0b','#f97316','#10b981','#059669','#6b7280'];
        return (
          <div key={s} style={{
            flex: 1, padding: '8px 4px', textAlign: 'center', fontSize: 9, fontWeight: 600,
            background: done ? `${colors[i]}18` : 'var(--bg-card-2)',
            color: done ? colors[i] : 'var(--text-muted)',
            borderRight: i < 7 ? '1px solid var(--border)' : 'none',
            textTransform: 'uppercase', letterSpacing: 0,
            transition: 'all 0.3s',
          }}>
            {active && <span style={{ display: 'block', fontSize: 14, marginBottom: 2 }}>●</span>}
            {!active && done && <span style={{ display: 'block', fontSize: 14, marginBottom: 2 }}>✓</span>}
            {!done && <span style={{ display: 'block', fontSize: 14, marginBottom: 2 }}>○</span>}
            {STAGE_LABELS[s]?.replace(' ', '\n')}
          </div>
        );
      })}
    </div>
  );
}

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    axios.get(`/projects/${id}`)
      .then(r => setData(r.data))
      .catch(() => setData(MOCK_DETAIL))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading-state"><div className="spinner" /></div>;
  if (!data) return <div className="empty-state"><div className="empty-icon">🔍</div><h3>Project not found</h3></div>;

  const { project: p, parcels = [], notifications = [], milestones = [], families = [], workflow = [] } = data;

  const tabs = ['overview', 'parcels', 'workflow', 'notifications', 'milestones', 'r&r'];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/projects')} style={{ marginBottom: 12 }}>
          ← Back to Projects
        </button>
        <div className="flex items-center gap-3" style={{ marginBottom: 8 }}>
          <span className="mono" style={{ fontSize: 12, color: 'var(--color-accent)' }}>{p.project_code}</span>
          <span className={`badge badge-${p.current_stage?.includes('paid') ? 'comp-paid' : p.current_stage?.includes('possession') ? 'possession' : 'pending'}`}>
            {STAGE_LABELS[p.current_stage]}
          </span>
        </div>
        <div className="section-title">{p.name}</div>
        <div className="section-subtitle">{p.implementing_agency} · Chennai District, Tamil Nadu</div>
      </div>

      {/* Stage Progress Bar */}
      <div className="card mb-6">
        <div className="card-header" style={{ marginBottom: 12 }}>
          <div className="card-title">Acquisition Pipeline</div>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-accent)' }}>{p.progress_pct}% Complete</span>
        </div>
        <StageProgress current={p.current_stage} />
      </div>

      {/* Key Stats */}
      <div className="kpi-grid mb-6">
        {[
          { label: 'Total Area', value: `${parseFloat(p.total_area_ha || 0).toLocaleString('en-IN')} Ha`, icon: '📐', color: '#3b82f6' },
          { label: 'Area Acquired', value: `${parseFloat(p.area_acquired_ha || 0).toFixed(1)} Ha`, icon: '✅', color: '#10b981' },
          { label: 'Possession Taken', value: `${parseFloat(p.area_possessed_ha || 0).toFixed(1)} Ha`, icon: '🏠', color: '#059669' },
          { label: 'Total Parcels', value: p.total_parcels || parcels.length, icon: '📦', color: '#8b5cf6' },
          { label: 'Comp. Assessed', value: `₹${parseFloat(p.total_comp_assessed_lakh || 0).toFixed(1)}L`, icon: '💰', color: '#f59e0b' },
          { label: 'Comp. Paid', value: `₹${parseFloat(p.total_comp_paid_lakh || 0).toFixed(1)}L`, icon: '🏦', color: '#f97316' },
          { label: 'Affected Families', value: p.affected_families || families.length, icon: '👨‍👩‍👧', color: '#ef4444' },
          { label: 'R&R Completed', value: p.rr_completed_families || 0, icon: '🏡', color: '#6366f1' },
        ].map(k => (
          <div key={k.label} className="kpi-card" style={{ padding: 16 }}>
            <div className="kpi-icon" style={{ background: `${k.color}20`, width: 36, height: 36, fontSize: 16, marginBottom: 10 }}>
              <span style={{ color: k.color }}>{k.icon}</span>
            </div>
            <div className="kpi-value" style={{ fontSize: 20 }}>{k.value}</div>
            <div className="kpi-label">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: '1px solid var(--border)', paddingBottom: 4 }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            style={{ padding: '8px 16px', borderRadius: '6px 6px 0 0', border: 'none', cursor: 'pointer',
              background: activeTab === t ? 'var(--bg-card)' : 'transparent',
              color: activeTab === t ? 'var(--text-primary)' : 'var(--text-muted)',
              fontSize: 13, fontWeight: activeTab === t ? 600 : 400, textTransform: 'capitalize',
              borderBottom: activeTab === t ? '2px solid var(--color-primary-light)' : 'none' }}>
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      {activeTab === 'overview' && (
        <div className="grid-2">
          <div className="card">
            <div className="card-title mb-4">Project Description</div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{p.description || 'No description available.'}</p>
            <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                ['Start Date', p.start_date ? new Date(p.start_date).toLocaleDateString('en-IN') : '—'],
                ['Target Completion', p.target_completion ? new Date(p.target_completion).toLocaleDateString('en-IN') : '—'],
                ['Estimated Cost', p.estimated_cost_cr ? `₹${p.estimated_cost_cr} Cr` : '—'],
                ['District', 'Chennai, Tamil Nadu'],
              ].map(([k, v]) => (
                <div key={k} style={{ padding: 12, background: 'var(--bg-card-2)', borderRadius: 8, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{k}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-title mb-4">Milestone Tracker</div>
            {milestones.slice(0, 6).map((m, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: m.is_achieved ? 'rgba(16,185,129,0.15)' : (new Date(m.target_date) < new Date() ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)'),
                  fontSize: 12, flexShrink: 0 }}>
                  {m.is_achieved ? '✓' : (new Date(m.target_date) < new Date() ? '⚠' : '○')}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{m.milestone_name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    Target: {new Date(m.target_date).toLocaleDateString('en-IN')}
                    {m.achieved_date && ` · Achieved: ${new Date(m.achieved_date).toLocaleDateString('en-IN')}`}
                    {!m.is_achieved && new Date(m.target_date) < new Date() &&
                      <span style={{ color: 'var(--color-danger)' }}> · OVERDUE {m.delay_days}d</span>}
                  </div>
                </div>
                {m.is_critical && <span style={{ fontSize: 10, color: 'var(--color-danger)', fontWeight: 700 }}>CRITICAL</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'parcels' && (
        <div className="table-container">
          <table>
            <thead><tr><th>Survey No.</th><th>Patta</th><th>Village</th><th>Area (Ha)</th><th>Land Use</th><th>Owner</th><th>Stage</th><th>Comp. Assessed</th><th>Comp. Paid</th></tr></thead>
            <tbody>
              {(parcels.length ? parcels : MOCK_DETAIL.parcels).map(p => (
                <tr key={p.id || p.survey_number}>
                  <td className="mono text-xs" style={{ color: 'var(--color-accent)' }}>{p.survey_number}</td>
                  <td>{p.patta_number || '—'}</td>
                  <td>{p.village}</td>
                  <td style={{ fontWeight: 600 }}>{p.area_ha}</td>
                  <td style={{ textTransform: 'capitalize' }}>{p.land_use?.replace(/_/g, ' ')}</td>
                  <td>{p.owner_name}</td>
                  <td><span className={`badge badge-${p.stage?.includes('paid') ? 'comp-paid' : p.stage?.includes('possession') ? 'possession' : 'pending'}`}>
                    {STAGE_LABELS[p.stage] || p.stage}
                  </span></td>
                  <td>₹{parseFloat(p.compensation_assessed_lakh || 0).toFixed(2)}L</td>
                  <td style={{ color: parseFloat(p.compensation_paid_lakh) >= parseFloat(p.compensation_assessed_lakh) && parseFloat(p.compensation_assessed_lakh) > 0 ? 'var(--color-success)' : 'var(--text-secondary)' }}>
                    ₹{parseFloat(p.compensation_paid_lakh || 0).toFixed(2)}L
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'workflow' && (
        <div className="card">
          <div className="card-title mb-4">Approval Workflow</div>
          <div className="workflow-timeline">
            {(workflow.length ? workflow : MOCK_DETAIL.workflow).map((s, i) => (
              <div key={i} className="workflow-stage">
                <div className={`stage-node ${s.status}`}>
                  {s.status === 'approved' ? '✓' : s.status === 'rejected' ? '✗' : '⟳'}
                </div>
                <div className="stage-info">
                  <div className="stage-name">{s.stage_name}</div>
                  <div className="stage-role">{s.assigned_role?.replace(/_/g, ' ')} · {s.assigned_user_name || 'Not assigned'}</div>
                  {s.comments && <div className="stage-comments">"{s.comments}"</div>}
                  {s.acted_at && <div className="stage-date">✓ {new Date(s.acted_at).toLocaleDateString('en-IN')}</div>}
                  {!s.acted_at && s.deadline && (
                    <div style={{ fontSize: 11, color: new Date(s.deadline) < new Date() ? 'var(--color-danger)' : 'var(--text-muted)' }}>
                      Deadline: {new Date(s.deadline).toLocaleDateString('en-IN')}
                    </div>
                  )}
                </div>
                <span className={`badge badge-${s.status}`} style={{ marginLeft: 'auto', alignSelf: 'flex-start' }}>{s.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="table-container">
          <table>
            <thead><tr><th>Type</th><th>Gazette No.</th><th>Date</th><th>Issued By</th><th>Area (Ha)</th></tr></thead>
            <tbody>
              {(notifications.length ? notifications : MOCK_DETAIL.notifications).map((n, i) => (
                <tr key={i}>
                  <td><span className="badge badge-s11">{n.notification_type?.replace(/_/g, ' ').toUpperCase()}</span></td>
                  <td className="mono text-xs">{n.gazette_number}</td>
                  <td>{n.gazette_date ? new Date(n.gazette_date).toLocaleDateString('en-IN') : '—'}</td>
                  <td>{n.issued_by}</td>
                  <td style={{ fontWeight: 600 }}>{n.total_area_ha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'milestones' && (
        <div className="table-container">
          <table>
            <thead><tr><th>Milestone</th><th>Stage</th><th>Target Date</th><th>Achieved</th><th>Delay</th><th>Critical</th></tr></thead>
            <tbody>
              {milestones.map((m, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{m.milestone_name}</td>
                  <td><span style={{ fontSize: 11, textTransform: 'capitalize', color: 'var(--text-muted)' }}>{m.stage?.replace(/_/g, ' ')}</span></td>
                  <td>{new Date(m.target_date).toLocaleDateString('en-IN')}</td>
                  <td>
                    {m.is_achieved
                      ? <span style={{ color: 'var(--color-success)' }}>✓ {new Date(m.achieved_date).toLocaleDateString('en-IN')}</span>
                      : <span style={{ color: 'var(--text-muted)' }}>Pending</span>}
                  </td>
                  <td>
                    {m.delay_days > 0
                      ? <span style={{ color: 'var(--color-danger)', fontWeight: 600 }}>+{m.delay_days}d</span>
                      : <span style={{ color: 'var(--color-success)' }}>On time</span>}
                  </td>
                  <td>{m.is_critical && <span style={{ color: 'var(--color-danger)', fontWeight: 700, fontSize: 11 }}>CRITICAL</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'r&r' && (
        <div className="table-container">
          <table>
            <thead><tr><th>Family Head</th><th>Size</th><th>Category</th><th>Displaced</th><th>R&R Status</th><th>Site Allotted</th><th>House Built</th><th>Livelihood</th></tr></thead>
            <tbody>
              {(families.length ? families : MOCK_DETAIL.families).map((f, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{f.family_head}</td>
                  <td>{f.family_size}</td>
                  <td>{f.category}</td>
                  <td>{f.is_displaced ? <span style={{ color: 'var(--color-danger)' }}>Yes</span> : 'No'}</td>
                  <td><span className={`badge badge-${f.rr_status === 'completed' ? 'approved' : f.rr_status === 'in_progress' ? 'pending' : 'rejected'}`}>
                    {f.rr_status?.replace(/_/g, ' ')}
                  </span></td>
                  <td>{f.rr_site_allotted ? '✓' : '—'}</td>
                  <td>{f.rr_house_constructed ? '✓' : '—'}</td>
                  <td>{f.livelihood_restored ? '✓' : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const MOCK_DETAIL = {
  project: { id: 'b1000000-0000-0000-0000-000000000001', project_code: 'CHN-ARPT-001', name: 'Parandur Greenfield International Airport', implementing_agency: 'AAI / TIDCO', current_stage: 'section_19_declaration', total_area_ha: 1900, area_acquired_ha: 680, area_possessed_ha: 320, total_comp_assessed_lakh: 1169.25, total_comp_paid_lakh: 624.25, progress_pct: 36, total_parcels: 5, affected_families: 5, rr_completed_families: 2, start_date: '2022-09-01', target_completion: '2030-03-31', estimated_cost_cr: 25000, description: 'New greenfield international airport at Parandur village, Kancheepuram District to decongest Chennai Airport. The project involves acquisition of approximately 4,694 acres of multi-crop agricultural land and involves relocation of 15+ villages.' },
  parcels: [
    { survey_number: '145/2A', patta_number: 'P-1204', village: 'Parandur', taluk: 'Kancheepuram', area_ha: 12.45, land_use: 'agricultural', owner_name: 'Muthusamy Gounder', stage: 'section_19_declaration', compensation_assessed_lakh: 186.75, compensation_paid_lakh: 0 },
    { survey_number: '146/1B', patta_number: 'P-1205', village: 'Parandur', taluk: 'Kancheepuram', area_ha: 8.30, land_use: 'agricultural', owner_name: 'Lakshmi Devi Selvam', stage: 'award_declared', compensation_assessed_lakh: 124.50, compensation_paid_lakh: 62.25 },
    { survey_number: '152/1', patta_number: 'P-1215', village: 'Manambakkam', taluk: 'Kancheepuram', area_ha: 22.80, land_use: 'agricultural', owner_name: 'Chinnaponnu Natarajan', stage: 'compensation_paid', compensation_assessed_lakh: 342.00, compensation_paid_lakh: 342.00 },
    { survey_number: '160/2A', patta_number: 'P-1220', village: 'Udayampalayam', taluk: 'Kancheepuram', area_ha: 9.40, land_use: 'residential', owner_name: 'Kamala Subramaniam', stage: 'possession_taken', compensation_assessed_lakh: 282.00, compensation_paid_lakh: 282.00 },
  ],
  notifications: [
    { notification_type: 'section_11', gazette_number: 'TN/GAZETTE/2022/1041', gazette_date: '2022-10-15', issued_by: 'District Collector, Kancheepuram', total_area_ha: 1200 },
    { notification_type: 'section_19', gazette_number: 'TN/GAZETTE/2023/0428', gazette_date: '2023-04-20', issued_by: 'District Collector, Kancheepuram', total_area_ha: 680 },
  ],
  milestones: [
    { milestone_name: 'SIA Completion', target_date: '2022-08-31', achieved_date: '2022-09-10', is_achieved: true, is_critical: true, delay_days: 10 },
    { milestone_name: 'Section 11 Notification', target_date: '2022-10-31', achieved_date: '2022-10-15', is_achieved: true, is_critical: true, delay_days: 0 },
    { milestone_name: 'Section 19 Declaration', target_date: '2023-03-31', achieved_date: '2023-04-20', is_achieved: true, is_critical: true, delay_days: 20 },
    { milestone_name: 'Award Declaration - 80% Parcels', target_date: '2023-12-31', is_achieved: false, is_critical: true, delay_days: 200 },
    { milestone_name: 'Full Possession', target_date: '2025-03-31', is_achieved: false, is_critical: true, delay_days: 0 },
  ],
  workflow: [
    { stage_name: 'Field Officer Submission', stage_order: 1, assigned_role: 'field_officer', assigned_user_name: 'Kumaran Selvam', status: 'approved', comments: 'Documents verified and uploaded', acted_at: '2024-01-15T10:00:00Z' },
    { stage_name: 'District Collector Review', stage_order: 2, assigned_role: 'district_collector', assigned_user_name: 'Senthil Murugan IAS', status: 'approved', comments: 'SIA complete, recommend approval', acted_at: '2024-01-22T15:30:00Z' },
    { stage_name: 'State Officer Approval', stage_order: 3, assigned_role: 'state_officer', assigned_user_name: 'Priya Chandran IAS', status: 'approved', comments: 'Approved with conditions', acted_at: '2024-02-01T11:00:00Z' },
    { stage_name: 'Central Ministry Endorsement', stage_order: 4, assigned_role: 'central_admin', assigned_user_name: 'Rajesh Kumar IAS', status: 'approved', comments: 'Endorsed for gazette notification', acted_at: '2024-02-08T09:00:00Z' },
  ],
  families: [
    { family_head: 'Muthusamy Gounder', family_size: 5, category: 'OBC', is_displaced: true, rr_status: 'in_progress', rr_site_allotted: true, rr_house_constructed: false, livelihood_restored: false },
    { family_head: 'Lakshmi Devi Selvam', family_size: 4, category: 'General', is_displaced: true, rr_status: 'completed', rr_site_allotted: true, rr_house_constructed: true, livelihood_restored: true },
    { family_head: 'Ramasamy Pillai', family_size: 6, category: 'SC', is_displaced: true, rr_status: 'not_started', rr_site_allotted: false, rr_house_constructed: false, livelihood_restored: false },
    { family_head: 'Kamala Subramaniam', family_size: 4, category: 'General', is_displaced: true, rr_status: 'completed', rr_site_allotted: true, rr_house_constructed: true, livelihood_restored: true },
  ],
};
