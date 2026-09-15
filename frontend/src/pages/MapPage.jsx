import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';

// Fix Leaflet default marker icon issue with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const STAGE_COLORS = {
  proposed:                '#6366f1',
  section_11_notification: '#3b82f6',
  section_19_declaration:  '#8b5cf6',
  award_declared:          '#f59e0b',
  compensation_assessed:   '#f97316',
  compensation_paid:       '#10b981',
  possession_taken:        '#059669',
  closed:                  '#6b7280',
};

const STAGE_LABELS = {
  proposed:                'Proposed',
  section_11_notification: 'Sec.11 Notified',
  section_19_declaration:  'Sec.19 Declared',
  award_declared:          'Award Declared',
  compensation_assessed:   'Comp. Assessed',
  compensation_paid:       'Comp. Paid',
  possession_taken:        'Possession Taken',
  closed:                  'Closed',
};

// Chennai representative parcels for when backend is offline
const MOCK_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: { type: 'Polygon', coordinates: [[[80.005, 12.815], [80.012, 12.815], [80.012, 12.820], [80.005, 12.820], [80.005, 12.815]]] },
      properties: { survey_number: '145/2A', owner_name: 'Muthusamy Gounder', village: 'Parandur', project_name: 'Parandur Greenfield Airport', project_code: 'CHN-ARPT-001', stage: 'section_19_declaration', area_ha: 12.45, compensation_assessed_lakh: 186.75, compensation_paid_lakh: 0 }
    },
    {
      type: 'Feature',
      geometry: { type: 'Polygon', coordinates: [[[80.012, 12.815], [80.019, 12.815], [80.019, 12.820], [80.012, 12.820], [80.012, 12.815]]] },
      properties: { survey_number: '146/1B', owner_name: 'Lakshmi Devi Selvam', village: 'Parandur', project_name: 'Parandur Greenfield Airport', project_code: 'CHN-ARPT-001', stage: 'award_declared', area_ha: 8.30, compensation_assessed_lakh: 124.50, compensation_paid_lakh: 62.25 }
    },
    {
      type: 'Feature',
      geometry: { type: 'Polygon', coordinates: [[[80.019, 12.815], [80.028, 12.815], [80.028, 12.821], [80.019, 12.821], [80.019, 12.815]]] },
      properties: { survey_number: '148/3', owner_name: 'Ramasamy Pillai', village: 'Parandhur', project_name: 'Parandur Greenfield Airport', project_code: 'CHN-ARPT-001', stage: 'section_11_notification', area_ha: 15.60, compensation_assessed_lakh: 234.00, compensation_paid_lakh: 0 }
    },
    {
      type: 'Feature',
      geometry: { type: 'Polygon', coordinates: [[[80.028, 12.815], [80.038, 12.815], [80.038, 12.822], [80.028, 12.822], [80.028, 12.815]]] },
      properties: { survey_number: '152/1', owner_name: 'Chinnaponnu Natarajan', village: 'Manambakkam', project_name: 'Parandur Greenfield Airport', project_code: 'CHN-ARPT-001', stage: 'compensation_paid', area_ha: 22.80, compensation_assessed_lakh: 342.00, compensation_paid_lakh: 342.00 }
    },
    {
      type: 'Feature',
      geometry: { type: 'Polygon', coordinates: [[[80.038, 12.815], [80.045, 12.815], [80.045, 12.820], [80.038, 12.820], [80.038, 12.815]]] },
      properties: { survey_number: '160/2A', owner_name: 'Kamala Subramaniam', village: 'Udayampalayam', project_name: 'Parandur Greenfield Airport', project_code: 'CHN-ARPT-001', stage: 'possession_taken', area_ha: 9.40, compensation_assessed_lakh: 282.00, compensation_paid_lakh: 282.00 }
    },
    {
      type: 'Feature',
      geometry: { type: 'Polygon', coordinates: [[[80.227, 12.901], [80.231, 12.901], [80.231, 12.904], [80.227, 12.904], [80.227, 12.901]]] },
      properties: { survey_number: '22/4B', owner_name: 'CMDA (Govt)', village: 'Sholinganallur', project_name: 'Chennai Metro Rail Phase 2', project_code: 'CHN-METR-002', stage: 'possession_taken', area_ha: 0.85, compensation_assessed_lakh: 127.50, compensation_paid_lakh: 127.50 }
    },
    {
      type: 'Feature',
      geometry: { type: 'Polygon', coordinates: [[[80.240, 12.982], [80.245, 12.982], [80.245, 12.986], [80.240, 12.986], [80.240, 12.982]]] },
      properties: { survey_number: '35/1A', owner_name: 'Residents Association OMR-42', village: 'Taramani', project_name: 'Chennai Metro Rail Phase 2', project_code: 'CHN-METR-002', stage: 'compensation_paid', area_ha: 1.20, compensation_assessed_lakh: 360.00, compensation_paid_lakh: 360.00 }
    },
    {
      type: 'Feature',
      geometry: { type: 'Polygon', coordinates: [[[80.201, 13.338], [80.209, 13.338], [80.209, 13.344], [80.201, 13.344], [80.201, 13.338]]] },
      properties: { survey_number: '88/1', owner_name: 'Arjunan Chinnathurai', village: 'Ponneri', project_name: 'Chennai Peripheral Ring Road Phase 1', project_code: 'CHN-RING-008', stage: 'section_11_notification', area_ha: 18.40, compensation_assessed_lakh: 276.00, compensation_paid_lakh: 0 }
    },
    {
      type: 'Feature',
      geometry: { type: 'Polygon', coordinates: [[[80.092, 13.115], [80.101, 13.115], [80.101, 13.122], [80.092, 13.122], [80.092, 13.115]]] },
      properties: { survey_number: '92/3B', owner_name: 'Saraswathi Murugesan', village: 'Avadi', project_name: 'Chennai Peripheral Ring Road Phase 1', project_code: 'CHN-RING-008', stage: 'proposed', area_ha: 25.60, compensation_assessed_lakh: 384.00, compensation_paid_lakh: 0 }
    },
  ]
};

function getStyle(feature) {
  const stage = feature.properties?.stage;
  const color = STAGE_COLORS[stage] || '#64748b';
  return {
    fillColor: color,
    weight: 2,
    opacity: 1,
    color: color,
    fillOpacity: 0.45,
  };
}

function onEachFeature(feature, layer) {
  const p = feature.properties;
  const paidPct = p.compensation_assessed_lakh > 0
    ? Math.round((p.compensation_paid_lakh / p.compensation_assessed_lakh) * 100)
    : 0;

  const popupContent = `
    <div style="min-width:220px">
      <div style="font-weight:700;font-size:14px;color:#e8f0fe;margin-bottom:8px">Survey No. ${p.survey_number}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:11px">
        <span style="color:#64748b">Village</span><span style="color:#e8f0fe">${p.village}</span>
        <span style="color:#64748b">Area</span><span style="color:#e8f0fe">${p.area_ha} Ha</span>
        <span style="color:#64748b">Owner</span><span style="color:#e8f0fe">${p.owner_name}</span>
        <span style="color:#64748b">Stage</span><span style="color:${STAGE_COLORS[p.stage]};font-weight:600">${STAGE_LABELS[p.stage] || p.stage}</span>
        <span style="color:#64748b">Project</span><span style="color:#e8f0fe">${p.project_code}</span>
        <span style="color:#64748b">Comp. Assessed</span><span style="color:#e8f0fe">₹${p.compensation_assessed_lakh}L</span>
        <span style="color:#64748b">Comp. Paid</span><span style="color:#10b981;font-weight:600">₹${p.compensation_paid_lakh}L (${paidPct}%)</span>
      </div>
      <div style="margin-top:8px;font-size:11px;font-weight:600;color:#94a3b8">${p.project_name}</div>
    </div>
  `;
  layer.bindPopup(popupContent);
  layer.on('mouseover', function() { this.setStyle({ fillOpacity: 0.7, weight: 3 }); });
  layer.on('mouseout', function() { this.setStyle(getStyle(feature)); });
}

export default function MapPage() {
  const [geojson, setGeojson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    axios.get('/parcels/geojson')
      .then(r => setGeojson(r.data))
      .catch(() => setGeojson(MOCK_GEOJSON))
      .finally(() => setLoading(false));
  }, []);

  const filteredGeo = geojson ? {
    ...geojson,
    features: filter === 'all'
      ? geojson.features
      : geojson.features.filter(f => f.properties.stage === filter)
  } : null;

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">GIS Map — Land Parcels</div>
          <div className="section-subtitle">
            Chennai District · {geojson?.features?.length || 0} parcels · Click any parcel for details
          </div>
        </div>
        <div className="flex gap-3">
          <select className="form-control" style={{ width: 200 }} value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="all">All Stages</option>
            {Object.entries(STAGE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="map-wrapper" style={{ position: 'relative' }}>
        {loading ? (
          <div className="loading-state" style={{ height: 600 }}>
            <div className="spinner" />
            <p>Loading GIS data...</p>
          </div>
        ) : (
          <MapContainer
            center={[13.08, 80.27]}
            zoom={10}
            style={{ height: 600, width: '100%' }}
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filteredGeo && (
              <GeoJSON
                key={filter}
                data={filteredGeo}
                style={getStyle}
                onEachFeature={onEachFeature}
              />
            )}
          </MapContainer>
        )}

        {/* Map Legend */}
        <div className="map-legend">
          <h4>Acquisition Stage</h4>
          {Object.entries(STAGE_LABELS).map(([stage, label]) => (
            <div key={stage} className="legend-item">
              <div className="legend-dot" style={{ background: STAGE_COLORS[stage] }} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Parcel Stats Row */}
      {geojson && (
        <div className="card mt-6">
          <div className="card-header">
            <div className="card-title">Parcel Summary by Stage</div>
          </div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {Object.entries(STAGE_LABELS).map(([stage, label]) => {
              const count = geojson.features.filter(f => f.properties.stage === stage).length;
              if (!count) return null;
              return (
                <div key={stage} onClick={() => setFilter(stage === filter ? 'all' : stage)}
                  style={{ flex: '1 1 140px', padding: 16, background: 'var(--bg-card-2)', borderRadius: 10,
                    border: `1px solid ${filter === stage ? STAGE_COLORS[stage] : 'var(--border)'}`,
                    cursor: 'pointer', transition: 'all 0.2s' }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: STAGE_COLORS[stage], marginBottom: 8 }} />
                  <div style={{ fontSize: 24, fontWeight: 800, color: STAGE_COLORS[stage] }}>{count}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{label}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
