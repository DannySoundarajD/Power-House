import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

const STAGE_BADGE = {
  proposed: 'badge-proposed',
  section_11_notification: 'badge-s11',
  section_19_declaration: 'badge-s19',
  award_declared: 'badge-award',
  compensation_assessed: 'badge-comp-assessed',
  compensation_paid: 'badge-comp-paid',
  possession_taken: 'badge-possession',
  closed: 'badge-closed',
};

const TYPE_ICONS = {
  highway: '🛣', airport: '✈️', railway: '🚂', irrigation: '💧',
  urban_development: '🏙', industrial_corridor: '🏭', renewable_energy: '☀️',
  port: '⚓', metro: '🚇', defence: '🛡',
};

const MOCK_PROJECTS = [
  { id: 'b1000000-0000-0000-0000-000000000001', project_code: 'CHN-ARPT-001', name: 'Parandur Greenfield International Airport', project_type: 'airport', implementing_agency: 'AAI / TIDCO', current_stage: 'section_19_declaration', total_area_ha: 1900, area_proposed_ha: 1900, area_acquired_ha: 680, area_possessed_ha: 320, total_comp_assessed_lakh: 1169.25, total_comp_paid_lakh: 624.25, progress_pct: 36, total_parcels: 5, affected_families: 5, target_completion: '2030-03-31' },
  { id: 'b1000000-0000-0000-0000-000000000002', project_code: 'CHN-METR-002', name: 'Chennai Metro Rail Phase 2 - Corridor 5', project_type: 'metro', implementing_agency: 'CMRL', current_stage: 'compensation_paid', total_area_ha: 48.5, area_proposed_ha: 48.5, area_acquired_ha: 28.6, area_possessed_ha: 22.4, total_comp_assessed_lakh: 802.5, total_comp_paid_lakh: 645.0, progress_pct: 62, total_parcels: 3, affected_families: 2, target_completion: '2027-12-31' },
  { id: 'b1000000-0000-0000-0000-000000000003', project_code: 'CHN-SECR-003', name: 'New Tamil Nadu Secretariat Complex', project_type: 'urban_development', implementing_agency: 'TANGEDCO / PWD', current_stage: 'possession_taken', total_area_ha: 12, area_proposed_ha: 12, area_acquired_ha: 10.5, area_possessed_ha: 8, total_comp_assessed_lakh: 0, total_comp_paid_lakh: 0, progress_pct: 75, total_parcels: 0, affected_families: 0, target_completion: '2025-12-31' },
  { id: 'b1000000-0000-0000-0000-000000000004', project_code: 'CHN-NHWY-004', name: 'NH-48 Vandalur-Walajabad 4-Lane Highway', project_type: 'highway', implementing_agency: 'NHAI', current_stage: 'compensation_paid', total_area_ha: 180, area_proposed_ha: 180, area_acquired_ha: 130, area_possessed_ha: 110, total_comp_assessed_lakh: 875.5, total_comp_paid_lakh: 362.0, progress_pct: 71, total_parcels: 0, affected_families: 0, target_completion: '2025-06-30' },
  { id: 'b1000000-0000-0000-0000-000000000005', project_code: 'CHN-TIDL-005', name: 'TIDEL Park Phase 3 - OMR Expansion', project_type: 'industrial_corridor', implementing_agency: 'TIDCO / ELCOT', current_stage: 'closed', total_area_ha: 14.2, area_proposed_ha: 14.2, area_acquired_ha: 12.8, area_possessed_ha: 12.8, total_comp_assessed_lakh: 0, total_comp_paid_lakh: 0, progress_pct: 100, total_parcels: 0, affected_families: 0, target_completion: '2024-03-31' },
  { id: 'b1000000-0000-0000-0000-000000000006', project_code: 'CHN-PORT-006', name: 'Chennai Port - Kamarajar Integration Road', project_type: 'port', implementing_agency: 'Chennai Port Trust / NHAI', current_stage: 'compensation_assessed', total_area_ha: 95, area_proposed_ha: 95, area_acquired_ha: 48, area_possessed_ha: 28, total_comp_assessed_lakh: 0, total_comp_paid_lakh: 0, progress_pct: 42, total_parcels: 0, affected_families: 1, target_completion: '2026-06-30' },
  { id: 'b1000000-0000-0000-0000-000000000007', project_code: 'CHN-SIPC-007', name: 'SIPCOT Industrial Park Phase 2 - Sriperumbudur', project_type: 'industrial_corridor', implementing_agency: 'SIPCOT', current_stage: 'closed', total_area_ha: 580, area_proposed_ha: 580, area_acquired_ha: 490, area_possessed_ha: 460, total_comp_assessed_lakh: 0, total_comp_paid_lakh: 0, progress_pct: 100, total_parcels: 0, affected_families: 0, target_completion: '2023-12-31' },
  { id: 'b1000000-0000-0000-0000-000000000008', project_code: 'CHN-RING-008', name: 'Chennai Peripheral Ring Road (CPRR) Phase 1', project_type: 'highway', implementing_agency: 'NHAI / TNRDC', current_stage: 'section_11_notification', total_area_ha: 310, area_proposed_ha: 310, area_acquired_ha: 140, area_possessed_ha: 80, total_comp_assessed_lakh: 0, total_comp_paid_lakh: 0, progress_pct: 28, total_parcels: 2, affected_families: 2, target_completion: '2028-12-31' },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams();
    if (stageFilter) params.set('stage', stageFilter);
    if (search) params.set('search', search);

    axios.get(`/projects?${params}`)
      .then(r => setProjects(Array.isArray(r.data.projects) ? r.data.projects : MOCK_PROJECTS))
      .catch(() => setProjects(MOCK_PROJECTS))
      .finally(() => setLoading(false));
  }, [search, stageFilter]);

  if (loading) return <div className="loading-state"><div className="spinner" /><p>Loading projects...</p></div>;

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Projects Registry</div>
          <div className="section-subtitle">Chennai District — {(projects || []).length} land acquisition projects</div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => navigate('/proposals')}>
          + New Proposal
        </button>
      </div>

      <div className="filter-bar">
        <div className="search-input">
          <span className="search-icon">🔍</span>
          <input placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-control" style={{ width: 200 }} value={stageFilter} onChange={e => setStageFilter(e.target.value)}>
          <option value="">All Stages</option>
          {Object.entries(STAGE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Project</th>
              <th>Type</th>
              <th>Area (Ha)</th>
              <th>Progress</th>
              <th>Stage</th>
              <th>Families</th>
              <th>Comp. Paid</th>
              <th>Target</th>
            </tr>
          </thead>
          <tbody>
            {(projects || []).filter(p => {
              const q = search.toLowerCase();
              return !q || p.name?.toLowerCase().includes(q) || p.project_code?.toLowerCase().includes(q);
            }).filter(p => !stageFilter || p.current_stage === stageFilter).map(p => (
              <tr key={p.id} onClick={() => navigate(`/projects/${p.id}`)} style={{ cursor: 'pointer' }}>
                <td><span className="mono text-xs" style={{ color: 'var(--color-accent)' }}>{p.project_code}</span></td>
                <td>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 13 }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.implementing_agency}</div>
                </td>
                <td>
                  <span>{TYPE_ICONS[p.project_type]} </span>
                  <span style={{ fontSize: 12, textTransform: 'capitalize' }}>{p.project_type?.replace(/_/g, ' ')}</span>
                </td>
                <td>
                  <div style={{ fontWeight: 600 }}>{parseFloat(p.total_area_ha || 0).toLocaleString('en-IN')}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{parseFloat(p.area_acquired_ha || 0).toFixed(1)} acq.</div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div className="progress-bar" style={{ flex: 1 }}>
                      <div className="progress-fill" style={{ width: `${p.progress_pct}%` }} />
                    </div>
                    <span style={{ fontSize: 11, minWidth: 32 }}>{p.progress_pct}%</span>
                  </div>
                </td>
                <td><span className={`badge ${STAGE_BADGE[p.current_stage]}`}>{STAGE_LABELS[p.current_stage]}</span></td>
                <td><span style={{ fontWeight: 600 }}>{p.affected_families || 0}</span></td>
                <td>
                  {p.total_comp_assessed_lakh > 0
                    ? <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>
                        ₹{parseFloat(p.total_comp_paid_lakh).toLocaleString('en-IN')}L
                      </span>
                    : <span style={{ color: 'var(--text-muted)' }}>—</span>
                  }
                </td>
                <td style={{ fontSize: 12 }}>{p.target_completion ? new Date(p.target_completion).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
