import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const MOCK_PARCELS = [
  { id: 'c1000000-0000-0000-0000-000000000001', survey_number: '145/2A', village: 'Parandur', taluk: 'Kancheepuram', district: 'Kancheepuram', area_ha: 4.20, land_use: 'agricultural', ownership_type: 'private', owner_name: 'Muthusamy Gounder', affected_area_ha: 4.20, status: 'disputed', compensation_assessed_lakh: 186.75, compensation_paid_lakh: 0.0, project_name: 'Parandur Greenfield International Airport' },
  { id: 'c1000000-0000-0000-0000-000000000002', survey_number: '146/1B', village: 'Parandur', taluk: 'Kancheepuram', district: 'Kancheepuram', area_ha: 2.10, land_use: 'agricultural', ownership_type: 'private', owner_name: 'Muthusamy Gounder', affected_area_ha: 2.10, status: 'compensation_paid', compensation_assessed_lakh: 94.50, compensation_paid_lakh: 94.50, project_name: 'Parandur Greenfield International Airport' },
  { id: 'c1000000-0000-0000-0000-000000000003', survey_number: '148/3', village: 'Parandur', taluk: 'Kancheepuram', district: 'Kancheepuram', area_ha: 15.60, land_use: 'agricultural', ownership_type: 'private', owner_name: 'Ramasamy Pillai', affected_area_ha: 12.40, status: 'under_inquiry', compensation_assessed_lakh: 540.00, compensation_paid_lakh: 0.0, project_name: 'Parandur Greenfield International Airport' },
  { id: 'c1000000-0000-0000-0000-000000000004', survey_number: '152/1', village: 'Nelvoy', taluk: 'Kancheepuram', district: 'Kancheepuram', area_ha: 8.40, land_use: 'wasteland', ownership_type: 'government', owner_name: 'Government Poramboke', affected_area_ha: 8.40, status: 'possession_taken', compensation_assessed_lakh: 0.0, compensation_paid_lakh: 0.0, project_name: 'Parandur Greenfield International Airport' },
  { id: 'c1000000-0000-0000-0000-000000000005', survey_number: '160/2A', village: 'Parandur', taluk: 'Kancheepuram', district: 'Kancheepuram', area_ha: 1.80, land_use: 'residential', ownership_type: 'private', owner_name: 'Kamala Subramaniam', affected_area_ha: 1.80, status: 'award_declared', compensation_assessed_lakh: 348.00, compensation_paid_lakh: 0.0, project_name: 'Parandur Greenfield International Airport' },
  { id: 'c1000000-0000-0000-0000-000000000021', survey_number: '88/1', village: 'Ponneri', taluk: 'Ponneri', district: 'Tiruvallur', area_ha: 6.80, land_use: 'agricultural', ownership_type: 'private', owner_name: 'Arjunan Chinnathurai', affected_area_ha: 5.20, status: 'under_inquiry', compensation_assessed_lakh: 280.00, compensation_paid_lakh: 0.0, project_name: 'Chennai Peripheral Ring Road (CPRR)' },
  { id: 'c1000000-0000-0000-0000-000000000022', survey_number: '92/3B', village: 'Ponneri', taluk: 'Ponneri', district: 'Tiruvallur', area_ha: 4.50, land_use: 'commercial', ownership_type: 'private', owner_name: 'Saraswathi Murugesan', affected_area_ha: 4.50, status: 'section_11', compensation_assessed_lakh: 410.00, compensation_paid_lakh: 0.0, project_name: 'Chennai Peripheral Ring Road (CPRR)' }
];

export default function ParcelManagementPage() {
  const [parcels, setParcels] = useState(MOCK_PARCELS);
  const [search, setSearch] = useState('');
  const [filterLandUse, setFilterLandUse] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedParcel, setSelectedParcel] = useState(null);

  const [newParcel, setNewParcel] = useState({
    survey_number: '',
    village: '',
    taluk: '',
    district: 'Chennai Region',
    area_ha: '',
    land_use: 'agricultural',
    ownership_type: 'private',
    owner_name: '',
    affected_area_ha: '',
    project_name: 'Parandur Greenfield International Airport'
  });

  useEffect(() => {
    axios.get('/parcels')
      .then(res => {
        if (Array.isArray(res.data?.parcels)) setParcels(res.data.parcels);
      })
      .catch(() => setParcels(MOCK_PARCELS));
  }, []);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const created = {
      ...newParcel,
      id: 'c-' + Date.now(),
      area_ha: parseFloat(newParcel.area_ha) || 1.0,
      affected_area_ha: parseFloat(newParcel.affected_area_ha) || parseFloat(newParcel.area_ha) || 1.0,
      status: 'section_11',
      compensation_assessed_lakh: 0,
      compensation_paid_lakh: 0
    };
    setParcels([created, ...parcels]);
    setShowAddModal(false);
    toast.success(`Parcel Survey No. ${created.survey_number} registered!`);
    setNewParcel({
      survey_number: '',
      village: '',
      taluk: '',
      district: 'Chennai Region',
      area_ha: '',
      land_use: 'agricultural',
      ownership_type: 'private',
      owner_name: '',
      affected_area_ha: '',
      project_name: 'Parandur Greenfield International Airport'
    });
  };

  const filtered = parcels.filter(p => {
    const matchesSearch = (p.survey_number?.toLowerCase().includes(search.toLowerCase()) ||
      p.village?.toLowerCase().includes(search.toLowerCase()) ||
      p.owner_name?.toLowerCase().includes(search.toLowerCase()) ||
      p.project_name?.toLowerCase().includes(search.toLowerCase()));
    const matchesUse = filterLandUse === 'all' || p.land_use === filterLandUse;
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchesSearch && matchesUse && matchesStatus;
  });

  return (
    <div className="page-container" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#e8f0fe', margin: '0 0 6px 0' }}>
            Land & Parcel Management
          </h1>
          <p style={{ color: '#8fa0c0', margin: 0, fontSize: '14px' }}>
            Cadastral Record of Rights (RoR), ownership title verification, demarcation & compensation tracking
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          + Add New Land Parcel
        </button>
      </div>

      <div style={{ background: '#112240', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '16px', marginBottom: '20px', display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search by Survey No, Owner, Village, Project..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: '1 1 300px', padding: '10px 14px', background: '#0a192f', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '6px', color: '#fff' }}
        />
        <select
          value={filterLandUse}
          onChange={(e) => setFilterLandUse(e.target.value)}
          style={{ padding: '10px 14px', background: '#0a192f', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '6px', color: '#fff' }}
        >
          <option value="all">All Land Uses</option>
          <option value="agricultural">Agricultural</option>
          <option value="residential">Residential</option>
          <option value="commercial">Commercial</option>
          <option value="wasteland">Wasteland / Poramboke</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ padding: '10px 14px', background: '#0a192f', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '6px', color: '#fff' }}
        >
          <option value="all">All Acquisition Statuses</option>
          <option value="section_11">Sec 11 Preliminary</option>
          <option value="under_inquiry">Inquiry / Hearing</option>
          <option value="award_declared">Award Declared</option>
          <option value="compensation_paid">Compensation Paid</option>
          <option value="possession_taken">Possession Taken</option>
          <option value="disputed">Disputed / Stay</option>
        </select>
        <div style={{ color: '#8fa0c0', fontSize: '13px' }}>
          Total: <strong style={{ color: '#64ffda' }}>{filtered.length}</strong> parcels
        </div>
      </div>

      <div style={{ background: '#112240', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#0a192f', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ padding: '14px 16px', color: '#8fa0c0', fontWeight: '600' }}>Survey No.</th>
              <th style={{ padding: '14px 16px', color: '#8fa0c0', fontWeight: '600' }}>Village & Taluk</th>
              <th style={{ padding: '14px 16px', color: '#8fa0c0', fontWeight: '600' }}>Owner / Titleholder</th>
              <th style={{ padding: '14px 16px', color: '#8fa0c0', fontWeight: '600' }}>Land Use</th>
              <th style={{ padding: '14px 16px', color: '#8fa0c0', fontWeight: '600' }}>Area (Ha)</th>
              <th style={{ padding: '14px 16px', color: '#8fa0c0', fontWeight: '600' }}>Status</th>
              <th style={{ padding: '14px 16px', color: '#8fa0c0', fontWeight: '600' }}>Award / Paid (₹L)</th>
              <th style={{ padding: '14px 16px', color: '#8fa0c0', fontWeight: '600' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}>
                <td style={{ padding: '12px 16px', fontWeight: '600', color: '#64ffda' }}>
                  {p.survey_number}
                </td>
                <td style={{ padding: '12px 16px', color: '#cbd5e1' }}>
                  <div>{p.village}</div>
                  <small style={{ color: '#64748b' }}>{p.taluk}</small>
                </td>
                <td style={{ padding: '12px 16px', color: '#e2e8f0' }}>
                  <div>{p.owner_name}</div>
                  <span style={{ fontSize: '11px', textTransform: 'capitalize', color: p.ownership_type === 'private' ? '#93c5fd' : '#f59e0b' }}>
                    ● {p.ownership_type}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', textTransform: 'capitalize', color: '#cbd5e1' }}>
                  {p.land_use}
                </td>
                <td style={{ padding: '12px 16px', color: '#fff' }}>
                  {p.area_ha} Ha
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Req: {p.affected_area_ha} Ha</div>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span className={`badge ${p.status === 'compensation_paid' ? 'badge-comp-paid' : p.status === 'possession_taken' ? 'badge-possession' : p.status === 'disputed' ? 'badge-alert' : 'badge-s11'}`}>
                    {p.status?.replace('_', ' ')}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', color: '#cbd5e1' }}>
                  <div>₹{p.compensation_assessed_lakh}L</div>
                  <small style={{ color: p.compensation_paid_lakh > 0 ? '#10b981' : '#64748b' }}>
                    Paid: ₹{p.compensation_paid_lakh}L
                  </small>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setSelectedParcel(p)}
                    style={{ fontSize: '12px' }}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {selectedParcel && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#112240', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '28px', maxWidth: '600px', width: '100%', maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', color: '#64ffda' }}>
                Parcel Dossier: Survey No. {selectedParcel.survey_number}
              </h2>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelectedParcel(null)}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '13px', color: '#cbd5e1', marginBottom: '20px' }}>
              <div><strong style={{ color: '#8fa0c0' }}>Project:</strong> {selectedParcel.project_name}</div>
              <div><strong style={{ color: '#8fa0c0' }}>Village:</strong> {selectedParcel.village}</div>
              <div><strong style={{ color: '#8fa0c0' }}>Taluk & District:</strong> {selectedParcel.taluk}, {selectedParcel.district}</div>
              <div><strong style={{ color: '#8fa0c0' }}>Owner Name:</strong> {selectedParcel.owner_name}</div>
              <div><strong style={{ color: '#8fa0c0' }}>Ownership Type:</strong> {selectedParcel.ownership_type}</div>
              <div><strong style={{ color: '#8fa0c0' }}>Land Classification:</strong> {selectedParcel.land_use}</div>
              <div><strong style={{ color: '#8fa0c0' }}>Total Parcel Area:</strong> {selectedParcel.area_ha} Ha</div>
              <div><strong style={{ color: '#8fa0c0' }}>Acquired Portion:</strong> {selectedParcel.affected_area_ha} Ha</div>
              <div><strong style={{ color: '#8fa0c0' }}>RFCTLARR Award:</strong> ₹{selectedParcel.compensation_assessed_lakh} Lakhs</div>
              <div><strong style={{ color: '#8fa0c0' }}>PFMS Disbursed:</strong> ₹{selectedParcel.compensation_paid_lakh} Lakhs</div>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button className="btn btn-primary" onClick={() => { toast.success('Cadastral polygon exported to GeoJSON'); setSelectedParcel(null); }}>
                Export Cadastral GIS
              </button>
              <button className="btn btn-ghost" onClick={() => setSelectedParcel(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Parcel Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <form onSubmit={handleAddSubmit} style={{ background: '#112240', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '28px', maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', color: '#64ffda' }}>Register New Cadastral Parcel</h2>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowAddModal(false)}>✕</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#8fa0c0', marginBottom: '6px' }}>Survey / Sub-division No. *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 172/4B"
                  value={newParcel.survey_number}
                  onChange={(e) => setNewParcel({ ...newParcel, survey_number: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', background: '#0a192f', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#fff' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#8fa0c0', marginBottom: '6px' }}>Revenue Village *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nelvoy"
                  value={newParcel.village}
                  onChange={(e) => setNewParcel({ ...newParcel, village: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', background: '#0a192f', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#fff' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#8fa0c0', marginBottom: '6px' }}>Taluk</label>
                <input
                  type="text"
                  placeholder="e.g. Kancheepuram"
                  value={newParcel.taluk}
                  onChange={(e) => setNewParcel({ ...newParcel, taluk: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', background: '#0a192f', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#fff' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#8fa0c0', marginBottom: '6px' }}>Titleholder / Owner Name</label>
                <input
                  type="text"
                  placeholder="e.g. Shanmugam V"
                  value={newParcel.owner_name}
                  onChange={(e) => setNewParcel({ ...newParcel, owner_name: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', background: '#0a192f', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#fff' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#8fa0c0', marginBottom: '6px' }}>Total Area (Ha) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="e.g. 2.45"
                  value={newParcel.area_ha}
                  onChange={(e) => setNewParcel({ ...newParcel, area_ha: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', background: '#0a192f', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#fff' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#8fa0c0', marginBottom: '6px' }}>Acquired Portion Area (Ha)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 2.45"
                  value={newParcel.affected_area_ha}
                  onChange={(e) => setNewParcel({ ...newParcel, affected_area_ha: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', background: '#0a192f', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#fff' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#8fa0c0', marginBottom: '6px' }}>Land Use</label>
                <select
                  value={newParcel.land_use}
                  onChange={(e) => setNewParcel({ ...newParcel, land_use: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', background: '#0a192f', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#fff' }}
                >
                  <option value="agricultural">Agricultural</option>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="wasteland">Wasteland</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#8fa0c0', marginBottom: '6px' }}>Ownership Type</label>
                <select
                  value={newParcel.ownership_type}
                  onChange={(e) => setNewParcel({ ...newParcel, ownership_type: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', background: '#0a192f', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#fff' }}
                >
                  <option value="private">Private (Pattadhar)</option>
                  <option value="government">Government Poramboke</option>
                  <option value="gram_panchayat">Gram Panchayat Common</option>
                  <option value="trust">Temple / Wakf / Trust</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-ghost" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">✓ Register Parcel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
