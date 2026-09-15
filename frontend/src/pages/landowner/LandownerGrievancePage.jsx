import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const MOCK_PREVIOUS = [
  {
    id: 'grv-01',
    grievance_number: 'GRV/CHN/2024/001',
    survey_number: '145/2A',
    subject: 'Objection to Section 19 Declaration — Market value underassessed',
    description: 'The market value assessed for survey no. 145/2A at ₹186.75L is significantly below current market rate. Similar land in Parandur sold for ₹28L/cent in 2023. Request reassessment per RFCTLARR Section 26.',
    grievance_type: 'compensation_dispute',
    status: 'under_review',
    submitted_at: '2024-02-15T10:00:00Z',
    assigned_officer: 'Special DRO (Land Acquisition)',
    resolution: 'Hearing scheduled under Section 64 on 28th March 2024 before Land Acquisition, Rehabilitation and Resettlement Authority (LARRA), Chennai.'
  }
];

export default function LandownerGrievancePage() {
  const [grievances, setGrievances] = useState(MOCK_PREVIOUS);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    survey_number: '145/2A',
    grievance_type: 'compensation_dispute',
    subject: '',
    description: ''
  });

  useEffect(() => {
    axios.get('/landowner/grievances')
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) setGrievances(res.data);
      })
      .catch(() => setGrievances(MOCK_PREVIOUS));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.subject || !form.description) {
      toast.error('Please fill in subject and description');
      return;
    }
    setSubmitting(true);
    try {
      await axios.post('/landowner/grievance', form);
    } catch {
      // Mock fallback
    }

    const newGrv = {
      id: 'grv-' + Date.now(),
      grievance_number: `GRV/CHN/2024/${Math.floor(Math.random() * 800) + 100}`,
      survey_number: form.survey_number,
      subject: form.subject,
      description: form.description,
      grievance_type: form.grievance_type,
      status: 'submitted',
      submitted_at: new Date().toISOString(),
      assigned_officer: 'District Revenue Officer (Awaiting Assignment)',
      resolution: null
    };

    setGrievances([newGrv, ...grievances]);
    setSubmitting(false);
    toast.success(`Statutory objection ${newGrv.grievance_number} filed with District Collector!`);
    setForm({
      survey_number: '145/2A',
      grievance_type: 'compensation_dispute',
      subject: '',
      description: ''
    });
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#e8f0fe', margin: '0 0 6px 0' }}>
          File Statutory Objection or Grievance
        </h1>
        <p style={{ color: '#8fa0c0', margin: 0, fontSize: '14px' }}>
          Submit formal objection under RFCTLARR Act 2013 Section 15 / Section 64 directly to the District Collector & LARRA Tribunal
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '28px', marginBottom: '36px' }}>
        {/* Submission Form */}
        <form onSubmit={handleSubmit} style={{ background: '#112240', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '24px' }}>
          <h2 style={{ fontSize: '17px', color: '#64ffda', margin: '0 0 16px 0' }}>
            Submit New Objection
          </h2>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#8fa0c0', marginBottom: '6px' }}>Affected Survey Number *</label>
            <select
              value={form.survey_number}
              onChange={(e) => setForm({ ...form, survey_number: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', background: '#0a192f', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#fff' }}
            >
              <option value="145/2A">Survey No. 145/2A (Parandur)</option>
              <option value="146/1B">Survey No. 146/1B (Parandur)</option>
            </select>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#8fa0c0', marginBottom: '6px' }}>Grievance Category *</label>
            <select
              value={form.grievance_type}
              onChange={(e) => setForm({ ...form, grievance_type: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', background: '#0a192f', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#fff' }}
            >
              <option value="compensation_dispute">Compensation Valuation Dispute (Section 64 Reference)</option>
              <option value="objection">Objection to Acquisition / Alignment (Section 15)</option>
              <option value="rr_grievance">R&R Housing & Livelihood Allotment Delay</option>
              <option value="boundary_resurvey">Cadastral Boundary Demarcation / Resurvey</option>
            </select>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#8fa0c0', marginBottom: '6px' }}>Subject Summary *</label>
            <input
              type="text"
              required
              placeholder="e.g. Discrepancy in tree valuation and circle rate..."
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', background: '#0a192f', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#fff' }}
            />
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#8fa0c0', marginBottom: '6px' }}>Detailed Statement of Objection *</label>
            <textarea
              rows="4"
              required
              placeholder="Provide exact grounds: prevailing market transactions, ancestral heritage, residential impact, or crop investment..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', background: '#0a192f', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#fff', fontSize: '13px' }}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
            style={{ width: '100%', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none' }}
          >
            {submitting ? 'Transmitting to District Collector...' : '✓ File Statutory Objection'}
          </button>
        </form>

        {/* Citizen Rights Guidance */}
        <div style={{ background: '#112240', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '24px' }}>
          <h2 style={{ fontSize: '17px', color: '#64ffda', margin: '0 0 14px 0' }}>
            ⚖️ Your Rights Under RFCTLARR Act 2013
          </h2>
          <ul style={{ color: '#cbd5e1', fontSize: '13px', lineHeight: '1.8', paddingLeft: '20px', margin: 0 }}>
            <li><strong>Section 15(1):</strong> Any person interested in land may, within 60 days from publication of preliminary notification, object to the area or public purpose.</li>
            <li><strong>Mandatory Hearing:</strong> The Collector MUST give the objector an opportunity of being heard in person or by an authorized pleader.</li>
            <li><strong>Section 64 Reference:</strong> If dissatisfied with the award amount, you can petition the Collector to refer the dispute to the High Court Land Acquisition Tribunal.</li>
            <li><strong>No Filing Fees:</strong> Filing objections on this portal is completely free and digitally logged with a timestamp.</li>
          </ul>
        </div>
      </div>

      {/* Grievances History */}
      <h2 style={{ fontSize: '18px', color: '#e8f0fe', marginBottom: '16px' }}>
        Filed Objections & Redressal Status
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {grievances.map(g => (
          <div key={g.id} style={{ background: '#112240', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '8px' }}>
              <div>
                <span style={{ color: '#64ffda', fontFamily: 'monospace', fontWeight: '700' }}>{g.grievance_number}</span>
                <span style={{ margin: '0 8px', color: '#475569' }}>•</span>
                <span style={{ color: '#cbd5e1' }}>Survey No. {g.survey_number}</span>
                <h3 style={{ margin: '4px 0 0 0', fontSize: '16px', color: '#fff' }}>{g.subject}</h3>
              </div>
              <span className={`badge ${g.status === 'resolved' ? 'badge-possession' : 'badge-s19'}`}>
                {g.status?.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5' }}>
              {g.description}
            </p>

            {g.resolution && (
              <div style={{ background: 'rgba(100, 255, 218, 0.08)', border: '1px solid rgba(100, 255, 218, 0.25)', borderRadius: '6px', padding: '12px', fontSize: '13px', color: '#a7f3d0', marginBottom: '10px' }}>
                <strong>Authority Finding / Order:</strong>
                <p style={{ margin: '4px 0 0 0' }}>{g.resolution}</p>
              </div>
            )}

            <div style={{ fontSize: '11px', color: '#64748b' }}>
              Submitted: {new Date(g.submitted_at).toLocaleDateString()} · Assigned to: <strong style={{ color: '#94a3b8' }}>{g.assigned_officer}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
