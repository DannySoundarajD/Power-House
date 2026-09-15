const express = require('express');
const pool = require('../db/pool');
const auth = require('../middleware/auth');
const router = express.Router();

// GET /api/projects - List all projects
router.get('/', auth, async (req, res) => {
  try {
    const { stage, type, search, page = 1, limit = 20 } = req.query;
    let query = 'SELECT * FROM v_project_summary WHERE 1=1';
    const params = [];

    if (stage) { params.push(stage); query += ` AND current_stage = $${params.length}`; }
    if (type) { params.push(type); query += ` AND project_type = $${params.length}`; }
    if (search) { params.push(`%${search}%`); query += ` AND (name ILIKE $${params.length} OR project_code ILIKE $${params.length})`; }

    query += ` ORDER BY updated_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

    const result = await pool.query(query, params);
    const countResult = await pool.query('SELECT COUNT(*) FROM v_project_summary');

    res.json({
      projects: result.rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      pages: Math.ceil(countResult.rows[0].count / limit)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// GET /api/projects/:id - Single project detail
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await pool.query('SELECT * FROM v_project_summary WHERE id = $1', [req.params.id]);
    if (project.rows.length === 0) return res.status(404).json({ error: 'Project not found' });

    const parcels = await pool.query(
      `SELECT *, ST_AsGeoJSON(geom) as geojson FROM land_parcels WHERE project_id = $1`,
      [req.params.id]
    );
    const notifications = await pool.query(
      'SELECT * FROM notifications WHERE project_id = $1 ORDER BY gazette_date DESC',
      [req.params.id]
    );
    const milestones = await pool.query(
      'SELECT * FROM milestones WHERE project_id = $1 ORDER BY target_date ASC',
      [req.params.id]
    );
    const families = await pool.query(
      'SELECT * FROM affected_families WHERE project_id = $1',
      [req.params.id]
    );
    const workflow = await pool.query(
      `SELECT ws.*, u.name as assigned_user_name
       FROM workflow_stages ws
       LEFT JOIN users u ON u.id = ws.assigned_to
       WHERE ws.proposal_id IN (SELECT id FROM proposals WHERE project_id = $1)
       ORDER BY ws.stage_order`,
      [req.params.id]
    );

    res.json({
      project: project.rows[0],
      parcels: parcels.rows,
      notifications: notifications.rows,
      milestones: milestones.rows,
      families: families.rows,
      workflow: workflow.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch project detail' });
  }
});

// PATCH /api/projects/:id/stage - Update project stage
router.patch('/:id/stage', auth, async (req, res) => {
  if (!['district_collector', 'state_officer', 'central_admin'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }
  try {
    const { stage, progress_pct } = req.body;
    const result = await pool.query(
      `UPDATE projects SET current_stage = $1, progress_pct = $2, updated_at = NOW()
       WHERE id = $3 RETURNING *`,
      [stage, progress_pct, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Project not found' });

    // Log audit
    await pool.query(
      `INSERT INTO audit_logs (table_name, record_id, action, new_data, changed_by, ip_address)
       VALUES ('projects', $1, 'UPDATE', $2, $3, $4)`,
      [req.params.id, JSON.stringify({ stage, progress_pct }), req.user.userId, req.ip]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update project stage' });
  }
});

module.exports = router;
