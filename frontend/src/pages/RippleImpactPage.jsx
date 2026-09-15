import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const MOCK_RIPPLES = [
  {
    id: 'rip-1',
    survey_number: '145/2A',
    village: 'Parandur',
    project_name: 'Parandur Greenfield International Airport',
    source_issue: 'Court stay order on Section 23 Award inquiry filed by pattadhar disputing base circle rate',
    total_delay_days: 240,
    critical_path: true,
    projected_cost_escalation_cr: 48.5,
    impact_chain: [
      {
        step: 1,
        stage: 'Award Declaration',
        entity: 'Survey No. 145/2A (4.20 Ha)',
        delay_days: 90,
        severity: 'high',
        reason: 'District Collector award determination frozen under High Court writ notice'
      },
      {
        step: 2,
        stage: 'Compensation DBT',
        entity: '3 Adjacent Contiguous Parcels (145/2B, 146/1, 146/2)',
        delay_days: 120,
        severity: 'high',
        reason: 'Revenue block disbursal cannot close until shared boundary line is demarcated'
      },
      {
        step: 3,
        stage: 'Physical Possession',
        entity: 'Block A Western Perimeter — 48.5 Ha Contiguous Belt',
        delay_days: 180,
        severity: 'critical',
        reason: 'Right of Way (RoW) handover requires unbroken clearance for perimeter security wall'
      },
      {
        step: 4,
        stage: 'Runway Civil Works',
        entity: 'Runway 07L/25R Approach Lighting & Terminal Spine',
        delay_days: 210,
        severity: 'critical',
        reason: 'Grading and earthworks for main runway cannot start without Block A clearance'
      },
      {
        step: 5,
        stage: 'Project Commissioning',
        entity: 'Phase 1 Commercial Operation Date (COD)',
        delay_days: 240,
        severity: 'critical',
        reason: 'Cascades entire Phase 1 flight calibration and DGCA licensing past target March 2030'
      }
    ]
  },
  {
    id: 'rip-2',
    survey_number: '88/1',
    village: 'Ponneri',
    project_name: 'Chennai Peripheral Ring Road (CPRR)',
    source_issue: 'Section 11 preliminary notification challenged — ancestral land rights protest',
    total_delay_days: 150,
    critical_path: false,
    projected_cost_escalation_cr: 14.2,
    impact_chain: [
      {
        step: 1,
        stage: 'Section 19 Declaration',
        entity: 'Ponneri Stretch — 18.4 Ha',
        delay_days: 60,
        severity: 'medium',
        reason: 'Declaration delayed pending Special Hearing under Section 15(2)'
      },
      {
        step: 2,
        stage: 'Collector Award',
        entity: 'Ponneri Cluster Parcels (6 parcels)',
        delay_days: 120,
        severity: 'high',
        reason: 'Awards cannot be passed without Section 19 publication in State Gazette'
      },
      {
        step: 3,
        stage: 'Road Embankment Works',
        entity: 'CPRR Section II — Ponneri to Thatchur 8.2 km',
        delay_days: 150,
        severity: 'high',
        reason: 'Chainage km 24.500 to 26.200 alignment blocked for contractor equipment mobilization'
      }
    ]
  }
];

export default function RippleImpactPage() {
  const [ripples] = useState(MOCK_RIPPLES);
  const [selectedRippleId, setSelectedRippleId] = useState(MOCK_RIPPLES[0].id);

  const active = ripples.find(r => r.id === selectedRippleId) || ripples[0];

  const getSeverityStyle = (sev) => {
    switch (sev) {
      case 'critical': return { bg: 'rgba(239, 68, 68, 0.15)', text: '#fca5a5', border: '#ef4444' };
      case 'high': return { bg: 'rgba(245, 158, 11, 0.15)', text: '#fde68a', border: '#f59e0b' };
      default: return { bg: 'rgba(59, 130, 246, 0.15)', text: '#93c5fd', border: '#3b82f6' };
    }
  };

  return (
    <div className="page-container" style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '20px' }}>⚡</span>
            <span style={{ fontSize: '12px', background: 'rgba(255, 123, 114, 0.15)', color: '#ff7b72', padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>
              INNOVATION 2
            </span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#e8f0fe', margin: 0 }}>
            Downstream Ripple Impact Analysis
          </h1>
          <p style={{ color: '#8fa0c0', margin: '4px 0 0 0', fontSize: '14px' }}>
            Calculates how a single legal objection or delay cascades through dependencies to project milestone slip
          </p>
        </div>

        <div>
          <select
            value={selectedRippleId}
            onChange={(e) => setSelectedRippleId(e.target.value)}
            style={{ padding: '10px 14px', background: '#112240', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#fff', fontSize: '13px' }}
          >
            {ripples.map(r => (
              <option key={r.id} value={r.id}>
                Survey No. {r.survey_number} ({r.village}) — {r.project_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div style={{ background: '#112240', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: '#8fa0c0', textTransform: 'uppercase', marginBottom: '6px' }}>
            Root Cause Parcel Dispute
          </div>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#64ffda' }}>
            Survey No. {active.survey_number}
          </div>
          <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '4px' }}>
            {active.village} · {active.project_name}
          </div>
        </div>

        <div style={{ background: '#112240', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: '#8fa0c0', textTransform: 'uppercase', marginBottom: '6px' }}>
            Cumulative Project Delay
          </div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#ef4444' }}>
            +{active.total_delay_days} Days
          </div>
          <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '4px' }}>
            Approx ~{(active.total_delay_days / 30).toFixed(1)} months milestone slip
          </div>
        </div>

        <div style={{ background: '#112240', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: '#8fa0c0', textTransform: 'uppercase', marginBottom: '6px' }}>
            Critical Path Classification
          </div>
          <div style={{ fontSize: '18px', fontWeight: '700', color: active.critical_path ? '#ff7b72' : '#f59e0b' }}>
            {active.critical_path ? '🔴 YES — On Critical Path' : '🟡 High Secondary Float'}
          </div>
          <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '4px' }}>
            Directly blocks primary contract milestone
          </div>
        </div>

        <div style={{ background: '#112240', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: '#8fa0c0', textTransform: 'uppercase', marginBottom: '6px' }}>
            Estimated Cost Escalation
          </div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#f59e0b' }}>
            ₹{active.projected_cost_escalation_cr} Crores
          </div>
          <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '4px' }}>
            Machinery idling, inflation & IDC interest
          </div>
        </div>
      </div>

      {/* Root Issue Card */}
      <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', padding: '18px', marginBottom: '28px' }}>
        <div style={{ fontSize: '12px', color: '#fca5a5', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>
          Trigger Event
        </div>
        <div style={{ fontSize: '15px', color: '#fef2f2', fontWeight: '600' }}>
          {active.source_issue}
        </div>
      </div>

      {/* Cascade Timeline Flow */}
      <h2 style={{ fontSize: '18px', color: '#e8f0fe', marginBottom: '16px' }}>
        Downstream Cascade Dependency Chain
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
        {active.impact_chain.map((step) => {
          const s = getSeverityStyle(step.severity);
          return (
            <div
              key={step.step}
              style={{
                background: '#112240',
                border: `1px solid ${s.border}`,
                borderRadius: '10px',
                padding: '18px 22px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                position: 'relative'
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: s.bg,
                color: s.text,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '16px',
                flexShrink: 0,
                border: `1px solid ${s.border}`
              }}>
                {step.step}
              </div>

              <div style={{ flex: '1 1 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '15px', fontWeight: '700', color: '#f8fafc' }}>
                    {step.stage}: {step.entity}
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#ef4444' }}>
                    +{step.delay_days} days delay
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.4' }}>
                  {step.reason}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recommended Action Plan */}
      <div style={{ background: '#112240', border: '1px solid rgba(100, 255, 218, 0.3)', borderRadius: '12px', padding: '24px' }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#64ffda' }}>
          🛡 District Collector Recommended Mitigation Strategy
        </h3>
        <ul style={{ margin: '0 0 16px 0', paddingLeft: '20px', fontSize: '13px', color: '#cbd5e1', lineHeight: '1.8' }}>
          <li>
            <strong>Fast-Track Hearing:</strong> Direct Special DRO to conduct expedited hearing under RFCTLARR Section 64 within 14 calendar days.
          </li>
          <li>
            <strong>Partial Possession Exemption:</strong> Issue Section 40(1) urgent possession notice for non-disputed sub-divisions in Block A to allow contractor earthworks to proceed on schedule.
          </li>
          <li>
            <strong>Escrow Solatium Deposit:</strong> Deposit contested ₹186.75L into LARRA Tribunal Escrow account to legally extinguish the injunction stay and clear Right of Way.
          </li>
        </ul>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => toast.success('Dispatched Fast-Track Directive to DRO (Land Acquisition) & Legal Cell')}
        >
          ✓ Dispatch Fast-Track Directive to DRO & Legal Cell
        </button>
      </div>
    </div>
  );
}
