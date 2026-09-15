import { useState } from 'react';

const STAGES = [
  { id: 1, title: 'Project Proposal & SIA Study', section: 'RFCTLARR Section 4', status: 'completed', date: '2022-04-10', officer: 'District Collector, Kancheepuram', desc: 'Social Impact Assessment (SIA) study completed by Madras Institute of Development Studies. Environmental and livelihood impacts mapped.' },
  { id: 2, title: 'Preliminary Notification Published', section: 'RFCTLARR Section 11', status: 'completed', date: '2022-10-15', officer: 'Special DRO (Land Acquisition)', desc: 'Published in Tamil Nadu Government Gazette No. TN2022/1041. Land transactions frozen and survey boundaries established.' },
  { id: 3, title: 'Hearing of Objections Conducted', section: 'RFCTLARR Section 15', status: 'completed', date: '2023-01-20', officer: 'Revenue Divisional Officer', desc: 'Public hearing conducted at Parandur Taluk Office. 42 objections heard and recorded in the Collector inquiry report.' },
  { id: 4, title: 'Declaration of Acquisition', section: 'RFCTLARR Section 19', status: 'completed', date: '2023-04-20', officer: 'Government of Tamil Nadu', desc: 'Conclusive declaration that land is required for a public purpose. Gazette No. TN2023/0428 issued.' },
  { id: 5, title: 'Notice to Persons Interested', section: 'RFCTLARR Section 21', status: 'completed', date: '2023-08-12', officer: 'Special Tahsildar (LA)', desc: 'Individual notices served to all pattadhars to present claims for compensation, trees, structures, and livelihood losses.' },
  { id: 6, title: 'Collector Award Declaration', section: 'RFCTLARR Section 23', status: 'active', date: '2023-11-10', officer: 'District Collector (Awarding Authority)', desc: 'Award inquiry conducted. Base market value ₹18.00L/acre determined. 100% Solatium added. Currently in Section 64 reference inquiry.' },
  { id: 7, title: 'Direct Benefit Transfer (DBT)', section: 'PFMS Treasury Engine', status: 'pending', date: 'Expected Nov 2024', officer: 'District Treasury Officer', desc: 'Direct electronic transfer of compensation amount to pattadhar validated bank account via PFMS DBT.' },
  { id: 8, title: 'Rehabilitation & Resettlement (R&R)', section: 'RFCTLARR Schedule II', status: 'pending', date: 'Expected Dec 2024', officer: 'Administrator (R&R)', desc: 'Allotment of alternate residential plot in Model Township, subsistence allowance and relocation assistance.' },
  { id: 9, title: 'Physical Possession & Handover', section: 'RFCTLARR Section 38', status: 'pending', date: 'Expected Jan 2025', officer: 'Executive Magistrate & Requiring Body', desc: 'Encumbrance-free physical possession taken after 100% compensation and R&R benefits are paid in full.' }
];

export default function LandownerStatusPage() {
  const [survey] = useState('145/2A');

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#e8f0fe', margin: '0 0 6px 0' }}>
          9-Stage Acquisition Legal Pipeline Tracker
        </h1>
        <p style={{ color: '#8fa0c0', margin: 0, fontSize: '14px' }}>
          End-to-end statutory status for Survey No. <strong style={{ color: '#64ffda' }}>{survey}</strong> (Parandur Greenfield Airport)
        </p>
      </div>

      {/* Pipeline Progress Indicator */}
      <div style={{ background: '#112240', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '24px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '13px' }}>
          <span style={{ color: '#cbd5e1' }}>Overall Acquisition Lifecycle Completion</span>
          <span style={{ color: '#64ffda', fontWeight: '700' }}>Stage 6 of 9 (66% Complete)</span>
        </div>
        <div style={{ height: '10px', background: '#0a192f', borderRadius: '5px', overflow: 'hidden' }}>
          <div style={{ width: '66%', height: '100%', background: 'linear-gradient(90deg, #10b981, #64ffda)' }} />
        </div>
      </div>

      {/* Stage Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {STAGES.map((s) => {
          const isDone = s.status === 'completed';
          const isActive = s.status === 'active';
          return (
            <div
              key={s.id}
              style={{
                background: '#112240',
                border: `1px solid ${isActive ? '#64ffda' : isDone ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255,255,255,0.06)'}`,
                borderRadius: '12px',
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '20px',
                position: 'relative'
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: isDone ? 'rgba(16, 185, 129, 0.2)' : isActive ? 'rgba(100, 255, 218, 0.2)' : 'rgba(255,255,255,0.05)',
                color: isDone ? '#10b981' : isActive ? '#64ffda' : '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '800',
                fontSize: '16px',
                flexShrink: 0,
                border: `2px solid ${isDone ? '#10b981' : isActive ? '#64ffda' : '#334155'}`
              }}>
                {isDone ? '✓' : s.id}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '6px' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '16px', color: '#f8fafc', fontWeight: '700' }}>
                      {s.title}
                    </h3>
                    <div style={{ fontSize: '12px', color: '#64ffda', fontFamily: 'monospace' }}>
                      {s.section}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span className={`badge ${isDone ? 'badge-possession' : isActive ? 'badge-award' : 'badge-proposed'}`} style={{ fontSize: '11px' }}>
                      {isDone ? 'COMPLETED' : isActive ? 'CURRENT ACTIVE STAGE' : 'UPCOMING'}
                    </span>
                    <div style={{ fontSize: '11px', color: '#8fa0c0', marginTop: '4px' }}>
                      {s.date}
                    </div>
                  </div>
                </div>

                <p style={{ margin: '8px 0 10px 0', fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5' }}>
                  {s.desc}
                </p>

                <div style={{ fontSize: '11px', color: '#64748b' }}>
                  Statutory Authority: <strong style={{ color: '#94a3b8' }}>{s.officer}</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
