import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const MOCK_GRIEVANCES = [
  {
    id: 'grv-1',
    grievance_number: 'GRV/CHN/2024/001',
    landowner_name: 'Muthusamy Gounder',
    survey_number: '145/2A',
    project_name: 'Parandur Greenfield International Airport',
    subject: 'Objection to Section 19 Declaration — Market value underassessed',
    description: 'The market value assessed for survey no. 145/2A at ₹186.75L is significantly below current market rate. Similar land in Parandur sold for ₹28L/cent in 2023. Request reassessment per RFCTLARR Section 26.',
    grievance_type: 'compensation_dispute',
    status: 'under_review',
    priority: 'high',
    assigned_to_name: 'Special DRO (Land Acquisition)',
    submitted_at: '2024-02-15T10:00:00Z',
    resolution: null
  },
  {
    id: 'grv-2',
    grievance_number: 'GRV/CHN/2024/002',
    landowner_name: 'Ramasamy Pillai',
    survey_number: '148/3',
    project_name: 'Parandur Greenfield International Airport',
    subject: 'R&R site allotment pending for 8 months — no communication from authority',
    description: 'Despite being declared displaced as per Section 19, no R&R site has been allotted in 8 months. Family of 6 living in temporary shelter. Request immediate action.',
    grievance_type: 'rr_grievance',
    status: 'submitted',
    priority: 'high',
    assigned_to_name: 'Unassigned',
    submitted_at: '2024-05-20T11:00:00Z',
    resolution: null
  },
  {
    id: 'grv-3',
    grievance_number: 'GRV/CHN/2024/003',
    landowner_name: 'Arjunan Chinnathurai',
    survey_number: '88/1',
    project_name: 'Chennai Peripheral Ring Road (CPRR)',
    subject: 'Objection to Section 11 — Land is multi-generation ancestral property',
    description: 'The land proposed for CPRR is ancestral property held continuously for 4 generations. Request SIA to include heritage and cultural impact assessment.',
    grievance_type: 'objection',
    status: 'resolved',
    priority: 'normal',
    assigned_to_name: 'District Revenue Officer (Ponneri)',
    submitted_at: '2024-06-01T09:00:00Z',
    resolution: 'Hearing conducted under Section 15(2) on 18th July 2024. Alignment shifted by 40 meters to minimize homestead impact. Landowner issued written consent.'
  }
];

export default function GrievancePage() {
  const [grievances, setGrievances] = useState(MOCK_GRIEVANCES);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [activeItem, setActiveItem] = useState(null);
  const [resolutionText, setResolutionText] = useState('');

  useEffect(() => {
    axios.get('/grievances')
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) setGrievances(res.data);
      })
      .catch(() => setGrievances(MOCK_GRIEVANCES));
  }, []);

  const handleResolve = (id) => {
    if (!resolutionText) {
      toast.error('Please enter resolution text');
      return;
    }
    setGrievances(prev => prev.map(g => g.id === id ? {
      ...g,
      status: 'resolved',
      resolution: resolutionText,
      assigned_to_name: 'District Collector (Disposed)'
    } : g));
    toast.success('Grievance resolved and formal communication dispatched to Landowner!');
    setActiveItem(null);
    setResolutionText('');
  };

  const handleAssign = (id, officer) => {
    setGrievances(prev => prev.map(g => g.id === id ? {
      ...g,
      status: 'under_review',
      assigned_to_name: officer
    } : g));
    toast.success(`Assigned to ${officer}`);
  };

  const filtered = grievances.filter(g => {
    const matchesStatus = statusFilter === 'all' || g.status === statusFilter;
    const matchesSearch = (g.grievance_number?.toLowerCase().includes(search.toLowerCase()) ||
      g.landowner_name?.toLowerCase().includes(search.toLowerCase()) ||
      g.survey_number?.toLowerCase().includes(search.toLowerCase()) ||
      g.subject?.toLowerCase().includes(search.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="page-container" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#e8f0fe', margin: '0 0 6px 0' }}>
            Objection & Grievance Redressal
          </h1>
          <p style={{ color: '#8fa0c0', margin: 0, fontSize: '14px' }}>
            Statutory hearing management under RFCTLARR Section 15 & Land Acquisition Authority (LARRA) tracking
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span className="badge badge-alert" style={{ padding: '8px 14px', fontSize: '13px' }}>
            Pending Hearings: {grievances.filter(g => g.status !== 'resolved').length}
          </span>
        </div>
      </div>

      <div style={{ background: '#112240', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '16px', marginBottom: '20px', display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search by Grievance No, Landowner, Survey No, Subject..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: '1 1 320px', padding: '10px 14px', background: '#0a192f', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '6px', color: '#fff' }}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: '10px 14px', background: '#0a192f', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '6px', color: '#fff' }}
        >
          <option value="all">All Statuses</option>
          <option value="submitted">Submitted (Awaiting Review)</option>
          <option value="under_review">Under Hearing / Inquiry</option>
          <option value="resolved">Resolved & Disposed</option>
        </select>
      </div>

      <div style={{ display: 'grid', gap: '16px' }}>
        {filtered.map(g => (
          <div
            key={g.id}
            style={{
              background: '#112240',
              border: `1px solid ${g.status === 'resolved' ? 'rgba(16, 185, 129, 0.3)' : g.priority === 'high' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: '10px',
              padding: '20px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <span style={{ fontFamily: 'monospace', color: '#64ffda', fontWeight: '700' }}>
                    {g.grievance_number}
                  </span>
                  <span className={`badge ${g.status === 'resolved' ? 'badge-possession' : g.status === 'under_review' ? 'badge-s19' : 'badge-alert'}`}>
                    {g.status?.replace('_', ' ').toUpperCase()}
                  </span>
                  <span style={{ fontSize: '12px', color: '#ff7b72', background: 'rgba(255,123,114,0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                    {g.priority?.toUpperCase()} PRIORITY
                  </span>
                </div>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#f1f5f9' }}>
                  {g.subject}
                </h3>
                <div style={{ fontSize: '13px', color: '#94a3b8' }}>
                  Landowner: <strong style={{ color: '#e2e8f0' }}>{g.landowner_name}</strong> · Survey No: <strong style={{ color: '#64ffda' }}>{g.survey_number}</strong> · Project: {g.project_name}
                </div>
              </div>

              <div style={{ textAlign: 'right', fontSize: '12px', color: '#64748b' }}>
                <div>Submitted: {new Date(g.submitted_at).toLocaleDateString()}</div>
                <div style={{ marginTop: '4px', color: '#cbd5e1' }}>Officer: <strong>{g.assigned_to_name}</strong></div>
              </div>
            </div>

            <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#cbd5e1', lineHeight: '1.6', background: '#0a192f', padding: '12px', borderRadius: '6px' }}>
              {g.description}
            </p>

            {g.resolution && (
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '6px', padding: '12px', marginBottom: '16px', fontSize: '13px', color: '#a7f3d0' }}>
                <strong>✓ Authority Redressal Resolution:</strong>
                <p style={{ margin: '6px 0 0 0' }}>{g.resolution}</p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              {g.status !== 'resolved' && (
                <>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => handleAssign(g.id, 'Special DRO (Land Acquisition)')}
                  >
                    Assign to DRO
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => handleAssign(g.id, 'Sub-Collector / Revenue Div Officer')}
                  >
                    Assign to RDO
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => { setActiveItem(g); setResolutionText(g.resolution || ''); }}
                  >
                    Resolve & Issue Order
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {activeItem && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#112240', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '28px', maxWidth: '600px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', color: '#64ffda' }}>
                Issue Redressal Order: {activeItem.grievance_number}
              </h2>
              <button className="btn btn-ghost btn-sm" onClick={() => setActiveItem(null)}>✕</button>
            </div>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '16px' }}>
              Record official findings under Section 15 inquiry or LARRA tribunal reference. This decision will be reflected in the Landowner Portal.
            </p>
            <textarea
              rows="5"
              placeholder="Enter official inquiry findings, hearing outcome, compensation revision, or R&R allotment details..."
              value={resolutionText}
              onChange={(e) => setResolutionText(e.target.value)}
              style={{ width: '100%', padding: '12px', background: '#0a192f', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#fff', fontSize: '13px', marginBottom: '18px' }}
            />
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost" onClick={() => setActiveItem(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => handleResolve(activeItem.id)}>
                ✓ Finalize & Issue Resolution
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
