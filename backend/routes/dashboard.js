const express = require('express');
const pool = require('../db/pool');
const auth = require('../middleware/auth');
const router = express.Router();

// GET /api/dashboard/summary - National KPI summary
router.get('/summary', auth, async (req, res) => {
  try {
    const kpi = await pool.query('SELECT * FROM v_national_kpi');
    const stageBreakdown = await pool.query(`
      SELECT current_stage, COUNT(*) as count, SUM(total_area_ha) as area_ha
      FROM projects GROUP BY current_stage ORDER BY current_stage
    `);
    const projectTypeBreakdown = await pool.query(`
      SELECT project_type, COUNT(*) as count FROM projects GROUP BY project_type
    `);
    const recentAlerts = await pool.query(`
      SELECT a.*, p.name as project_name, p.project_code
      FROM alerts a LEFT JOIN projects p ON p.id = a.project_id
      WHERE a.is_resolved = FALSE ORDER BY a.created_at DESC LIMIT 5
    `);
    const compensationTrend = await pool.query(`
      SELECT
        pt.project_type,
        SUM(lp.compensation_assessed_lakh) as assessed,
        SUM(lp.compensation_paid_lakh) as paid
      FROM land_parcels lp
      JOIN projects pt ON pt.id = lp.project_id
      GROUP BY pt.project_type
    `);
    const rrProgress = await pool.query(`
      SELECT
        rr_status,
        COUNT(*) as families,
        COUNT(CASE WHEN is_displaced THEN 1 END) as displaced
      FROM affected_families GROUP BY rr_status
    `);

    res.json({
      kpi: kpi.rows[0],
      stageBreakdown: stageBreakdown.rows,
      projectTypeBreakdown: projectTypeBreakdown.rows,
      recentAlerts: recentAlerts.rows,
      compensationTrend: compensationTrend.rows,
      rrProgress: rrProgress.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// GET /api/dashboard/timeline - Milestone timeline data
router.get('/timeline', auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT m.*, p.name as project_name, p.project_code, p.project_type
      FROM milestones m JOIN projects p ON p.id = m.project_id
      ORDER BY m.target_date ASC LIMIT 20
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch timeline' });
  }
});

module.exports = router;
