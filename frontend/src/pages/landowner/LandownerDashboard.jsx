import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const MOCK_LANDS = [
  {
    id: 'c1',
    survey_number: '145/2A',
    village: 'Parandur',
    taluk: 'Kancheepuram',
    district: 'Kancheepuram',
    area_ha: 4.20,
    land_use: 'agricultural',
    project_name: 'Parandur Greenfield International Airport',
    current_stage: 'Section 23 Award Declared',
    award_status: 'Award Declared (In High Court Reference)',
    compensation_estimated: 186.75,
    compensation_paid: 0.0,
    possession_status: 'Pending Award Resolution'
  },
  {
    id: 'c2',
    survey_number: '146/1B',
    village: 'Parandur',
    taluk: 'Kancheepuram',
    district: 'Kancheepuram',
    area_ha: 2.10,
    land_use: 'agricultural',
    project_name: 'Parandur Greenfield International Airport',
    current_stage: 'Compensation Paid',
    award_status: 'Award Disbursed via PFMS DBT',
    compensation_estimated: 94.50,
    compensation_paid: 94.50,
    possession_status: 'Possession Ready'
  }
];

export default function LandownerDashboard() {
  const [lands, setLands] = useState(MOCK_LANDS);
  const landowner = JSON.parse(localStorage.getItem('nlams_landowner_user') || 'null') || {
    name: 'Muthusamy Gounder',
    surveyNumbers: ['145/2A', '146/1B']
  };

  useEffect(() => {
    axios.get('/landowner/my-lands')
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) setLands(res.data);
      })
      .catch(() => setLands(MOCK_LANDS));
  }, []);

  const totalAssessed = lands.reduce((acc, curr) => acc + (parseFloat(curr.compensation_estimated) || 0), 0);
  const totalPaid = lands.reduce((acc, curr) => acc + (parseFloat(curr.compensation_paid) || 0), 0);

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{ background: 'linear-gradient(135deg, #112240 0%, #1e3a5f 100%)', border: '1px solid rgba(100, 255, 218, 0.2)', borderRadius: '14px', padding: '28px', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: '#64ffda', fontWeight: '700' }}>
            Verified Pattadhar Dashboard
          </span>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#fff', margin: '6px 0 8px 0' }}>
            Vanakkam, {landowner.name}
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '14px', margin: 0, maxWidth: '640px', lineHeight: '1.5' }}>
            Your revenue land records have been verified under the Tamil Nadu Digital Land Registry (DILRMP). Track your acquisition compensation, Solatium entitlements and statutory gazette orders in real time.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link to="/landowner/offer" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', padding: '10px 18px', fontSize: '13px' }}>
            🤝 Voluntary Land Offer (Innovation)
          </Link>
          <Link to="/landowner/grievances" className="btn btn-ghost" style={{ border: '1px solid rgba(255,255,255,0.2)', padding: '10px 18px', fontSize: '13px' }}>
            ⚖️ Submit Objection
          </Link>
        </div>
      </div>

      {/* KPI Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div style={{ background: '#112240', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: '#8fa0c0', textTransform: 'uppercase' }}>Registered Land Parcels</div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#64ffda', margin: '4px 0' }}>
            {lands.length} Parcels
          </div>
          <div style={{ fontSize: '12px', color: '#cbd5e1' }}>
            Total Area: <strong>{lands.reduce((a, b) => a + (parseFloat(b.area_ha) || 0), 0).toFixed(2)} Ha</strong> (15.5 Acres)
          </div>
        </div>

        <div style={{ background: '#112240', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: '#8fa0c0', textTransform: 'uppercase' }}>Total RFCTLARR Award</div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#fff', margin: '4px 0' }}>
            ₹{totalAssessed.toFixed(2)} Lakhs
          </div>
          <div style={{ fontSize: '12px', color: '#cbd5e1' }}>
            Includes 100% Solatium & 1.5x rural factor
          </div>
        </div>

        <div style={{ background: '#112240', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: '#8fa0c0', textTransform: 'uppercase' }}>PFMS Direct Disbursed</div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#10b981', margin: '4px 0' }}>
            ₹{totalPaid.toFixed(2)} Lakhs
          </div>
          <div style={{ fontSize: '12px', color: '#cbd5e1' }}>
            Balance Pending: ₹{(totalAssessed - totalPaid).toFixed(2)} Lakhs
          </div>
        </div>

        <div style={{ background: '#112240', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: '#8fa0c0', textTransform: 'uppercase' }}>R&R Entitlement Status</div>
          <div style={{ fontSize: '20px', fontWeight: '700', color: '#93c5fd', margin: '6px 0' }}>
            Eligible (Plot B-14)
          </div>
          <div style={{ fontSize: '12px', color: '#cbd5e1' }}>
            Kancheepuram Model Township
          </div>
        </div>
      </div>

      {/* Gazette Notice Alert Banner */}
      <div style={{ background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.35)', borderRadius: '12px', padding: '18px 24px', marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ fontSize: '28px' }}>📢</span>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#fef3c7' }}>
              Latest Statutory Publication: Section 23 Award Declaration Published
            </div>
            <div style={{ fontSize: '12px', color: '#cbd5e1' }}>
              Gazette No. AWD/KPM/2023/110 for Parandur Airport Block A issued by District Collector, Kancheepuram.
            </div>
          </div>
        </div>
        <Link to="/landowner/notices" className="btn btn-ghost btn-sm" style={{ border: '1px solid #f59e0b', color: '#fef3c7', fontSize: '12px' }}>
          View Gazette Document →
        </Link>
      </div>

      {/* My Land Parcels Detailed Cards */}
      <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#e8f0fe', marginBottom: '16px' }}>
        My Affected Land Parcels & Status
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {lands.map(l => (
          <div key={l.id} style={{ background: '#112240', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <span style={{ fontSize: '18px', fontWeight: '800', color: '#64ffda' }}>
                  Survey No. {l.survey_number}
                </span>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                  Village: {l.village} · Taluk: {l.taluk}
                </div>
              </div>
              <span className={`badge ${l.compensation_paid > 0 ? 'badge-comp-paid' : 'badge-award'}`}>
                {l.current_stage}
              </span>
            </div>

            <div style={{ fontSize: '13px', color: '#cbd5e1', marginBottom: '16px' }}>
              Project: <strong style={{ color: '#fff' }}>{l.project_name}</strong>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: '#0a192f', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '12px', color: '#cbd5e1' }}>
              <div>Area Acquired: <strong>{l.area_ha} Ha</strong></div>
              <div>Classification: <strong style={{ textTransform: 'capitalize' }}>{l.land_use}</strong></div>
              <div>Assessed Award: <strong style={{ color: '#fff' }}>₹{l.compensation_estimated}L</strong></div>
              <div>DBT Disbursed: <strong style={{ color: l.compensation_paid > 0 ? '#10b981' : '#f59e0b' }}>₹{l.compensation_paid}L</strong></div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <Link to={`/landowner/status?survey=${encodeURIComponent(l.survey_number)}`} className="btn btn-primary btn-sm" style={{ fontSize: '12px' }}>
                Track 9 Stages →
              </Link>
              <Link to="/landowner/compensation" className="btn btn-ghost btn-sm" style={{ fontSize: '12px' }}>
                View Calculation
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
