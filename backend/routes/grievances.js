const express = require('express');
const pool = require('../db/pool');
const auth = require('../middleware/auth');
const router = express.Router();

// GET /api/grievances - List all grievances
router.get('/', auth, async (req, res) => {
  try {
    const { status, type, priority, search } = req.query;
    let query = `
      SELECT g.*, p.name as project_name, p.project_code,
             lp.village, lp.taluk, u.name as assigned_to_name
      FROM grievances g
      LEFT JOIN projects p ON p.id = g.project_id
      LEFT JOIN land_parcels lp ON lp.id = g.parcel_id
      LEFT JOIN users u ON u.id = g.assigned_to
      WHERE 1=1
    `;
    const params = [];

    if (status) { params.push(status); query += ` AND g.status = $${params.length}`; }
    if (type) { params.push(type); query += ` AND g.grievance_type = $${params.length}`; }
    if (priority) { params.push(priority); query += ` AND g.priority = $${params.length}`; }
    if (search) {
      params.push(`%${search}%`);
      query += ` AND (g.subject ILIKE $${params.length} OR g.grievance_number ILIKE $${params.length})`;
    }

    query += ' ORDER BY g.submitted_at DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch grievances' });
  }
});

// GET /api/grievances/:id - Single grievance detail
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT g.*, p.name as project_name, p.project_code,
             lp.survey_number, lp.village, lp.taluk,
             u.name as assigned_to_name, u.email as assigned_to_email
      FROM grievances g
      LEFT JOIN projects p ON p.id = g.project_id
      LEFT JOIN land_parcels lp ON lp.id = g.parcel_id
      LEFT JOIN users u ON u.id = g.assigned_to
      WHERE g.id = $1
    `, [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Grievance not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch grievance' });
  }
});

// POST /api/grievances - Submit new grievance (landowner)
router.post('/', async (req, res) => {
  try {
    const {
      project_id, parcel_id, landowner_name, survey_number,
      subject, description, grievance_type, phone
    } = req.body;

    // Generate grievance number
    const grvNum = `GRV/CHN/${new Date().getFullYear()}/${String(Math.floor(Math.random() * 9000 + 1000)).padStart(3, '0')}`;

    // Find or create landowner user
    let submitted_by = null;
    if (phone) {
      const userCheck = await pool.query('SELECT id FROM landowner_users WHERE phone = $1', [phone]);
      if (userCheck.rows.length > 0) {
        submitted_by = userCheck.rows[0].id;
      } else {
        const newUser = await pool.query(
          `INSERT INTO landowner_users (name, phone, phone_last4, survey_numbers)
           VALUES ($1, $2, $3, $4) RETURNING id`,
          [landowner_name, phone, phone.slice(-4), [survey_number]]
        );
        submitted_by = newUser.rows[0].id;
      }
    }

    const result = await pool.query(`
      INSERT INTO grievances (
        grievance_number, project_id, parcel_id, submitted_by, landowner_name,
        survey_number, subject, description, grievance_type, status, priority, submitted_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'submitted', 'normal', NOW())
      RETURNING *
    `, [grvNum, project_id, parcel_id, submitted_by, landowner_name, survey_number, subject, description, grievance_type]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit grievance' });
  }
});

// PATCH /api/grievances/:id/assign - Assign grievance to officer
router.patch('/:id/assign', auth, async (req, res) => {
  if (!['district_collector', 'state_officer'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }
  try {
    const { assigned_to } = req.body;
    await pool.query(
      `UPDATE grievances SET assigned_to = $1, status = 'acknowledged', updated_at = NOW()
       WHERE id = $2`,
      [assigned_to, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to assign grievance' });
  }
});

// PATCH /api/grievances/:id/resolve - Resolve grievance
router.patch('/:id/resolve', auth, async (req, res) => {
  if (!['district_collector', 'state_officer', 'field_officer'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }
  try {
    const { resolution, status } = req.body;
    await pool.query(
      `UPDATE grievances SET resolution = $1, status = $2, response_date = NOW(), updated_at = NOW()
       WHERE id = $3`,
      [resolution, status || 'resolved', req.params.id]
    );

    // Log audit
    await pool.query(
      `INSERT INTO audit_logs (table_name, record_id, action, new_data, changed_by, ip_address)
       VALUES ('grievances', $1, 'UPDATE', $2, $3, $4)`,
      [req.params.id, JSON.stringify({ resolution, status }), req.user.userId, req.ip]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to resolve grievance' });
  }
});

// GET /api/grievances/landowner/:phone - Get grievances by landowner phone
router.get('/landowner/:phone', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT g.*, p.name as project_name, p.project_code
      FROM grievances g
      LEFT JOIN projects p ON p.id = g.project_id
      LEFT JOIN landowner_users lu ON lu.id = g.submitted_by
      WHERE lu.phone = $1
      ORDER BY g.submitted_at DESC
    `, [req.params.phone]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch landowner grievances' });
  }
});

module.exports = router;
