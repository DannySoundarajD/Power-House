const express = require('express');
const pool = require('../db/pool');
const auth = require('../middleware/auth');
const router = express.Router();

// GET /api/proposals
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT pr.*, p.name as project_name, p.project_code,
             u1.name as submitted_by_name, u2.name as reviewed_by_name
      FROM proposals pr
      LEFT JOIN projects p ON p.id = pr.project_id
      LEFT JOIN users u1 ON u1.id = pr.submitted_by
      LEFT JOIN users u2 ON u2.id = pr.reviewed_by
      ORDER BY pr.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch proposals' });
  }
});

// POST /api/proposals - Submit new proposal
router.post('/', auth, async (req, res) => {
  try {
    const { project_id, title, description, area_requested_ha, urgency } = req.body;
    const propNum = `PROP/CHN/${new Date().getFullYear()}/${Math.floor(Math.random() * 9000 + 1000)}`;

    const result = await pool.query(`
      INSERT INTO proposals (proposal_number, project_id, title, description, area_requested_ha, urgency, status, submitted_by, submitted_at)
      VALUES ($1, $2, $3, $4, $5, $6, 'submitted', $7, NOW())
      RETURNING *
    `, [propNum, project_id, title, description, area_requested_ha, urgency || 'normal', req.user.userId]);

    // Create initial workflow stages
    await pool.query(`
      INSERT INTO workflow_stages (proposal_id, stage_name, stage_order, assigned_role, deadline)
      VALUES ($1, 'Field Officer Submission', 1, 'field_officer', NOW() + INTERVAL '7 days'),
             ($1, 'District Collector Review', 2, 'district_collector', NOW() + INTERVAL '21 days'),
             ($1, 'State Officer Approval', 3, 'state_officer', NOW() + INTERVAL '30 days'),
             ($1, 'Central Ministry Endorsement', 4, 'central_admin', NOW() + INTERVAL '45 days')
    `, [result.rows[0].id]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create proposal' });
  }
});

// PATCH /api/proposals/:id/status - Approve/reject
router.patch('/:id/status', auth, async (req, res) => {
  const allowedRoles = ['district_collector', 'state_officer', 'central_admin'];
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }
  try {
    const { status, comments } = req.body;
    const col = req.user.role === 'state_officer' ? 'approved_by' : 'reviewed_by';
    const dateCol = req.user.role === 'state_officer' ? 'approved_at' : 'reviewed_at';

    await pool.query(`
      UPDATE proposals SET status = $1, ${col} = $2, ${dateCol} = NOW(),
      rejection_reason = $3, updated_at = NOW() WHERE id = $4
    `, [status, req.user.userId, comments || null, req.params.id]);

    // Update workflow stage
    await pool.query(`
      UPDATE workflow_stages SET status = $1, comments = $2, acted_at = NOW()
      WHERE proposal_id = $3 AND assigned_role = $4 AND status = 'pending'
    `, [status === 'approved' ? 'approved' : 'rejected', comments, req.params.id, req.user.role]);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update proposal' });
  }
});

// GET /api/proposals/:id/workflow
router.get('/:id/workflow', auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT ws.*, u.name as assigned_user_name, u.employee_id
      FROM workflow_stages ws LEFT JOIN users u ON u.id = ws.assigned_to
      WHERE ws.proposal_id = $1 ORDER BY ws.stage_order
    `, [req.params.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch workflow' });
  }
});

module.exports = router;
