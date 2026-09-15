import toast from 'react-hot-toast';

const NOTICES = [
  {
    id: 'not-1',
    title: 'Section 11(1) Preliminary Notification & SIA Summary',
    gazetteNumber: 'TN-GAZ-2022-1041',
    date: '15th October 2022',
    issuingAuthority: 'Governor of Tamil Nadu / Commissioner (Land Acquisition)',
    fileSize: '1.2 MB PDF',
    fileName: 'section_11_parandur_TN2022_1041.pdf',
    description: 'Preliminary notification declaring intention to acquire lands in Parandur for greenfield airport. Freezes private land transactions and authorizes survey teams.'
  },
  {
    id: 'not-2',
    title: 'Section 19(1) Conclusive Declaration of Acquisition',
    gazetteNumber: 'TN-GAZ-2023-0428',
    date: '20th April 2023',
    issuingAuthority: 'Department of Industries, Investment Promotion & Commerce',
    fileSize: '980 KB PDF',
    fileName: 'section_19_parandur_TN2023_0428.pdf',
    description: 'Statutory declaration that land is conclusively required for public infrastructure. Formally transfers acquisition authority to the District Collector.'
  },
  {
    id: 'not-3',
    title: 'Section 21 Public Claims & Inquiry Notice to Pattadhars',
    gazetteNumber: 'RO/KPM/LA/2023/88',
    date: '12th August 2023',
    issuingAuthority: 'Special District Revenue Officer (LA)',
    fileSize: '420 KB PDF',
    fileName: 'notice_sec21_145.pdf',
    description: 'Personal summon served to pattadhar to appear and submit title deeds, bank account details, and claims for compensation & trees valuation.'
  },
  {
    id: 'not-4',
    title: 'Section 23 Collector Award & Solatium Determination',
    gazetteNumber: 'AWD/KPM/2023/110',
    date: '10th November 2023',
    issuingAuthority: 'District Collector, Kancheepuram District',
    fileSize: '750 KB PDF',
    fileName: 'award_calculation_145.pdf',
    description: 'Collector Award order detailing base circle value, 1.5x rural multiplier, 100% Solatium, and 12% additional interest under Section 30(3).'
  }
];

export default function LandownerNoticesPage() {
  const handleDownload = (n) => {
    toast.success(`Downloading verified Gazette notice: ${n.fileName}`);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#e8f0fe', margin: '0 0 6px 0' }}>
          Official Gazette Notifications & Legal Orders
        </h1>
        <p style={{ color: '#8fa0c0', margin: 0, fontSize: '14px' }}>
          Digitally signed gazette notifications published in Tamil Nadu Government Gazette and pushed to DigiLocker
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {NOTICES.map((n) => (
          <div
            key={n.id}
            style={{
              background: '#112240',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '22px 26px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px'
            }}
          >
            <div style={{ flex: '1 1 540px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <span style={{ fontSize: '20px' }}>📜</span>
                <h3 style={{ margin: 0, fontSize: '16px', color: '#f8fafc', fontWeight: '700' }}>
                  {n.title}
                </h3>
              </div>

              <div style={{ display: 'flex', gap: '14px', fontSize: '12px', color: '#64ffda', marginBottom: '8px', flexWrap: 'wrap' }}>
                <span>Gazette: <strong>{n.gazetteNumber}</strong></span>
                <span style={{ color: '#475569' }}>•</span>
                <span>Date: <strong>{n.date}</strong></span>
                <span style={{ color: '#475569' }}>•</span>
                <span style={{ color: '#10b981' }}>✓ DigiLocker Verified</span>
              </div>

              <p style={{ margin: 0, fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5' }}>
                {n.description}
              </p>
            </div>

            <div>
              <button
                className="btn btn-primary"
                onClick={() => handleDownload(n)}
                style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <span>⬇</span>
                <span>Download Gazette ({n.fileSize})</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
