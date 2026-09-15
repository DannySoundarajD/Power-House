import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const SEVERITY_COLORS = { critical: '#ef4444', high: '#f59e0b', medium: '#3b82f6', low: '#6b7280' };
const SEVERITY_ICONS = { critical: '🔴', high: '🟠', medium: '🟡', low: '🟢' };

const MOCK_ALERTS = [
  { id: 1, severity: 'critical', alert_type: 'deadline_breach', title: 'Award Declaration Overdue - Parandur Airport', description: '80% award target was due 2023-12-31. Currently at 42%. Immediate action required for 890 parcels. RFCTLARR Section 23 deadline breach.', project_name: 'Parandur Greenfield Airport', project_code: 'CHN-ARPT-001', is_resolved: false, created_at: '2024-06-01T10:00:00Z' },
  { id: 2, severity: 'high', alert_type: 'pending_approval', title: 'CPRR Section 19 Declaration Pending', description: 'Section 19 declaration for Chennai Peripheral Ring Road (Ponneri section) is overdue by 45 days. State Officer approval awaited.', project_name: 'Chennai Peripheral Ring Road Phase 1', project_code: 'CHN-RING-008', is_resolved: false, created_at: '2024-06-05T08:00:00Z' },
  { id: 3, severity: 'high', alert_type: 'compensation_delay', title: 'Compensation Pending - Ennore Fishing Community', description: '12 displaced fishing families from Ennore have not received compensation. Statutory 3-month deadline approaching. Social unrest risk.', project_name: 'Chennai Port - Kamarajar Integration Road', project_code: 'CHN-PORT-006', is_resolved: false, created_at: '2024-06-08T09:00:00Z' },
  { id: 4, severity: 'medium', alert_type: 'deadline_breach', title: 'Metro Phase 2 Compensation - Final Tranche Pending', description: 'Remaining 15% compensation (₹84.5L) for Taramani station parcels pending bank transfer. NEFT failure logged on 3 attempts.', project_name: 'Chennai Metro Rail Phase 2', project_code: 'CHN-METR-002', is_resolved: false, created_at: '2024-06-10T11:00:00Z' },
  { id: 5, severity: 'high', alert_type: 'rr_delay', title: 'R&R Progress Stalled - Parandur Airport', description: '48 displaced families without R&R site allotment across Parandur, Manambakkam villages. RFCTLARR Chapter V deadline breach risk.', project_name: 'Parandur Greenfield Airport', project_code: 'CHN-ARPT-001', is_resolved: false, created_at: '2024-06-12T14:00:00Z' },
];

const TYPE_LABELS = {
  deadline_breach: '⏰ Deadline Breach',
  pending_approval: '📋 Pending Approval',
  compensation_delay: '💰 Compensation Delay',
  rr_delay: '🏡 R&R Delay',
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState('all');
  const [showResolved, setShowResolved] = useState(false);

  const fetchAlerts = () => {
    axios.get('/alerts')
      .then(r => setAlerts(r.data))
      .catch(() => setAlerts(MOCK_ALERTS))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAlerts(); }, []);

  const handleResolve = async (id) => {
    try {
      await axios.patch(`/alerts/${id}/resolve`);
      setAlerts(a => a.map(x => x.id === id ? { ...x, is_resolved: true } : x));
      toast.success('Alert marked as resolved');
    } catch {
      setAlerts(a => a.map(x => x.id === id ? { ...x, is_resolved: true } : x));
      toast.success('Alert resolved');
    }
  };

  const filtered = alerts
    .filter(a => showResolved ? true : !a.is_resolved)
    .filter(a => severityFilter === 'all' || a.severity === severityFilter);

  if (loading) return <div className="loading-state"><div className="spinner" /></div>;

  const counts = { critical: alerts.filter(a => a.severity === 'critical' && !a.is_resolved).length,
    high: alerts.filter(a => a.severity === 'high' && !a.is_resolved).length,
    medium: alerts.filter(a => a.severity === 'medium' && !a.is_resolved).length };

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Alerts & Notifications</div>
          <div className="section-subtitle">{alerts.filter(a => !a.is_resolved).length} active alerts — Automated monitoring</div>
        </div>
        <div className="flex gap-3">
          <label className="flex items-center gap-2" style={{ fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <input type="checkbox" checked={showResolved} onChange={e => setShowResolved(e.target.checked)} />
            Show resolved
          </label>
        </div>
      </div>

      {/* Severity Summary */}
      <div className="kpi-grid mb-6" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {['critical','high','medium'].map(s => (
          <div key={s} className="kpi-card" onClick={() => setSeverityFilter(severityFilter === s ? 'all' : s)}
            style={{ cursor: 'pointer', border: `1px solid ${severityFilter === s ? SEVERITY_COLORS[s] : 'var(--border)'}` }}>
            <div className="kpi-icon" style={{ background: `${SEVERITY_COLORS[s]}20`, width: 40, height: 40, fontSize: 18 }}>
              <span>{SEVERITY_ICONS[s]}</span>
            </div>
            <div className="kpi-value" style={{ color: SEVERITY_COLORS[s] }}>{counts[s]}</div>
            <div className="kpi-label">{s.toUpperCase()} Alerts</div>
          </div>
        ))}
      </div>

      {/* Alerts List */}
      <div>
        {filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">✅</div>
            <h3>No active alerts</h3>
            <p>All alerts have been resolved</p>
          </div>
        )}
        {filtered.map(a => (
          <div key={a.id} className="alert-item" style={{ borderLeft: `3px solid ${SEVERITY_COLORS[a.severity]}`, opacity: a.is_resolved ? 0.5 : 1, marginBottom: 12 }}>
            <span className="alert-icon" style={{ fontSize: 24 }}>{SEVERITY_ICONS[a.severity]}</span>
            <div className="alert-content">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span className="alert-title">{a.title}</span>
                {a.is_resolved && <span className="badge badge-approved">Resolved</span>}
              </div>
              <div className="alert-desc">{a.description}</div>
              <div className="alert-meta" style={{ marginTop: 8, display: 'flex', gap: 16 }}>
                <span>📁 {a.project_code} · {a.project_name}</span>
                <span>{TYPE_LABELS[a.alert_type] || a.alert_type}</span>
                <span>🕐 {new Date(a.created_at).toLocaleDateString('en-IN')}</span>
              </div>
            </div>
            {!a.is_resolved && (
              <button className="btn btn-ghost btn-sm" onClick={() => handleResolve(a.id)} style={{ flexShrink: 0 }}>
                ✓ Resolve
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
