import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const MOCK_PROPOSALS = [
  { id: 'd1000000-0000-0000-0000-000000000001', proposal_number: 'PROP/CHN/2024/001', project_name: 'Parandur Greenfield International Airport', project_code: 'CHN-ARPT-001', title: 'Section 11 Notification for Parandur Airport - Block B Extension', area_requested_ha: 129.50, urgency: 'critical', status: 'approved', submitted_by_name: 'Kumaran Selvam', submitted_at: '2024-01-15T10:00:00Z', reviewed_by_name: 'Senthil Murugan IAS' },
  { id: 'd1000000-0000-0000-0000-000000000002', proposal_number: 'PROP/CHN/2024/002', project_name: 'Chennai Peripheral Ring Road Phase 1', project_code: 'CHN-RING-008', title: 'SIA for Chennai Peripheral Ring Road - Ponneri Section', area_requested_ha: 65.00, urgency: 'urgent', status: 'under_review', submitted_by_name: 'Meenakshi Rajan', submitted_at: '2024-03-10T09:00:00Z', reviewed_by_name: 'Senthil Murugan IAS' },
  { id: 'd1000000-0000-0000-0000-000000000003', proposal_number: 'PROP/CHN/2024/003', project_name: 'Chennai Port - Kamarajar Integration Road', project_code: 'CHN-PORT-006', title: 'Additional Acquisition for Port Road Corridor - Ennore Section', area_requested_ha: 18.30, urgency: 'normal', status: 'submitted', submitted_by_name: 'Kumaran Selvam', submitted_at: '2024-04-05T11:30:00Z', reviewed_by_name: null },
];

const URGENCY_COLORS = { critical: 'badge-critical', urgent: 'badge-high', normal: 'badge-low' };
const STATUS_BADGE = { draft: 'badge-pending', submitted: 'badge-submitted', under_review: 'badge-pending', approved: 'badge-approved', rejected: 'badge-rejected', returned: 'badge-warning' };

export default function ProposalsPage() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ project_id: '', title: '', description: '', area_requested_ha: '', urgency: 'normal' });
  const { user } = useAuth();

  const fetchProposals = () => {
    axios.get('/proposals')
      .then(r => setProposals(r.data))
      .catch(() => setProposals(MOCK_PROPOSALS))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProposals(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/proposals', form);
      toast.success('Proposal submitted successfully!');
      setShowModal(false);
      setForm({ project_id: '', title: '', description: '', area_requested_ha: '', urgency: 'normal' });
      fetchProposals();
    } catch {
      toast.error('Failed to submit proposal');
    }
  };

  const handleAction = async (id, status) => {
    try {
      await axios.patch(`/proposals/${id}/status`, { status, comments: 'Action taken via NLAMS portal' });
      toast.success(`Proposal ${status}`);
      fetchProposals();
    } catch {
      toast.error('Action failed');
    }
  };

  if (loading) return <div className="loading-state"><div className="spinner" /></div>;

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Proposals</div>
          <div className="section-subtitle">{proposals.length} proposals — Online Submission & Approval</div>
        </div>
        {(user?.role === 'field_officer' || user?.role === 'central_admin') && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Submit Proposal</button>
        )}
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Proposal No.</th><th>Title</th><th>Project</th>
              <th>Area (Ha)</th><th>Urgency</th><th>Status</th>
              <th>Submitted By</th><th>Date</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {proposals.map(p => (
              <tr key={p.id}>
                <td><span className="mono text-xs" style={{ color: 'var(--color-accent)' }}>{p.proposal_number}</span></td>
                <td>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 13, maxWidth: 280 }} className="truncate">{p.title}</div>
                </td>
                <td>
                  <div style={{ fontSize: 12 }}>{p.project_code}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.project_name}</div>
                </td>
                <td style={{ fontWeight: 600 }}>{p.area_requested_ha} Ha</td>
                <td><span className={`badge ${URGENCY_COLORS[p.urgency]}`}>{p.urgency?.toUpperCase()}</span></td>
                <td><span className={`badge ${STATUS_BADGE[p.status]}`}>{p.status?.replace(/_/g, ' ')}</span></td>
                <td style={{ fontSize: 12 }}>{p.submitted_by_name}</td>
                <td style={{ fontSize: 12 }}>{new Date(p.submitted_at).toLocaleDateString('en-IN')}</td>
                <td>
                  {p.status === 'submitted' && (user?.role === 'district_collector' || user?.role === 'state_officer') && (
                    <div className="flex gap-2">
                      <button className="btn btn-sm" style={{ background: 'rgba(16,185,129,0.15)', color: '#6ee7b7', border: 'none' }} onClick={() => handleAction(p.id, 'approved')}>✓ Approve</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleAction(p.id, 'rejected')}>✗ Reject</button>
                    </div>
                  )}
                  {p.status === 'under_review' && user?.role === 'state_officer' && (
                    <button className="btn btn-sm" style={{ background: 'rgba(16,185,129,0.15)', color: '#6ee7b7', border: 'none' }} onClick={() => handleAction(p.id, 'approved')}>✓ Approve</button>
                  )}
                  {(p.status === 'approved' || p.status === 'rejected') && (
                    <span style={{ fontSize: 11, color: p.status === 'approved' ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 600 }}>
                      {p.status === 'approved' ? '✓ Approved' : '✗ Rejected'}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Proposal Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">Submit New Proposal</div>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Proposal Title</label>
                <input className="form-control" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required placeholder="e.g. Section 11 Notification for NH-48 widening..." />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-control" rows={4} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Detailed description of land acquisition requirement..." style={{ resize: 'vertical' }} />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Area Requested (Ha)</label>
                  <input className="form-control" type="number" step="0.01" value={form.area_requested_ha} onChange={e => setForm(f => ({ ...f, area_requested_ha: e.target.value }))} required placeholder="0.00" />
                </div>
                <div className="form-group">
                  <label className="form-label">Urgency</label>
                  <select className="form-control" value={form.urgency} onChange={e => setForm(f => ({ ...f, urgency: e.target.value }))}>
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">📤 Submit Proposal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
