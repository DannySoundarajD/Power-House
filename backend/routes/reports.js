const express = require('express');
const pool = require('../db/pool');
const auth = require('../middleware/auth');
const router = express.Router();

// GET /api/reports/project-summary - Comprehensive project report
router.get('/project-summary', auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        ps.*,
        (SELECT COUNT(*) FROM milestones m WHERE m.project_id = ps.id AND m.is_achieved = TRUE) as achieved_milestones,
        (SELECT COUNT(*) FROM milestones m WHERE m.project_id = ps.id) as total_milestones,
        (SELECT COUNT(*) FROM alerts a WHERE a.project_id = ps.id AND a.is_resolved = FALSE) as active_alerts,
        (SELECT COUNT(*) FROM grievances g WHERE g.project_id = ps.id AND g.status != 'resolved') as pending_grievances
      FROM v_project_summary ps ORDER BY ps.project_code
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate project summary report' });
  }
});

// GET /api/reports/compensation-report - Compensation disbursement report
router.get('/compensation-report', auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.project_code, p.name, p.project_type, p.district,
        COUNT(DISTINCT lp.id) as total_parcels,
        SUM(lp.area_ha) as total_area_ha,
        SUM(lp.compensation_assessed_lakh) as assessed_lakh,
        SUM(lp.compensation_paid_lakh) as paid_lakh,
        CASE
          WHEN SUM(lp.compensation_assessed_lakh) > 0
          THEN ROUND((SUM(lp.compensation_paid_lakh) / SUM(lp.compensation_assessed_lakh) * 100)::numeric, 2)
          ELSE 0
        END as disbursement_rate_pct,
        COUNT(DISTINCT CASE WHEN lp.compensation_paid_lakh >= lp.compensation_assessed_lakh THEN lp.id END) as fully_paid_parcels
      FROM projects p
      LEFT JOIN land_parcels lp ON lp.project_id = p.id
      GROUP BY p.id, p.project_code, p.name, p.project_type, p.district
      ORDER BY p.project_code
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate compensation report' });
  }
});

// GET /api/reports/rr-report - R&R family-wise report
router.get('/rr-report', auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.project_code, p.name as project_name,
        COUNT(af.id) as total_families,
        COUNT(CASE WHEN af.is_displaced THEN 1 END) as displaced_families,
        COUNT(CASE WHEN af.category = 'SC' THEN 1 END) as sc_families,
        COUNT(CASE WHEN af.category = 'ST' THEN 1 END) as st_families,
        COUNT(CASE WHEN af.category = 'OBC' THEN 1 END) as obc_families,
        COUNT(CASE WHEN af.rr_status = 'completed' THEN 1 END) as rr_completed,
        COUNT(CASE WHEN af.rr_site_allotted THEN 1 END) as site_allotted,
        COUNT(CASE WHEN af.rr_house_constructed THEN 1 END) as house_constructed,
        COUNT(CASE WHEN af.livelihood_restored THEN 1 END) as livelihood_restored
      FROM projects p
      LEFT JOIN affected_families af ON af.project_id = p.id
      GROUP BY p.id, p.project_code, p.name
      ORDER BY p.project_code
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate R&R report' });
  }
});

// GET /api/reports/acquisition-timeline - Project-wise timeline report
router.get('/acquisition-timeline', auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.project_code, p.name, p.start_date, p.target_completion,
        p.current_stage, p.progress_pct,
        n1.gazette_date as section11_date,
        n2.gazette_date as section19_date,
        (SELECT MIN(award_date) FROM land_parcels WHERE project_id = p.id) as first_award_date,
        (SELECT MAX(possession_date) FROM land_parcels WHERE project_id = p.id) as last_possession_date,
        CASE
          WHEN p.target_completion < CURRENT_DATE AND p.current_stage != 'closed'
          THEN EXTRACT(DAY FROM CURRENT_DATE - p.target_completion)::integer
          ELSE 0
        END as delay_days
      FROM projects p
      LEFT JOIN notifications n1 ON n1.project_id = p.id AND n1.notification_type = 'section_11'
      LEFT JOIN notifications n2 ON n2.project_id = p.id AND n2.notification_type = 'section_19'
      ORDER BY p.project_code
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate timeline report' });
  }
});

// GET /api/reports/export/csv - Export report as CSV
router.get('/export/csv', auth, async (req, res) => {
  const { type } = req.query;
  try {
    let query = '';
    let filename = 'report.csv';

    switch (type) {
      case 'project':
        query = 'SELECT * FROM v_project_summary ORDER BY project_code';
        filename = 'project_summary.csv';
        break;
      case 'compensation':
        query = `SELECT p.project_code, p.name, SUM(lp.compensation_assessed_lakh) as assessed,
                 SUM(lp.compensation_paid_lakh) as paid FROM projects p
                 LEFT JOIN land_parcels lp ON lp.project_id = p.id
                 GROUP BY p.id ORDER BY p.project_code`;
        filename = 'compensation_report.csv';
        break;
      case 'rr':
        query = 'SELECT * FROM affected_families ORDER BY registered_at';
        filename = 'rr_families.csv';
        break;
      default:
        return res.status(400).json({ error: 'Invalid report type' });
    }

    const result = await pool.query(query);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No data available' });
    }

    // Convert to CSV
    const headers = Object.keys(result.rows[0]);
    const csv = [
      headers.join(','),
      ...result.rows.map(row => headers.map(h => `"${row[h] || ''}"`).join(','))
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to export report' });
  }
});

module.exports = router;
