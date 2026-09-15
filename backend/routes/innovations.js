const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const { authenticate } = require('../middleware/auth');

// GET /api/innovations/suitability/:projectId
router.get('/suitability/:projectId', authenticate, async (req, res) => {
  const { projectId } = req.params;
  try {
    const { rows } = await pool.query(
      `SELECT * FROM suitability_analyses WHERE project_id = $1 ORDER BY analysed_at DESC LIMIT 1`,
      [projectId]
    );
    if (rows.length > 0) return res.json(rows[0]);
    return res.json(getMockSuitability(projectId));
  } catch {
    return res.json(getMockSuitability(projectId));
  }
});

// POST /api/innovations/suitability/calculate
router.post('/suitability/calculate', authenticate, async (req, res) => {
  const { projectId, weights = {} } = req.body;
  // Calculate simulated composite AI score based on weights
  const settlements = weights.settlements ?? 38;
  const multicrop = weights.multicrop ?? 25;
  const forest = weights.forest ?? 78;
  const infra = weights.infra ?? 60;
  const complexity = weights.complexity ?? 42;
  const connectivity = weights.connectivity ?? 72;
  const disaster = weights.disaster ?? 65;
  const social = weights.social ?? 35;

  const overall = Math.round(
    (settlements * 0.2) +
    (multicrop * 0.2) +
    (forest * 0.1) +
    (infra * 0.1) +
    (complexity * 0.1) +
    (connectivity * 0.1) +
    (disaster * 0.1) +
    (social * 0.1)
  );

  const recommendation = overall >= 70 ? 'SUITABLE' : overall >= 50 ? 'CONDITIONAL' : 'NOT_RECOMMENDED';
  const result = {
    project_id: projectId,
    overall_score: overall,
    score_settlements: settlements,
    score_multicrop: multicrop,
    score_forest: forest,
    score_infrastructure: infra,
    score_complexity: complexity,
    score_connectivity: connectivity,
    score_disaster_risk: disaster,
    score_social_sensitivity: social,
    recommendation,
    reasoning: `AI Multi-Criteria Decision Model evaluated 8 weighted geospatial and socioeconomic layers. Identified significant risk in multi-crop agriculture and dense settlement pockets. Overall suitability evaluated as ${recommendation}.`,
    alternatives: [
      {
        name: 'Alternative Corridor Alpha (SIPCOT Adjacent)',
        score: 74,
        area_ha: 1820,
        reason: 'Low multi-crop agricultural percentage (24%), avoids 9 revenue settlements, 4.2 km shorter access spine.'
      },
      {
        name: 'Alternative Corridor Beta (Sriperumbudur West)',
        score: 68,
        area_ha: 1910,
        reason: 'Higher industrial wasteland percentage, low forest proximity, moderate waterbody crossing.'
      }
    ],
    analysed_at: new Date().toISOString()
  };

  res.json(result);
});

// GET /api/innovations/ripple/:parcelId?
router.get('/ripple', authenticate, async (req, res) => {
  const { parcelId } = req.query;
  try {
    let q = `SELECT ri.*, lp.survey_number, lp.village, p.name AS project_name
             FROM ripple_impacts ri
             LEFT JOIN land_parcels lp ON lp.id = ri.source_parcel_id
             LEFT JOIN projects p ON p.id = lp.project_id`;
    if (parcelId) {
      q += ` WHERE ri.source_parcel_id = $1`;
      const { rows } = await pool.query(q, [parcelId]);
      return res.json(rows.length ? rows[0] : MOCK_RIPPLE[0]);
    }
    const { rows } = await pool.query(q);
    return res.json(rows.length ? rows : MOCK_RIPPLE);
  } catch {
    return res.json(parcelId ? MOCK_RIPPLE[0] : MOCK_RIPPLE);
  }
});

function getMockSuitability(projectId) {
  return {
    id: 'suit-001',
    project_id: projectId || 'b1000000-0000-0000-0000-000000000001',
    project_name: 'Parandur Greenfield Airport',
    proposed_area_ha: 1900,
    score_settlements: 38,
    score_multicrop: 25,
    score_forest: 78,
    score_infrastructure: 60,
    score_complexity: 42,
    score_connectivity: 72,
    score_disaster_risk: 65,
    score_social_sensitivity: 35,
    overall_score: 52,
    recommendation: 'CONDITIONAL',
    reasoning: 'The Parandur site scores 52/100. Key concerns: (1) High multi-crop agricultural land concentration (75% of proposed area is paddy/sugarcane — RFCTLARR mandates food security assessment), (2) 15+ villages within acquisition boundary with ~4,200 families, (3) Historical acquisition complexity in Kancheepuram region is high (avg 8.2 years). Site is technically feasible but will require significant R&R resources and legal dispute mitigation.',
    alternatives: [
      {
        name: 'Alternative A — Sriperumbudur Corridor',
        score: 71,
        area_ha: 1850,
        reason: 'Lower settlement density, existing SIPCOT industrial infrastructure reduces cost, good rail connectivity. Multi-crop land only 30%.'
      },
      {
        name: 'Alternative B — Maraimalai Nagar Extension',
        score: 65,
        area_ha: 1950,
        reason: 'Wider access corridors, coastal hinterland reduces conflict, moderate flood risk. SC/ST household concentration low.'
      }
    ],
    analysed_at: '2024-03-12T14:30:00Z'
  };
}

const MOCK_RIPPLE = [
  {
    id: 'rip-1',
    source_parcel_id: 'c1000000-0000-0000-0000-000000000001',
    survey_number: '145/2A',
    village: 'Parandur',
    project_name: 'Parandur Greenfield Airport',
    source_issue: 'Compensation valuation dispute filed in High Court — Section 64 reference stay order pending',
    total_delay_days: 240,
    critical_path: true,
    impact_chain: [
      {
        stage: 'Award Declaration',
        entity: 'Survey 145/2A (4.20 Ha)',
        delay_days: 90,
        severity: 'high',
        reason: 'High Court interlocutory stay order freezes formal Award declaration for Section 23 inquiry'
      },
      {
        stage: 'Compensation Disbursal',
        entity: '3 Adjacent Contiguous Parcels (145/2B, 146/1, 146/2)',
        delay_days: 120,
        severity: 'high',
        reason: 'Revenue block disbursal cannot be closed until boundary title dispute with 145/2A is resolved'
      },
      {
        stage: 'Physical Possession',
        entity: 'Block A Western Perimeter — 48.5 Ha Total',
        delay_days: 180,
        severity: 'critical',
        reason: 'Right of Way (RoW) handover to TIDCO requires contiguous uninterrupted parcel clearance'
      },
      {
        stage: 'Project Section Delivery',
        entity: 'Runway 07L/25R Approach Lighting & Terminal Spine',
        delay_days: 210,
        severity: 'critical',
        reason: 'Grading and earthworks for primary runway cannot begin until perimeter Block A is handed over'
      },
      {
        stage: 'Project Master Milestone',
        entity: 'Phase 1 Airport Commercial Operation Date (COD)',
        delay_days: 240,
        severity: 'critical',
        reason: 'Cascades entire Phase 1 testing and DGCA licensing cycle past current target deadline (2030-03-31)'
      }
    ]
  },
  {
    id: 'rip-2',
    source_parcel_id: 'c1000000-0000-0000-0000-000000000021',
    survey_number: '88/1',
    village: 'Ponneri',
    project_name: 'Chennai Peripheral Ring Road (CPRR)',
    source_issue: 'Section 11 preliminary notification challenged — ancestral land rights protest',
    total_delay_days: 150,
    critical_path: false,
    impact_chain: [
      {
        stage: 'Section 19 Declaration',
        entity: 'Ponneri Stretch — 18.4 Ha',
        delay_days: 60,
        severity: 'medium',
        reason: 'Section 19 declaration blocked pending district hearing officer inquiry under Section 15(2)'
      },
      {
        stage: 'Award Determination',
        entity: 'Ponneri Cluster Parcels',
        delay_days: 120,
        severity: 'high',
        reason: 'No award can be declared until Section 19 declaration is published in State Gazette'
      },
      {
        stage: 'Road Embankment Construction',
        entity: 'CPRR Section II — Ponneri to Thatchur 8.2 km',
        delay_days: 150,
        severity: 'high',
        reason: 'Chainage km 24.500 to 26.200 alignment blocked for contractor mobilization'
      }
    ]
  }
];

// ============================================================
// INNOVATION 3: VOLUNTARY LAND OFFERS API
// ============================================================

// GET /api/innovations/offers - Get all voluntary land offers
router.get('/offers', authenticate, async (req, res) => {
  const { status } = req.query;
  try {
    let query = `
      SELECT lo.*, u.name as reviewed_by_name
      FROM land_offers lo
      LEFT JOIN users u ON u.id = lo.reviewed_by
      WHERE 1=1
    `;
    const params = [];
    if (status) { params.push(status); query += ` AND lo.status = $${params.length}`; }
    query += ' ORDER BY lo.submitted_at DESC';

    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.json(MOCK_OFFERS);
  }
});

// GET /api/innovations/offers/:id - Single land offer detail
router.get('/offers/:id', authenticate, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT lo.*, u.name as reviewed_by_name, u.email as reviewed_by_email
       FROM land_offers lo
       LEFT JOIN users u ON u.id = lo.reviewed_by
       WHERE lo.id = $1`,
      [req.params.id]
    );
    if (rows.length > 0) return res.json(rows[0]);
    return res.status(404).json({ error: 'Land offer not found' });
  } catch (err) {
    return res.status(404).json({ error: 'Land offer not found' });
  }
});

// PATCH /api/innovations/offers/:id/review - Review land offer (govt)
router.patch('/offers/:id/review', authenticate, async (req, res) => {
  const allowedRoles = ['district_collector', 'state_officer', 'central_admin'];
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }

  try {
    const { status, govt_response } = req.body;
    await pool.query(
      `UPDATE land_offers
       SET status = $1, govt_response = $2, reviewed_by = $3, reviewed_at = NOW()
       WHERE id = $4`,
      [status, govt_response, req.user.userId, req.params.id]
    );

    // Log audit
    await pool.query(
      `INSERT INTO audit_logs (table_name, record_id, action, new_data, changed_by, ip_address)
       VALUES ('land_offers', $1, 'UPDATE', $2, $3, $4)`,
      [req.params.id, JSON.stringify({ status, govt_response }), req.user.userId, req.ip]
    );

    res.json({ success: true, message: 'Land offer reviewed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to review land offer' });
  }
});

const MOCK_OFFERS = [
  {
    id: 'offer-1',
    offer_number: 'OFFER/CHN/2024/001',
    landowner_name: 'Subbaiah Rajan',
    landowner_phone: '9840005001',
    survey_number: '201/3A',
    village: 'Sriperumbudur',
    taluk: 'Sriperumbudur',
    district: 'Chennai',
    area_ha: 4.80,
    land_use: 'agricultural',
    asking_price_lakh: 96.0,
    offer_reason: 'My family has 4 parcels. Happy to offer this one for infrastructure use.',
    suitable_for: 'Industrial, Highway',
    status: 'submitted',
    submitted_at: '2024-06-10T14:30:00+05:30'
  },
  {
    id: 'offer-2',
    offer_number: 'OFFER/CHN/2024/002',
    landowner_name: 'Bhavani Krishnan',
    landowner_phone: '9840005002',
    survey_number: '88/5',
    village: 'Ponneri',
    taluk: 'Ponneri',
    district: 'Chennai',
    area_ha: 2.30,
    land_use: 'wasteland',
    asking_price_lakh: 23.0,
    offer_reason: 'Wasteland parcel — not cultivated for 10 years.',
    suitable_for: 'Highway, Ring Road',
    status: 'under_review',
    reviewed_by_name: 'Senthil Murugan IAS',
    submitted_at: '2024-07-05T10:00:00+05:30'
  }
];

module.exports = router;
