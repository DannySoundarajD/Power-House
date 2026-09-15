export default function LandownerRRPage() {
  const rrBenefits = [
    {
      benefit: 'Constructed Resettlement House / Free Plot',
      provision: 'RFCTLARR Act Schedule II, Para 1',
      entitlement: 'Free 50 sq.m constructed house with drinking water, road & sanitation in Kancheepuram Model Township, or cash grant of ₹4.50 Lakhs',
      status: 'Plot Allotted: Plot No. B-14',
      statusType: 'success'
    },
    {
      benefit: 'One-Time Resettlement Allowance',
      provision: 'RFCTLARR Act Schedule II, Para 2',
      entitlement: 'Lump-sum grant of ₹50,000 for each displaced family toward transportation and shifting cost',
      status: 'Approved for PFMS Disbursal',
      statusType: 'success'
    },
    {
      benefit: 'Monthly Subsistence Grant',
      provision: 'RFCTLARR Act Schedule II, Para 3',
      entitlement: 'Monthly allowance of ₹3,000 per month for a period of 12 months (₹36,000 Total)',
      status: 'Active (Month 4 of 12 Disbursed)',
      statusType: 'active'
    },
    {
      benefit: 'Cattle Shed / Agricultural Petty Shop Assistance',
      provision: 'RFCTLARR Act Schedule II, Para 8',
      entitlement: 'One-time financial assistance of ₹25,000 for families owning livestock or rural petty shops',
      status: 'Disbursed (₹25,000 Credited)',
      statusType: 'success'
    },
    {
      benefit: 'Mandatory Employment / Annuity Policy',
      provision: 'RFCTLARR Act Schedule II, Para 4',
      entitlement: 'Mandatory job training under PMKVY or lump-sum payment of ₹5,00,000 per affected family in lieu of employment',
      status: 'Opted for ₹5.00 Lakhs Lump-Sum',
      statusType: 'active'
    }
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#e8f0fe', margin: '0 0 6px 0' }}>
          Rehabilitation & Resettlement (R&R) Entitlements
        </h1>
        <p style={{ color: '#8fa0c0', margin: 0, fontSize: '14px' }}>
          Statutory welfare safeguards, alternative housing & livelihood package under RFCTLARR Act 2013 Schedule II
        </p>
      </div>

      {/* Entitlement Card Banner */}
      <div style={{ background: '#112240', border: '1px solid rgba(100, 255, 218, 0.2)', borderRadius: '14px', padding: '24px', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#64ffda', fontWeight: '700' }}>
            State Commissioner of Rehabilitation & Resettlement
          </span>
          <div style={{ fontSize: '20px', fontWeight: '800', color: '#fff', margin: '4px 0' }}>
            R&R Family Passbook: RR-TN-KPM-2023-00412
          </div>
          <div style={{ fontSize: '13px', color: '#cbd5e1' }}>
            Family Head: <strong>Muthusamy Gounder</strong> · Dependent Family Members: <strong>6 Persons</strong>
          </div>
        </div>

        <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', borderRadius: '8px', padding: '10px 18px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: '#a7f3d0', textTransform: 'uppercase' }}>Displacement Category</div>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#10b981' }}>Residential + Agricultural</div>
        </div>
      </div>

      {/* Package List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {rrBenefits.map((b, idx) => (
          <div
            key={idx}
            style={{
              background: '#112240',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '20px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: '16px'
            }}
          >
            <div style={{ flex: '1 1 500px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', color: '#f8fafc', fontWeight: '700' }}>
                  {b.benefit}
                </h3>
                <span style={{ fontSize: '11px', color: '#64ffda', fontFamily: 'monospace' }}>
                  {b.provision}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5' }}>
                {b.entitlement}
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span className={`badge ${b.statusType === 'success' ? 'badge-possession' : 'badge-award'}`} style={{ fontSize: '12px', padding: '6px 12px' }}>
                {b.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
