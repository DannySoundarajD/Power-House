const express = require('express');
const pool = require('../db/pool');
const auth = require('../middleware/auth');
const router = express.Router();

// GET /api/field-collection - List all field entries
router.get('/', auth, async (req, res) => {
  try {
    const { project_id, parcel_id, officer_id, field_status, verified } = req.query;
    let query = `
      SELECT fe.*, lp.survey_number, lp.village, lp.taluk,
             p.name as project_name, p.project_code,
             u.name as officer_name
      FROM field_entries fe
      LEFT JOIN land_parcels lp ON lp.id = fe.parcel_id
      LEFT JOIN projects p ON p.id = fe.project_id
      LEFT JOIN users u ON u.id = fe.officer_id
      WHERE 1=1
    `;
    const params = [];

    if (project_id) { params.push(project_id); query += ` AND fe.project_id = $${params.length}`; }
    if (parcel_id) { params.push(parcel_id); query += ` AND fe.parcel_id = $${params.length}`; }
    if (officer_id) { params.push(officer_id); query += ` AND fe.officer_id = $${params.length}`; }
    if (field_status) { params.push(field_status); query += ` AND fe.field_status = $${params.length}`; }
    if (verified !== undefined) {
      params.push(verified === 'true');
      query += ` AND fe.is_verified = $${params.length}`;
    }

    query += ' ORDER BY fe.created_at DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch field entries' });
  }
});

// GET /api/field-collection/:id - Single field entry detail
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT fe.*, lp.survey_number, lp.village, lp.taluk, lp.owner_name,
             p.name as project_name, p.project_code,
             u.name as officer_name, u.employee_id
      FROM field_entries fe
      LEFT JOIN land_parcels lp ON lp.id = fe.parcel_id
      LEFT JOIN projects p ON p.id = fe.project_id
      LEFT JOIN users u ON u.id = fe.officer_id
      WHERE fe.id = $1
    `, [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Field entry not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch field entry' });
  }
});

// POST /api/field-collection - Create new field entry
router.post('/', auth, async (req, res) => {
  if (!['field_officer', 'district_collector'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Only field officers can create field entries' });
  }
  try {
    const {
      parcel_id, project_id, visit_date, gps_lat, gps_lng, gps_accuracy_m,
      field_status, land_use_actual, structures_present, structure_count,
      trees_present, irrigation_present, notes, photos_count
    } = req.body;

    const result = await pool.query(`
      INSERT INTO field_entries (
        parcel_id, project_id, officer_id, visit_date,
        gps_lat, gps_lng, gps_accuracy_m, field_status, land_use_actual,
        structures_present, structure_count, trees_present, irrigation_present,
        notes, photos_count, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW())
      RETURNING *
    `, [
      parcel_id, project_id, req.user.userId, visit_date || new Date().toISOString().split('T')[0],
      gps_lat, gps_lng, gps_accuracy_m, field_status, land_use_actual,
      structures_present || false, structure_count || 0,
      trees_present || false, irrigation_present || false,
      notes, photos_count || 0
    ]);

    // If verified, update parcel stage if needed
    if (field_status === 'verified') {
      await pool.query(
        `UPDATE land_parcels SET updated_at = NOW() WHERE id = $1`,
        [parcel_id]
      );
    }

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create field entry' });
  }
});

// PATCH /api/field-collection/:id/verify - Verify field entry
router.patch('/:id/verify', auth, async (req, res) => {
  if (!['district_collector', 'state_officer'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Insufficient permissions to verify' });
  }
  try {
    const { is_verified } = req.body;
    await pool.query(
      `UPDATE field_entries SET is_verified = $1 WHERE id = $2`,
      [is_verified, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to verify field entry' });
  }
});

// GET /api/field-collection/stats/summary - Field collection statistics
router.get('/stats/summary', auth, async (req, res) => {
  try {
    const statusStats = await pool.query(`
      SELECT field_status, COUNT(*) as count
      FROM field_entries
      GROUP BY field_status
    `);
    const verificationStats = await pool.query(`
      SELECT is_verified, COUNT(*) as count
      FROM field_entries
      GROUP BY is_verified
    `);
    const officerStats = await pool.query(`
      SELECT u.name, u.employee_id, COUNT(fe.id) as entries
      FROM field_entries fe
      JOIN users u ON u.id = fe.officer_id
      GROUP BY u.id, u.name, u.employee_id
      ORDER BY entries DESC
    `);

    res.json({
      statusStats: statusStats.rows,
      verificationStats: verificationStats.rows,
      officerStats: officerStats.rows
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

module.exports = router;
