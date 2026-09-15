import { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MOCK_FAMILIES = [
  { family_head: 'Muthusamy Gounder', family_size: 5, category: 'OBC', is_displaced: true, rr_status: 'in_progress', rr_site_allotted: true, rr_house_constructed: false, livelihood_restored: false, project_name: 'Parandur Greenfield Airport', survey_number: '145/2A', village: 'Parandur' },
  { family_head: 'Lakshmi Devi Selvam', family_size: 4, category: 'General', is_displaced: true, rr_status: 'completed', rr_site_allotted: true, rr_house_constructed: true, livelihood_restored: true, project_name: 'Parandur Greenfield Airport', survey_number: '146/1B', village: 'Parandur' },
  { family_head: 'Ramasamy Pillai', family_size: 6, category: 'SC', is_displaced: true, rr_status: 'not_started', rr_site_allotted: false, rr_house_constructed: false, livelihood_restored: false, project_name: 'Parandur Greenfield Airport', survey_number: '148/3', village: 'Parandhur' },
  { family_head: 'Chinnaponnu Natarajan', family_size: 3, category: 'OBC', is_displaced: false, rr_status: 'completed', rr_site_allotted: false, rr_house_constructed: false, livelihood_restored: true, project_name: 'Parandur Greenfield Airport', survey_number: '152/1', village: 'Manambakkam' },
  { family_head: 'Kamala Subramaniam', family_size: 4, category: 'General', is_displaced: true, rr_status: 'completed', rr_site_allotted: true, rr_house_constructed: true, livelihood_restored: true, project_name: 'Parandur Greenfield Airport', survey_number: '160/2A', village: 'Udayampalayam' },
  { family_head: 'Residents Association OMR-42', family_size: 18, category: 'General', is_displaced: true, rr_status: 'in_progress', rr_site_allotted: true, rr_house_constructed: false, livelihood_restored: true, project_name: 'Chennai Metro Rail Phase 2', survey_number: '35/1A', village: 'Taramani' },
  { family_head: 'Ennore Fishing Community', family_size: 12, category: 'SC', is_displaced: true, rr_status: 'not_started', rr_site_allotted: false, rr_house_constructed: false, livelihood_restored: false, project_name: 'Chennai Port Road', survey_number: 'N/A', village: 'Ennore' },
  { family_head: 'Arjunan Chinnathurai', family_size: 4, category: 'OBC', is_displaced: false, rr_status: 'not_started', rr_site_allotted: false, rr_house_constructed: false, livelihood_restored: false, project_name: 'Chennai Peripheral Ring Road', survey_number: '88/1', village: 'Ponneri' },
  { family_head: 'Saraswathi Murugesan', family_size: 5, category: 'SC', is_displaced: true, rr_status: 'not_started', rr_site_allotted: false, rr_house_constructed: false, livelihood_restored: false, project_name: 'Chennai Peripheral Ring Road', survey_number: '92/3B', village: 'Avadi' },
];

const RR_STATUS_COLORS = { not_started: '#6b7280', in_progress: '#f59e0b', completed: '#10b981' };
const CAT_COLORS = { SC: '#ef4444', ST: '#f97316', OBC: '#3b82f6', General: '#6366f1' };

export default function FamiliesPage() {
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    axios.get('/families')
      .then(r => setFamilies(r.data))
      .catch(() => setFamilies(MOCK_FAMILIES))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-state"><div className="spinner" /></div>;

  const total = families.length;
  const displaced = families.filter(f => f.is_displaced).length;
  const rrData = [
    { name: 'Not Started', value: families.filter(f => f.rr_status === 'not_started').length, color: '#6b7280' },
    { name: 'In Progress', value: families.filter(f => f.rr_status === 'in_progress').length, color: '#f59e0b' },
    { name: 'Completed', value: families.filter(f => f.rr_status === 'completed').length, color: '#10b981' },
  ];
  const catData = ['SC','ST','OBC','General'].map(c => ({ name: c, value: families.filter(f => f.category === c).length, color: CAT_COLORS[c] })).filter(d => d.value > 0);
  const filtered = families.filter(f => filter === 'all' || f.rr_status === filter);

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Affected Families & R&R</div>
          <div className="section-subtitle">Rehabilitation & Resettlement — RFCTLARR Chapter V monitoring</div>
        </div>
      </div>

      <div className="kpi-grid mb-6" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {[
          { label: 'Total Affected', value: total, color: '#3b82f6', icon: '👨‍👩‍👧' },
          { label: 'Displaced Families', value: displaced, color: '#ef4444', icon: '🏚' },
          { label: 'R&R Completed', value: rrData[2].value, color: '#10b981', icon: '🏡' },
          { label: 'Pending R&R', value: rrData[0].value, color: '#6b7280', icon: '⏳' },
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

      <div className="grid-2 mb-6">
        <div className="card">
          <div className="card-title mb-4">R&R Status Distribution</div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={rrData} dataKey="value" cx="50%" cy="50%" outerRadius={70} label={({ name, value }) => `${name}: ${value}`} labelLine={false} style={{ fontSize: 11 }}>
                {rrData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <div className="card-title mb-4">Social Category Distribution</div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={catData} dataKey="value" cx="50%" cy="50%" outerRadius={70}>
                {catData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {['all','not_started','in_progress','completed'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`btn btn-sm btn-ghost`}
            style={{ background: filter === s ? 'var(--bg-hover)' : 'transparent', color: filter === s ? 'var(--text-primary)' : 'var(--text-muted)' }}>
            {s === 'all' ? 'All' : s.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </button>
        ))}
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Family Head</th><th>Size</th><th>Category</th><th>Displaced</th>
              <th>R&R Status</th><th>Site Allotted</th><th>House Built</th><th>Livelihood</th>
              <th>Project</th><th>Village</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((f, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{f.family_head}</td>
                <td>{f.family_size} members</td>
                <td><span style={{ fontSize: 11, fontWeight: 700, color: CAT_COLORS[f.category] }}>{f.category}</span></td>
                <td>{f.is_displaced ? <span style={{ color: 'var(--color-danger)', fontWeight: 600 }}>Displaced</span> : <span style={{ color: 'var(--text-muted)' }}>No</span>}</td>
                <td><span className={`badge badge-${f.rr_status === 'completed' ? 'approved' : f.rr_status === 'in_progress' ? 'pending' : 'rejected'}`}>
                  {f.rr_status?.replace(/_/g, ' ')}
                </span></td>
                <td>{f.rr_site_allotted ? <span style={{ color: 'var(--color-success)' }}>✓</span> : <span style={{ color: 'var(--text-muted)' }}>✗</span>}</td>
                <td>{f.rr_house_constructed ? <span style={{ color: 'var(--color-success)' }}>✓</span> : <span style={{ color: 'var(--text-muted)' }}>✗</span>}</td>
                <td>{f.livelihood_restored ? <span style={{ color: 'var(--color-success)' }}>✓</span> : <span style={{ color: 'var(--text-muted)' }}>✗</span>}</td>
                <td style={{ fontSize: 11 }}>{f.project_name}</td>
                <td style={{ fontSize: 11 }}>{f.village}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
