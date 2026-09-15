import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const MOCK_OFFERS = [
  {
    id: 'off-01',
    offer_number: 'OFFER/CHN/2024/001',
    survey_number: '201/3A',
    village: 'Sriperumbudur',
    taluk: 'Sriperumbudur',
    area_ha: 4.80,
    land_use: 'agricultural',
    asking_price_lakh: 96.0,
    offer_reason: 'Family consolidating agricultural operations elsewhere. Offering parcel directly for industrial corridor or road widening.',
    suitable_for: 'Industrial Corridor, Highway Alignment',
    status: 'under_review',
    submitted_at: '2024-01-20T11:00:00Z',
    govt_response: 'Transmitted to SIPCOT Land Cell & NHAI PIU for alignment suitability review.'
  }
];

export default function LandOfferPage() {
  const [offers, setOffers] = useState(MOCK_OFFERS);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    survey_number: '',
    village: 'Parandur',
    taluk: 'Kancheepuram',
    area_ha: '',
    land_use: 'agricultural',
    asking_price_lakh: '',
    suitable_for: 'Highway corridor, Solar park, Industrial feeder',
    offer_reason: ''
  });

  useEffect(() => {
    axios.get('/landowner/offers')
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) setOffers(res.data);
      })
      .catch(() => setOffers(MOCK_OFFERS));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.survey_number || !form.area_ha || !form.offer_reason) {
      toast.error('Please provide survey number, land area and reason for voluntary offer');
      return;
    }
    setSubmitting(true);
    try {
      await axios.post('/landowner/offers', form);
    } catch {
      // Mock fallback
    }

    const newOffer = {
      id: 'off-' + Date.now(),
      offer_number: `OFFER/CHN/2024/${Math.floor(Math.random() * 800) + 100}`,
      survey_number: form.survey_number,
      village: form.village,
      taluk: form.taluk,
      area_ha: parseFloat(form.area_ha) || 1.5,
      land_use: form.land_use,
      asking_price_lakh: parseFloat(form.asking_price_lakh) || 45.0,
      offer_reason: form.offer_reason,
      suitable_for: form.suitable_for,
      status: 'submitted',
      submitted_at: new Date().toISOString(),
      govt_response: 'Logged into District Collector GIS Land Offer Layer. Pending department review.'
    };

    setOffers([newOffer, ...offers]);
    setSubmitting(false);
    toast.success(`Voluntary Land Offer ${newOffer.offer_number} submitted to District Administration!`);
    setForm({
      survey_number: '',
      village: 'Parandur',
      taluk: 'Kancheepuram',
      area_ha: '',
      land_use: 'agricultural',
      asking_price_lakh: '',
      suitable_for: 'Highway corridor, Solar park, Industrial feeder',
      offer_reason: ''
    });
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header with Innovation Badge */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span style={{ fontSize: '20px' }}>🌟</span>
          <span style={{ fontSize: '12px', background: 'rgba(100, 255, 218, 0.15)', color: '#64ffda', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
            INNOVATION 3 · CITIZEN-INITIATED ACQUISITION
          </span>
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#e8f0fe', margin: 0 }}>
          Voluntary Land Offer to Government
        </h1>
        <p style={{ color: '#8fa0c0', margin: '4px 0 0 0', fontSize: '14px' }}>
          Proactively offer unutilized or surplus land to Tamil Nadu Government & NHAI for planned corridors and industrial parks
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '28px', marginBottom: '36px' }}>
        {/* Submission Form */}
        <form onSubmit={handleSubmit} style={{ background: '#112240', border: '1px solid rgba(100, 255, 218, 0.2)', borderRadius: '12px', padding: '24px' }}>
          <h2 style={{ fontSize: '17px', color: '#64ffda', margin: '0 0 16px 0' }}>
            Register Land for Government Consideration
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#8fa0c0', marginBottom: '6px' }}>Survey / Sub-division No. *</label>
              <input
                type="text"
                required
                placeholder="e.g. 201/3A"
                value={form.survey_number}
                onChange={(e) => setForm({ ...form, survey_number: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', background: '#0a192f', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#fff' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#8fa0c0', marginBottom: '6px' }}>Total Area (Hectares) *</label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="e.g. 3.50"
                value={form.area_ha}
                onChange={(e) => setForm({ ...form, area_ha: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', background: '#0a192f', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#fff' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#8fa0c0', marginBottom: '6px' }}>Revenue Village *</label>
              <input
                type="text"
                required
                value={form.village}
                onChange={(e) => setForm({ ...form, village: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', background: '#0a192f', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#fff' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#8fa0c0', marginBottom: '6px' }}>Taluk *</label>
              <input
                type="text"
                required
                value={form.taluk}
                onChange={(e) => setForm({ ...form, taluk: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', background: '#0a192f', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#fff' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#8fa0c0', marginBottom: '6px' }}>Current Classification</label>
              <select
                value={form.land_use}
                onChange={(e) => setForm({ ...form, land_use: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', background: '#0a192f', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#fff' }}
              >
                <option value="agricultural">Agricultural / Wet Land</option>
                <option value="dry_land">Dry Cultivable Land</option>
                <option value="commercial">Commercial Plot</option>
                <option value="wasteland">Wasteland / Fallow</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#8fa0c0', marginBottom: '6px' }}>Expected Valuation (₹ Lakhs)</label>
              <input
                type="number"
                step="1"
                placeholder="Optional expected circle rate"
                value={form.asking_price_lakh}
                onChange={(e) => setForm({ ...form, asking_price_lakh: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', background: '#0a192f', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#fff' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#8fa0c0', marginBottom: '6px' }}>Suitable Public Use</label>
            <input
              type="text"
              placeholder="e.g. Highway bypass, Railway siding, Metro depot, Solar plant"
              value={form.suitable_for}
              onChange={(e) => setForm({ ...form, suitable_for: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', background: '#0a192f', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#fff' }}
            />
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#8fa0c0', marginBottom: '6px' }}>Reason for Voluntary Offer *</label>
            <textarea
              rows="3"
              required
              placeholder="e.g. Land is adjacent to NH-48 widening corridor. Family looking for fair RFCTLARR acquisition compensation..."
              value={form.offer_reason}
              onChange={(e) => setForm({ ...form, offer_reason: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', background: '#0a192f', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#fff', fontSize: '13px' }}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
            style={{ width: '100%', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none' }}
          >
            {submitting ? 'Submitting to Land Bank...' : '✓ Submit Voluntary Land Offer'}
          </button>
        </form>

        {/* How Innovation 3 Works */}
        <div style={{ background: '#112240', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '17px', color: '#64ffda', margin: '0 0 14px 0' }}>
              💡 How the Voluntary Land Offer Works
            </h2>
            <ul style={{ color: '#cbd5e1', fontSize: '13px', lineHeight: '1.8', paddingLeft: '20px', margin: '0 0 20px 0' }}>
              <li><strong>Not an Open Commercial Real Estate Marketplace:</strong> This is a direct government citizen interface to speed up public infrastructure projects.</li>
              <li><strong>Zero Litigation:</strong> Because the citizen voluntarily initiates the offer, expensive court stays and lengthy Section 15 inquiries are eliminated.</li>
              <li><strong>GIS Layer Integration:</strong> Your offered parcel appears as a green layer on the District Collector & PM GatiShakti alignment maps.</li>
              <li><strong>Statutory RFCTLARR Protections:</strong> When acquired, you still receive the full 100% Solatium and tax exemption under RFCTLARR Act 2013.</li>
            </ul>
          </div>

          <div style={{ background: '#0a192f', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', padding: '16px' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#10b981', marginBottom: '4px' }}>
              ⚡ Fast-Track Direct Purchase Mode
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: '#cbd5e1', lineHeight: '1.5' }}>
              Under Tamil Nadu Government Direct Purchase Rules (GO Ms No. 36), mutually agreed voluntary acquisitions can be disbursed within 30 days!
            </p>
          </div>
        </div>
      </div>

      {/* Submitted Offers History */}
      <h2 style={{ fontSize: '18px', color: '#e8f0fe', marginBottom: '16px' }}>
        My Submitted Land Offers & Government Review Status
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {offers.map(o => (
          <div key={o.id} style={{ background: '#112240', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
              <div>
                <span style={{ color: '#64ffda', fontFamily: 'monospace', fontWeight: '700' }}>{o.offer_number}</span>
                <span style={{ margin: '0 8px', color: '#475569' }}>•</span>
                <span style={{ color: '#fff', fontWeight: '700' }}>Survey No. {o.survey_number}</span>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                  {o.village}, {o.taluk} · Extent: <strong style={{ color: '#fff' }}>{o.area_ha} Hectares</strong>
                </div>
              </div>
              <span className={`badge ${o.status === 'under_review' ? 'badge-s19' : 'badge-possession'}`}>
                {o.status?.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5' }}>
              {o.offer_reason}
            </p>

            {o.govt_response && (
              <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '6px', padding: '12px', fontSize: '13px', color: '#a7f3d0' }}>
                <strong>🏛 District Administration Note:</strong>
                <p style={{ margin: '4px 0 0 0' }}>{o.govt_response}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
