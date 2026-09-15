export default function LandownerCompensationPage() {
  const breakdown = [
    { component: '1. Base Market Value (Section 26)', basis: 'Prevailing Circle Rate: ₹18.00 Lakhs / Acre × 10.37 Acres', amountLakhs: 186.66 },
    { component: '2. Rural Area Multiplication Factor (Section 26(2))', basis: 'Distance factor 1.5x on market rate for rural revenue village', amountLakhs: 93.33 },
    { component: '3. Valuation of Assets Attached to Land (Section 29)', basis: 'Horticulture & PWD evaluation: 1 borewell, 14 coconut palms, 1 pumpshed', amountLakhs: 12.80 },
    { component: '4. 100% Mandatory Solatium (Section 30(1))', basis: 'Statutory 100% solatium compensation over total market valuation', amountLakhs: 280.00 },
    { component: '5. Additional Interest @ 12% p.a. (Section 30(3))', basis: 'Calculated from Section 11 preliminary notification date to award date', amountLakhs: 34.20 }
  ];

  const totalCompensation = 606.99;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#e8f0fe', margin: '0 0 6px 0' }}>
          RFCTLARR Act 2013 Compensation Award
        </h1>
        <p style={{ color: '#8fa0c0', margin: 0, fontSize: '14px' }}>
          Statutory solatium, market value multiplier & PFMS treasury direct credit summary for Survey No. 145/2A
        </p>
      </div>

      {/* Hero Award Card */}
      <div style={{ background: 'linear-gradient(135deg, #112240 0%, #1e3a5f 100%)', border: '1px solid rgba(100, 255, 218, 0.3)', borderRadius: '14px', padding: '28px', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: '#64ffda', fontWeight: '700' }}>
            Final Assessed Land Award (Section 27)
          </span>
          <div style={{ fontSize: '36px', fontWeight: '800', color: '#fff', margin: '8px 0' }}>
            ₹{totalCompensation.toFixed(2)} Lakhs
          </div>
          <div style={{ fontSize: '13px', color: '#cbd5e1' }}>
            Acquired Extent: <strong>4.20 Hectares (10.37 Acres)</strong> · Parandur Village, Kancheepuram
          </div>
        </div>

        <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', borderRadius: '10px', padding: '16px 22px', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#a7f3d0', textTransform: 'uppercase', fontWeight: '600' }}>
            Section 96 Tax Exemption
          </div>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#10b981', margin: '4px 0' }}>
            100% TAX FREE
          </div>
          <div style={{ fontSize: '11px', color: '#cbd5e1' }}>
            No TDS / Capital Gains Deductions
          </div>
        </div>
      </div>

      {/* Itemized Breakdown Table */}
      <div style={{ background: '#112240', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '24px', marginBottom: '28px' }}>
        <h2 style={{ fontSize: '17px', color: '#64ffda', margin: '0 0 16px 0' }}>
          Itemized Valuation Schedule
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#0a192f', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '12px 16px', color: '#8fa0c0' }}>Statutory Component</th>
                <th style={{ padding: '12px 16px', color: '#8fa0c0' }}>Computation Basis</th>
                <th style={{ padding: '12px 16px', color: '#8fa0c0', textAlign: 'right' }}>Amount (₹ Lakhs)</th>
              </tr>
            </thead>
            <tbody>
              {breakdown.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '14px 16px', fontWeight: '600', color: '#f8fafc' }}>
                    {item.component}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#cbd5e1' }}>
                    {item.basis}
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: '700', color: '#64ffda' }}>
                    ₹{item.amountLakhs.toFixed(2)}L
                  </td>
                </tr>
              ))}
              <tr style={{ background: 'rgba(100, 255, 218, 0.05)' }}>
                <td colSpan="2" style={{ padding: '16px', fontWeight: '800', color: '#fff', fontSize: '15px' }}>
                  Total Statutory Compensation Award
                </td>
                <td style={{ padding: '16px', textAlign: 'right', fontWeight: '800', color: '#64ffda', fontSize: '18px' }}>
                  ₹{totalCompensation.toFixed(2)} Lakhs
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Direct Benefit Transfer (DBT) Status */}
      <div style={{ background: '#112240', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '24px' }}>
        <h2 style={{ fontSize: '17px', color: '#64ffda', margin: '0 0 16px 0' }}>
          PFMS Direct Benefit Transfer (DBT) Disbursal Information
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          <div style={{ background: '#0a192f', padding: '14px', borderRadius: '8px' }}>
            <div style={{ fontSize: '12px', color: '#8fa0c0' }}>Designated Bank</div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff', marginTop: '4px' }}>State Bank of India</div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Parandur Branch (SBIN0001429)</div>
          </div>

          <div style={{ background: '#0a192f', padding: '14px', borderRadius: '8px' }}>
            <div style={{ fontSize: '12px', color: '#8fa0c0' }}>Bank Account Number</div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#64ffda', marginTop: '4px' }}>••••••••4812</div>
            <div style={{ fontSize: '11px', color: '#10b981' }}>✓ Aadhaar NPCI Seeded</div>
          </div>

          <div style={{ background: '#0a192f', padding: '14px', borderRadius: '8px' }}>
            <div style={{ fontSize: '12px', color: '#8fa0c0' }}>PFMS Treasury Status</div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#f59e0b', marginTop: '4px' }}>Pending High Court Reference</div>
            <div style={{ fontSize: '11px', color: '#cbd5e1' }}>Escrow Deposit Ready</div>
          </div>
        </div>

        <div style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.6', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '8px', padding: '14px' }}>
          <strong>ℹ️ Disbursal Advisory:</strong> As per Section 64 reference, upon formal resolution of the circle rate hearing, 100% of the compensation will be credited directly to your bank account via the Reserve Bank of India e-Kuber treasury gateway within 72 hours.
        </div>
      </div>
    </div>
  );
}
