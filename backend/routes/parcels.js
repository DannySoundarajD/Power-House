const express = require('express');
const pool = require('../db/pool');
const auth = require('../middleware/auth');
const router = express.Router();

// GET /api/parcels/geojson?project_id=xxx - GeoJSON for Leaflet
router.get('/geojson', auth, async (req, res) => {
  try {
    const { project_id } = req.query;
    let query = `
      SELECT
        lp.id, lp.survey_number, lp.patta_number, lp.village, lp.taluk,
        lp.area_ha, lp.land_use, lp.owner_name, lp.stage,
        lp.compensation_assessed_lakh, lp.compensation_paid_lakh,
        lp.section11_date, lp.section19_date, lp.award_date, lp.possession_date,
        p.name as project_name, p.project_code, p.project_type,
        ST_AsGeoJSON(lp.geom)::json as geometry
      FROM land_parcels lp
      JOIN projects p ON p.id = lp.project_id
      WHERE lp.geom IS NOT NULL
    `;
    const params = [];
    if (project_id) {
      params.push(project_id);
      query += ` AND lp.project_id = $${params.length}`;
    }

    const result = await pool.query(query, params);

    const geojson = {
      type: 'FeatureCollection',
      features: result.rows.map(row => ({
        type: 'Feature',
        geometry: row.geometry,
        properties: {
          id: row.id,
          survey_number: row.survey_number,
          patta_number: row.patta_number,
          village: row.village,
          taluk: row.taluk,
          area_ha: parseFloat(row.area_ha),
          land_use: row.land_use,
          owner_name: row.owner_name,
          stage: row.stage,
          compensation_assessed_lakh: parseFloat(row.compensation_assessed_lakh || 0),
          compensation_paid_lakh: parseFloat(row.compensation_paid_lakh || 0),
          project_name: row.project_name,
          project_code: row.project_code,
          project_type: row.project_type,
          section11_date: row.section11_date,
          section19_date: row.section19_date,
          award_date: row.award_date,
          possession_date: row.possession_date,
        }
      }))
    };

    res.json(geojson);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch GeoJSON' });
  }
});

// GET /api/parcels - List parcels with filters
router.get('/', auth, async (req, res) => {
  try {
    const { project_id, stage } = req.query;
    let query = `
      SELECT lp.*, p.name as project_name, p.project_code
      FROM land_parcels lp JOIN projects p ON p.id = lp.project_id WHERE 1=1
    `;
    const params = [];
    if (project_id) { params.push(project_id); query += ` AND lp.project_id = $${params.length}`; }
    if (stage) { params.push(stage); query += ` AND lp.stage = $${params.length}`; }
    query += ' ORDER BY lp.survey_number LIMIT 200';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch parcels' });
  }
});

module.exports = router;
