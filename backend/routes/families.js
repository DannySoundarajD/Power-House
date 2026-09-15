const express = require('express');
const pool = require('../db/pool');
const auth = require('../middleware/auth');
const router = express.Router();

// GET /api/families - List all affected families
router.get('/', auth, async (req, res) => {
  try {
    const { project_id, rr_status, category, is_displaced } = req.query;
    let query = `
      SELECT af.*, p.name as project_name, p.project_code,
             lp.survey_number, lp.village, lp.taluk
      FROM affected_families af
      LEFT JOIN projects p ON p.id = af.project_id
      LEFT JOIN land_parcels lp ON lp.id = af.parcel_id
      WHERE 1=1
    `;
    const params = [];

    if (project_id) { params.push(project_id); query += ` AND af.project_id = $${params.length}`; }
    if (rr_status) { params.push(rr_status); query += ` AND af.rr_status = $${params.length}`; }
    if (category) { params.push(category); query += ` AND af.category = $${params.length}`; }
    if (is_displaced !== undefined) {
      params.push(is_displaced === 'true');
      query += ` AND af.is_displaced = $${params.length}`;
    }

    query += ' ORDER BY af.registered_at DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch affected families' });
  }
});

// GET /api/families/stats - R&R statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const overall = await pool.query(`
      SELECT
        COUNT(*) as total_families,
        COUNT(CASE WHEN is_displaced THEN 1 END) as displaced_families,
        COUNT(CASE WHEN category = 'SC' THEN 1 END) as sc_families,
        COUNT(CASE WHEN category = 'ST' THEN 1 END) as st_families,
        COUNT(CASE WHEN category = 'OBC' THEN 1 END) as obc_families,
        COUNT(CASE WHEN category = 'General' THEN 1 END) as general_families,
        SUM(family_size) as total_individuals
      FROM affected_families
    `);

    const rrProgress = await pool.query(`
      SELECT
        rr_status,
        COUNT(*) as count,
        COUNT(CASE WHEN is_displaced THEN 1 END) as displaced_count
      FROM affected_families
      GROUP BY rr_status
      ORDER BY
        CASE rr_status
          WHEN 'completed' THEN 1
          WHEN 'in_progress' THEN 2
          WHEN 'not_started' THEN 3
          ELSE 4
        END
    `);

    const benefits = await pool.query(`
      SELECT
        COUNT(CASE WHEN rr_site_allotted THEN 1 END) as site_allotted_count,
        COUNT(CASE WHEN rr_house_constructed THEN 1 END) as house_constructed_count,
        COUNT(CASE WHEN livelihood_restored THEN 1 END) as livelihood_restored_count
      FROM affected_families
    `);

    const byProject = await pool.query(`
      SELECT p.project_code, p.name,
        COUNT(af.id) as family_count,
        COUNT(CASE WHEN af.is_displaced THEN 1 END) as displaced_count,
        COUNT(CASE WHEN af.rr_status = 'completed' THEN 1 END) as rr_completed_count
      FROM projects p
      LEFT JOIN affected_families af ON af.project_id = p.id
      GROUP BY p.id, p.project_code, p.name
      HAVING COUNT(af.id) > 0
      ORDER BY p.project_code
    `);

    res.json({
      overall: overall.rows[0],
      rrProgress: rrProgress.rows,
      benefits: benefits.rows[0],
      byProject: byProject.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch R&R statistics' });
  }
});

// GET /api/families/project/:projectId - Families for specific project
router.get('/project/:projectId', auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT af.*, lp.survey_number, lp.village, lp.taluk, lp.owner_name
      FROM affected_families af
      LEFT JOIN land_parcels lp ON lp.id = af.parcel_id
      WHERE af.project_id = $1
      ORDER BY af.registered_at DESC
    `, [req.params.projectId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch project families' });
  }
});

// PATCH /api/families/:id/rr-update - Update R&R status
router.patch('/:id/rr-update', auth, async (req, res) => {
  const allowedRoles = ['district_collector', 'state_officer', 'field_officer'];
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }

  try {
    const {
      rr_status, rr_site_allotted, rr_house_constructed, livelihood_restored
    } = req.body;

    const updates = [];
    const params = [];
    let paramCount = 1;

    if (rr_status) {
      updates.push(`rr_status = $${paramCount++}`);
      params.push(rr_status);
    }
    if (rr_site_allotted !== undefined) {
      updates.push(`rr_site_allotted = $${paramCount++}`);
      params.push(rr_site_allotted);
    }
    if (rr_house_constructed !== undefined) {
      updates.push(`rr_house_constructed = $${paramCount++}`);
      params.push(rr_house_constructed);
    }
    if (livelihood_restored !== undefined) {
      updates.push(`livelihood_restored = $${paramCount++}`);
      params.push(livelihood_restored);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No updates provided' });
    }

    updates.push(`updated_at = NOW()`);
    params.push(req.params.id);

    await pool.query(
      `UPDATE affected_families SET ${updates.join(', ')} WHERE id = $${paramCount}`,
      params
    );

    // Log audit
    await pool.query(
      `INSERT INTO audit_logs (table_name, record_id, action, new_data, changed_by, ip_address)
       VALUES ('affected_families', $1, 'UPDATE', $2, $3, $4)`,
      [req.params.id, JSON.stringify(req.body), req.user.userId, req.ip]
    );

    res.json({ success: true, message: 'R&R status updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update R&R status' });
  }
});

module.exports = router;
