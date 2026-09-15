const express = require('express');
const pool = require('../db/pool');
const auth = require('../middleware/auth');
const router = express.Router();

// GET /api/compensation - List all compensation records
router.get('/', auth, async (req, res) => {
  try {
    const { project_id, status } = req.query;
    let query = `
      SELECT c.*, p.name as project_name, p.project_code,
             lp.survey_number, lp.village, lp.taluk, lp.owner_name
      FROM compensation c
      LEFT JOIN projects p ON p.id = c.project_id
      LEFT JOIN land_parcels lp ON lp.id = c.parcel_id
      WHERE 1=1
    `;
    const params = [];

    if (project_id) { params.push(project_id); query += ` AND c.project_id = $${params.length}`; }
    if (status) { params.push(status); query += ` AND c.status = $${params.length}`; }

    query += ' ORDER BY c.created_at DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch compensation records' });
  }
});

// GET /api/compensation/summary - Compensation summary stats
router.get('/summary', auth, async (req, res) => {
  try {
    const overall = await pool.query(`
      SELECT
        COUNT(DISTINCT lp.id) as total_parcels,
        COALESCE(SUM(lp.compensation_assessed_lakh), 0) as total_assessed_lakh,
        COALESCE(SUM(lp.compensation_paid_lakh), 0) as total_paid_lakh,
        COUNT(CASE WHEN lp.compensation_paid_lakh >= lp.compensation_assessed_lakh AND lp.compensation_assessed_lakh > 0 THEN 1 END) as fully_paid_count,
        COUNT(CASE WHEN lp.compensation_paid_lakh > 0 AND lp.compensation_paid_lakh < lp.compensation_assessed_lakh THEN 1 END) as partially_paid_count,
        COUNT(CASE WHEN (lp.compensation_paid_lakh = 0 OR lp.compensation_paid_lakh IS NULL) AND lp.compensation_assessed_lakh > 0 THEN 1 END) as pending_count
      FROM land_parcels lp
    `);

    const byProject = await pool.query(`
      SELECT p.id, p.project_code, p.name,
        COUNT(lp.id) as parcel_count,
        COALESCE(SUM(lp.compensation_assessed_lakh), 0) as assessed_lakh,
        COALESCE(SUM(lp.compensation_paid_lakh), 0) as paid_lakh,
        CASE
          WHEN SUM(lp.compensation_assessed_lakh) > 0
          THEN ROUND((SUM(lp.compensation_paid_lakh) / SUM(lp.compensation_assessed_lakh) * 100)::numeric, 2)
          ELSE 0
        END as disbursement_rate_pct
      FROM projects p
      LEFT JOIN land_parcels lp ON lp.project_id = p.id
      GROUP BY p.id, p.project_code, p.name
      ORDER BY p.project_code
    `);

    res.json({
      overall: overall.rows[0],
      byProject: byProject.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch compensation summary' });
  }
});

// GET /api/compensation/project/:projectId - Compensation for specific project
router.get('/project/:projectId', auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT lp.*,
        CASE
          WHEN lp.compensation_paid_lakh >= lp.compensation_assessed_lakh AND lp.compensation_assessed_lakh > 0 THEN 'paid'
          WHEN lp.compensation_paid_lakh > 0 AND lp.compensation_paid_lakh < lp.compensation_assessed_lakh THEN 'partial'
          WHEN (lp.compensation_paid_lakh = 0 OR lp.compensation_paid_lakh IS NULL) AND lp.compensation_assessed_lakh > 0 THEN 'pending'
          ELSE 'not_assessed'
        END as payment_status
      FROM land_parcels lp
      WHERE lp.project_id = $1
      ORDER BY lp.survey_number
    `, [req.params.projectId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch project compensation' });
  }
});

// PATCH /api/compensation/:id/disburse - Record compensation disbursement
router.patch('/:id/disburse', auth, async (req, res) => {
  const allowedRoles = ['district_collector', 'state_officer'];
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }

  try {
    const { amount_disbursed_lakh, payment_reference, payment_mode } = req.body;
    const parcelId = req.params.id;

    // Update land parcel compensation paid
    await pool.query(
      `UPDATE land_parcels
       SET compensation_paid_lakh = compensation_paid_lakh + $1, updated_at = NOW()
       WHERE id = $2`,
      [amount_disbursed_lakh, parcelId]
    );

    // Update compensation table if exists
    await pool.query(
      `UPDATE compensation
       SET amount_disbursed_lakh = amount_disbursed_lakh + $1,
           disbursement_date = CURRENT_DATE,
           payment_reference = $2,
           payment_mode = $3,
           status = CASE
             WHEN amount_disbursed_lakh + $1 >= amount_assessed_lakh THEN 'paid'
             ELSE 'partial'
           END,
           updated_at = NOW()
       WHERE parcel_id = $4`,
      [amount_disbursed_lakh, payment_reference, payment_mode || 'NEFT', parcelId]
    );

    // Log audit
    await pool.query(
      `INSERT INTO audit_logs (table_name, record_id, action, new_data, changed_by, ip_address)
       VALUES ('compensation', $1, 'UPDATE', $2, $3, $4)`,
      [parcelId, JSON.stringify({ amount_disbursed_lakh, payment_reference }), req.user.userId, req.ip]
    );

    res.json({ success: true, message: 'Compensation disbursement recorded' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to record disbursement' });
  }
});

module.exports = router;
