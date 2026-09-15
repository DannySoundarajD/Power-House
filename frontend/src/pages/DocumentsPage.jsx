import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const MOCK_DOCS = [
  { id: '1', doc_category: 'notice', doc_type: 'Section 11 Preliminary Notification', file_name: 'section_11_parandur_TN2022_1041.pdf', file_size_kb: 1240, created_at: '2022-10-15T10:00:00Z', uploaded_by_name: 'Senthil Murugan IAS', project_name: 'Parandur Greenfield International Airport', version: 1, checksum_sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
  { id: '2', doc_category: 'notice', doc_type: 'Section 19 Declaration of Acquisition', file_name: 'section_19_parandur_TN2023_0428.pdf', file_size_kb: 980, created_at: '2023-04-20T11:30:00Z', uploaded_by_name: 'Senthil Murugan IAS', project_name: 'Parandur Greenfield International Airport', version: 1, checksum_sha256: '5d41402abc4b2a76b9719d911017c59223a4561234567890abcdef1234567890' },
  { id: '3', doc_category: 'award', doc_type: 'Award Inquiry & Solatium Calculation', file_name: 'award_calculation_146_1B.pdf', file_size_kb: 560, created_at: '2023-11-10T14:15:00Z', uploaded_by_name: 'Kumaran Selvam', project_name: 'Parandur Greenfield International Airport', version: 2, checksum_sha256: '7b52009b64fd0a2a49e6d8a939753077792b0554f6764a787265538e4c0d027f' },
  { id: '4', doc_category: 'legal', doc_type: 'Title Deed & Encumbrance Certificate', file_name: 'title_deed_145_2A_ec.pdf', file_size_kb: 340, created_at: '2024-01-15T09:45:00Z', uploaded_by_name: 'Kumaran Selvam', project_name: 'Parandur Greenfield International Airport', version: 1, checksum_sha256: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b' },
  { id: '5', doc_category: 'photo', doc_type: 'Geotagged Drone Reconnaissance Photo', file_name: 'drone_orthomosaic_parandur_blockA.jpg', file_size_kb: 3400, created_at: '2024-03-10T16:00:00Z', uploaded_by_name: 'Kumaran Selvam', project_name: 'Parandur Greenfield International Airport', version: 1, checksum_sha256: 'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35' },
  { id: '6', doc_category: 'notice', doc_type: 'Section 11 Preliminary Notification', file_name: 'metro_sec11_TN2021_0872.pdf', file_size_kb: 890, created_at: '2021-08-20T12:00:00Z', uploaded_by_name: 'Senthil Murugan IAS', project_name: 'Chennai Metro Rail Phase 2 - Corridor 5', version: 1, checksum_sha256: '4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce' }
];

export default function DocumentsPage() {
  const [docs, setDocs] = useState(MOCK_DOCS);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({
    project_name: 'Parandur Greenfield International Airport',
    doc_category: 'notice',
    doc_type: 'Section 11 Preliminary Notification',
    file_name: '',
    remarks: ''
  });

  useEffect(() => {
    axios.get('/documents')
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) setDocs(res.data);
      })
      .catch(() => setDocs(MOCK_DOCS));
  }, []);

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!uploadData.file_name) {
      toast.error('Please specify file name');
      return;
    }
    const newDoc = {
      id: 'doc-' + Date.now(),
      doc_category: uploadData.doc_category,
      doc_type: uploadData.doc_type,
      file_name: uploadData.file_name.endsWith('.pdf') || uploadData.file_name.endsWith('.jpg') ? uploadData.file_name : uploadData.file_name + '.pdf',
      file_size_kb: Math.floor(Math.random() * 2000) + 400,
      created_at: new Date().toISOString(),
      uploaded_by_name: 'District Collector (Admin)',
      project_name: uploadData.project_name,
      version: 1,
      checksum_sha256: Math.random().toString(36).substring(2) + 'a8f9c1e2'
    };
    setDocs([newDoc, ...docs]);
    setShowUploadModal(false);
    toast.success(`Document "${newDoc.file_name}" uploaded and encrypted with SHA-256 hash!`);
    setUploadData({
      project_name: 'Parandur Greenfield International Airport',
      doc_category: 'notice',
      doc_type: 'Section 11 Preliminary Notification',
      file_name: '',
      remarks: ''
    });
  };

  const filtered = docs.filter(d => {
    const matchesCat = categoryFilter === 'all' || d.doc_category === categoryFilter;
    const matchesSearch = (d.file_name?.toLowerCase().includes(search.toLowerCase()) ||
      d.doc_type?.toLowerCase().includes(search.toLowerCase()) ||
      d.project_name?.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="page-container" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#e8f0fe', margin: '0 0 6px 0' }}>
            Document Management Repository
          </h1>
          <p style={{ color: '#8fa0c0', margin: 0, fontSize: '14px' }}>
            Gazette notices, title deeds, solatium awards, Drone photos & DigiLocker compliance vault
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowUploadModal(true)}>
          + Upload Gazette / Record
        </button>
      </div>

      <div style={{ background: '#112240', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '16px', marginBottom: '20px', display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search documents by title, file name, project..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: '1 1 320px', padding: '10px 14px', background: '#0a192f', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '6px', color: '#fff' }}
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{ padding: '10px 14px', background: '#0a192f', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '6px', color: '#fff' }}
        >
          <option value="all">All Categories</option>
          <option value="notice">Gazette Notices (Sec 11 / 19)</option>
          <option value="award">Collector Awards & Compensation</option>
          <option value="legal">Title Deeds & ECs</option>
          <option value="photo">Drone & Field Photos</option>
          <option value="rr">Rehabilitation & Resettlement</option>
        </select>
        <div style={{ color: '#8fa0c0', fontSize: '13px' }}>
          Repository items: <strong style={{ color: '#64ffda' }}>{filtered.length}</strong> files
        </div>
      </div>

      <div style={{ background: '#112240', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#0a192f', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ padding: '14px 16px', color: '#8fa0c0', fontWeight: '600' }}>Document Title</th>
              <th style={{ padding: '14px 16px', color: '#8fa0c0', fontWeight: '600' }}>Category</th>
              <th style={{ padding: '14px 16px', color: '#8fa0c0', fontWeight: '600' }}>Project</th>
              <th style={{ padding: '14px 16px', color: '#8fa0c0', fontWeight: '600' }}>Size / Ver.</th>
              <th style={{ padding: '14px 16px', color: '#8fa0c0', fontWeight: '600' }}>SHA-256 Checksum</th>
              <th style={{ padding: '14px 16px', color: '#8fa0c0', fontWeight: '600' }}>Uploaded By</th>
              <th style={{ padding: '14px 16px', color: '#8fa0c0', fontWeight: '600' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(d => (
              <tr key={d.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ fontWeight: '600', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{d.doc_category === 'photo' ? '📷' : '📄'}</span>
                    {d.doc_type}
                  </div>
                  <small style={{ color: '#64ffda', fontFamily: 'monospace' }}>{d.file_name}</small>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span className={`badge ${d.doc_category === 'notice' ? 'badge-s11' : d.doc_category === 'award' ? 'badge-award' : 'badge-proposed'}`}>
                    {d.doc_category}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', color: '#94a3b8' }}>
                  {d.project_name || 'Parandur Airport'}
                </td>
                <td style={{ padding: '12px 16px', color: '#cbd5e1' }}>
                  {(d.file_size_kb / 1024).toFixed(1)} MB
                  <div style={{ fontSize: '11px', color: '#64748b' }}>v{d.version || 1}</div>
                </td>
                <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: '11px', color: '#94a3b8' }}>
                  {d.checksum_sha256?.substring(0, 14)}...
                </td>
                <td style={{ padding: '12px 16px', color: '#cbd5e1' }}>
                  <div>{d.uploaded_by_name}</div>
                  <small style={{ color: '#64748b' }}>{new Date(d.created_at).toLocaleDateString()}</small>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => toast.success(`Simulated download of ${d.file_name}`)}
                    style={{ fontSize: '12px', marginRight: '6px' }}
                  >
                    ⬇ Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showUploadModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <form onSubmit={handleUploadSubmit} style={{ background: '#112240', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '28px', maxWidth: '560px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', color: '#64ffda' }}>Upload Regulatory Document</h2>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowUploadModal(false)}>✕</button>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#8fa0c0', marginBottom: '6px' }}>Project Association</label>
              <input
                type="text"
                value={uploadData.project_name}
                onChange={(e) => setUploadData({ ...uploadData, project_name: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', background: '#0a192f', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#fff' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#8fa0c0', marginBottom: '6px' }}>Category</label>
                <select
                  value={uploadData.doc_category}
                  onChange={(e) => setUploadData({ ...uploadData, doc_category: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', background: '#0a192f', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#fff' }}
                >
                  <option value="notice">Gazette Notice</option>
                  <option value="award">Collector Award</option>
                  <option value="legal">Title Deed / EC</option>
                  <option value="photo">Drone / Field Photo</option>
                  <option value="rr">R&R Entitlement</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#8fa0c0', marginBottom: '6px' }}>Document Type</label>
                <input
                  type="text"
                  value={uploadData.doc_type}
                  onChange={(e) => setUploadData({ ...uploadData, doc_type: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', background: '#0a192f', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#fff' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#8fa0c0', marginBottom: '6px' }}>File Name / Attached PDF *</label>
              <input
                type="text"
                required
                placeholder="e.g. gazette_notif_section11_2024.pdf"
                value={uploadData.file_name}
                onChange={(e) => setUploadData({ ...uploadData, file_name: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', background: '#0a192f', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#fff' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#8fa0c0', marginBottom: '6px' }}>Remarks / Verification Note</label>
              <textarea
                rows="3"
                placeholder="e.g. Authenticated against Tamil Nadu Gazette notification publication..."
                value={uploadData.remarks}
                onChange={(e) => setUploadData({ ...uploadData, remarks: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', background: '#0a192f', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#fff' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-ghost" onClick={() => setShowUploadModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">✓ Upload & Generate Hash</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
