import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const FACTORS = [
  { id: 'settlements', label: 'Low Settlement Density', desc: 'Minimizes displacement of rural habitations', weight: '20%' },
  { id: 'multicrop', label: 'Minimal Multi-Crop Agri', desc: 'Protects fertile food-security paddy acreage', weight: '20%' },
  { id: 'forest', label: 'Eco & Forest Buffer', desc: 'Distance from protected zones & reserve forests', weight: '10%' },
  { id: 'infra', label: 'Low Infrastructure Disruption', desc: 'Avoids demolition of existing roads, pipelines', weight: '10%' },
  { id: 'complexity', label: 'Low Historical Litigation Risk', desc: 'Based on historical title dispute records', weight: '10%' },
  { id: 'connectivity', label: 'Multi-Modal Logistics Access', desc: 'Proximity to highways, rail sidings & ports', weight: '10%' },
  { id: 'disaster', label: 'Flood & Waterbody Safety', desc: 'Elevation above 100-yr flood levels', weight: '10%' },
  { id: 'social', label: 'Social Safeguard Compliance', desc: 'Low SC/ST concentration & fair SIA ratio', weight: '10%' }
];

export default function SuitabilityPage() {
  const [projectId, setProjectId] = useState('b1000000-0000-0000-0000-000000000001');
  const [data, setData] = useState(null);
  const [evaluating, setEvaluating] = useState(false);
  const [customWeights, setCustomWeights] = useState({
    settlements: 38,
    multicrop: 25,
    forest: 78,
    infra: 60,
    complexity: 42,
    connectivity: 72,
    disaster: 65,
    social: 35
  });

  useEffect(() => {
    axios.get(`/innovations/suitability/${projectId}`)
      .then(res => {
        if (res.data) setData(res.data);
      })
      .catch(() => {
        // Fallback mock
        setData({
          project_name: 'Parandur Greenfield International Airport',
          proposed_area_ha: 1900,
          overall_score: 52,
          recommendation: 'CONDITIONAL',
          score_settlements: 38,
          score_multicrop: 25,
          score_forest: 78,
          score_infrastructure: 60,
          score_complexity: 42,
          score_connectivity: 72,
          score_disaster_risk: 65,
          score_social_sensitivity: 35,
          reasoning: 'The Parandur site scores 52/100. Key concerns: (1) High multi-crop agricultural land concentration (75% of proposed area is paddy/sugarcane — RFCTLARR Section 10 mandates food security assessment), (2) 15+ villages within acquisition boundary with ~4,200 families, (3) Historical acquisition litigation in Kancheepuram region is high (avg 8.2 years). Site is technically feasible but will require significant R&R budget and legal dispute mitigation.',
          alternatives: [
            {
              name: 'Alternative Corridor Alpha (Sriperumbudur West)',
              score: 74,
              area_ha: 1820,
              reason: 'Lower settlement density, existing SIPCOT industrial infrastructure reduces cost, good rail connectivity. Multi-crop land only 24%.'
            },
            {
              name: 'Alternative Corridor Beta (Maraimalai Nagar Extension)',
              score: 68,
              area_ha: 1950,
              reason: 'Higher industrial wasteland percentage, low forest proximity, coastal access advantage. Moderate drainage mitigation needed.'
            }
          ]
        });
      });
  }, [projectId]);

  const handleRecalculate = () => {
    setEvaluating(true);
    setTimeout(() => {
      const overall = Math.round(
        (customWeights.settlements * 0.2) +
        (customWeights.multicrop * 0.2) +
        (customWeights.forest * 0.1) +
        (customWeights.infra * 0.1) +
        (customWeights.complexity * 0.1) +
        (customWeights.connectivity * 0.1) +
        (customWeights.disaster * 0.1) +
        (customWeights.social * 0.1)
      );
      const rec = overall >= 70 ? 'SUITABLE' : overall >= 50 ? 'CONDITIONAL' : 'NOT_RECOMMENDED';
      setData(prev => ({
        ...prev,
        overall_score: overall,
        recommendation: rec,
        score_settlements: customWeights.settlements,
        score_multicrop: customWeights.multicrop,
        score_forest: customWeights.forest,
        score_infrastructure: customWeights.infra,
        score_complexity: customWeights.complexity,
        score_connectivity: customWeights.connectivity,
        score_disaster_risk: customWeights.disaster,
        score_social_sensitivity: customWeights.social
      }));
      setEvaluating(false);
      toast.success(`AI Suitability re-evaluated! Composite Score: ${overall}/100 (${rec})`);
    }, 700);
  };

  if (!data) return <div className="loading-state"><div className="spinner" /></div>;

  const getScoreColor = (score) => {
    if (score >= 70) return '#10b981';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="page-container" style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '20px' }}>🌟</span>
            <span style={{ fontSize: '12px', background: 'rgba(100, 255, 218, 0.1)', color: '#64ffda', padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>
              INNOVATION 1
            </span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#e8f0fe', margin: 0 }}>
            AI Land Suitability & Alignment Analyser
          </h1>
          <p style={{ color: '#8fa0c0', margin: '4px 0 0 0', fontSize: '14px' }}>
            Multi-Criteria Decision Analysis (MCDA) evaluating 8 geospatial layers before Section 11 gazette notification
          </p>
        </div>

        <div>
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            style={{ padding: '10px 14px', background: '#112240', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#fff', fontSize: '13px' }}
          >
            <option value="b1000000-0000-0000-0000-000000000001">Parandur Greenfield International Airport</option>
            <option value="b1000000-0000-0000-0000-000000000002">Chennai Metro Rail Phase 2 - Corridor 5</option>
            <option value="b1000000-0000-0000-0000-000000000008">Chennai Peripheral Ring Road (CPRR)</option>
          </select>
        </div>
      </div>

      {/* Main Score Hero */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        <div style={{ background: '#112240', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            border: `6px solid ${getScoreColor(data.overall_score)}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            fontWeight: '800',
            color: '#fff',
            flexShrink: 0
          }}>
            {data.overall_score}
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#8fa0c0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Composite Suitability Score
            </div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: getScoreColor(data.overall_score), margin: '4px 0' }}>
              {data.recommendation}
            </div>
            <div style={{ fontSize: '13px', color: '#cbd5e1' }}>
              Target Land: <strong>{data.proposed_area_ha} Hectares</strong>
            </div>
          </div>
        </div>

        <div style={{ background: '#112240', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '24px' }}>
          <div style={{ fontSize: '12px', color: '#8fa0c0', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
            AI Executive Finding
          </div>
          <p style={{ margin: 0, fontSize: '13px', color: '#cbd5e1', lineHeight: '1.6' }}>
            {data.reasoning}
          </p>
        </div>
      </div>

      {/* 8-Factor Breakdown & Interactive Weights */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px', marginBottom: '28px' }}>
        <div style={{ background: '#112240', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '24px' }}>
          <h2 style={{ fontSize: '16px', color: '#64ffda', margin: '0 0 18px 0' }}>
            Layer Breakdown (MCDA Evaluation)
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {FACTORS.map(f => {
              const val = customWeights[f.id] || 50;
              return (
                <div key={f.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                    <span style={{ color: '#e2e8f0', fontWeight: '500' }}>
                      {f.label} <small style={{ color: '#8fa0c0' }}>({f.weight})</small>
                    </span>
                    <span style={{ fontWeight: '700', color: getScoreColor(val) }}>
                      {val}/100
                    </span>
                  </div>
                  <div style={{ height: '8px', background: '#0a192f', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${val}%`, height: '100%', background: getScoreColor(val), transition: 'width 0.4s ease' }} />
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>{f.desc}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ background: '#112240', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '16px', color: '#64ffda', margin: '0 0 14px 0' }}>
              Sensitivity & What-If Simulation
            </h2>
            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.5', margin: '0 0 18px 0' }}>
              Adjust factor scores based on updated ground surveys, public hearing concessions, or revised alignment buffers:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#8fa0c0', marginBottom: '4px' }}>
                  Settlement Protection ({customWeights.settlements})
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={customWeights.settlements}
                  onChange={(e) => setCustomWeights({ ...customWeights, settlements: parseInt(e.target.value) })}
                  style={{ width: '100%', accentColor: '#64ffda' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#8fa0c0', marginBottom: '4px' }}>
                  Multi-Crop Agri ({customWeights.multicrop})
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={customWeights.multicrop}
                  onChange={(e) => setCustomWeights({ ...customWeights, multicrop: parseInt(e.target.value) })}
                  style={{ width: '100%', accentColor: '#64ffda' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#8fa0c0', marginBottom: '4px' }}>
                  Connectivity Access ({customWeights.connectivity})
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={customWeights.connectivity}
                  onChange={(e) => setCustomWeights({ ...customWeights, connectivity: parseInt(e.target.value) })}
                  style={{ width: '100%', accentColor: '#64ffda' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#8fa0c0', marginBottom: '4px' }}>
                  Litigation Mitigation ({customWeights.complexity})
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={customWeights.complexity}
                  onChange={(e) => setCustomWeights({ ...customWeights, complexity: parseInt(e.target.value) })}
                  style={{ width: '100%', accentColor: '#64ffda' }}
                />
              </div>
            </div>
          </div>

          <button
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={evaluating}
            onClick={handleRecalculate}
          >
            {evaluating ? 'Simulating Multi-Criteria Model...' : '⚡ Re-Run AI Suitability Model'}
          </button>
        </div>
      </div>

      {/* AI Suggested Alternative Corridors */}
      <h2 style={{ fontSize: '18px', color: '#e8f0fe', marginBottom: '14px' }}>
        🤖 AI Suggested Alternative Siting Corridors
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {data.alternatives?.map((alt, idx) => (
          <div key={idx} style={{ background: '#112240', border: '1px solid rgba(100, 255, 218, 0.25)', borderRadius: '12px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '15px', color: '#fff' }}>{alt.name}</h3>
              <span style={{ fontSize: '14px', fontWeight: '700', color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                Score: {alt.score}/100
              </span>
            </div>
            <div style={{ fontSize: '12px', color: '#64ffda', marginBottom: '8px' }}>
              Area: {alt.area_ha} Ha
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5' }}>
              {alt.reason}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
