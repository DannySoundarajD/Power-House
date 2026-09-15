const express = require('express');
const pool = require('../db/pool');
const router = express.Router();

// POST /api/landowner/login - Landowner login with phone + last 4 digits
router.post('/login', async (req, res) => {
  try {
    const { phone, last4 } = req.body;

    if (!phone || !last4) {
      return res.status(400).json({ error: 'Phone and last 4 digits required' });
    }

    const result = await pool.query(
      'SELECT * FROM landowner_users WHERE phone = $1 AND phone_last4 = $2',
      [phone, last4]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    res.json({
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      survey_numbers: user.survey_numbers
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// GET /api/landowner/:phone/parcels - Get parcels for landowner
router.get('/:phone/parcels', async (req, res) => {
  try {
    const user = await pool.query(
      'SELECT survey_numbers FROM landowner_users WHERE phone = $1',
      [req.params.phone]
    );

    if (user.rows.length === 0) {
      return res.json([]);
    }

    const surveyNumbers = user.rows[0].survey_numbers;
    if (!surveyNumbers || surveyNumbers.length === 0) {
      return res.json([]);
    }

    const result = await pool.query(`
      SELECT lp.*, p.name as project_name, p.project_code, p.implementing_agency,
             p.current_stage as project_stage, ST_AsGeoJSON(lp.geom) as geojson
      FROM land_parcels lp
      JOIN projects p ON p.id = lp.project_id
      WHERE lp.survey_number = ANY($1)
      ORDER BY lp.created_at DESC
    `, [surveyNumbers]);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch parcels' });
  }
});

// GET /api/landowner/:phone/compensation - Get compensation status
router.get('/:phone/compensation', async (req, res) => {
  try {
    const user = await pool.query(
      'SELECT survey_numbers FROM landowner_users WHERE phone = $1',
      [req.params.phone]
    );

    if (user.rows.length === 0 || !user.rows[0].survey_numbers) {
      return res.json([]);
    }

    const result = await pool.query(`
      SELECT c.*, lp.survey_number, lp.village, lp.taluk,
             p.name as project_name, p.project_code
      FROM compensation c
      JOIN land_parcels lp ON lp.id = c.parcel_id
      JOIN projects p ON p.id = c.project_id
      WHERE lp.survey_number = ANY($1)
      ORDER BY c.created_at DESC
    `, [user.rows[0].survey_numbers]);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch compensation' });
  }
});

// GET /api/landowner/:phone/rr-status - Get R&R status
router.get('/:phone/rr-status', async (req, res) => {
  try {
    const user = await pool.query(
      'SELECT id FROM landowner_users WHERE phone = $1',
      [req.params.phone]
    );

    if (user.rows.length === 0) {
      return res.json([]);
    }

    const result = await pool.query(`
      SELECT af.*, lp.survey_number, lp.village, lp.taluk,
             p.name as project_name, p.project_code
      FROM affected_families af
      JOIN land_parcels lp ON lp.id = af.parcel_id
      JOIN projects p ON p.id = af.project_id
      WHERE af.parcel_id IN (
        SELECT id FROM land_parcels WHERE survey_number = ANY(
          SELECT survey_numbers FROM landowner_users WHERE id = $1
        )
      )
      ORDER BY af.registered_at DESC
    `, [user.rows[0].id]);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch R&R status' });
  }
});

// GET /api/landowner/:phone/notifications - Get statutory notifications
router.get('/:phone/notifications', async (req, res) => {
  try {
    const user = await pool.query(
      'SELECT survey_numbers FROM landowner_users WHERE phone = $1',
      [req.params.phone]
    );

    if (user.rows.length === 0 || !user.rows[0].survey_numbers) {
      return res.json([]);
    }

    const result = await pool.query(`
      SELECT n.*, p.name as project_name, p.project_code
      FROM notifications n
      JOIN projects p ON p.id = n.project_id
      WHERE n.project_id IN (
        SELECT DISTINCT project_id FROM land_parcels
        WHERE survey_number = ANY($1)
      )
      ORDER BY n.gazette_date DESC
    `, [user.rows[0].survey_numbers]);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// POST /api/landowner/offers - Submit voluntary land offer (Innovation 3)
router.post('/offers', async (req, res) => {
  try {
    const {
      landowner_name, landowner_phone, landowner_email, survey_number,
      village, taluk, district, area_ha, land_use, asking_price_lakh,
      offer_reason, suitable_for
    } = req.body;

    const offerNum = `OFFER/CHN/${new Date().getFullYear()}/${String(Math.floor(Math.random() * 9000 + 1000)).padStart(3, '0')}`;

    const result = await pool.query(`
      INSERT INTO land_offers (
        offer_number, landowner_name, landowner_phone, landowner_email,
        survey_number, village, taluk, district, area_ha, land_use,
        asking_price_lakh, offer_reason, suitable_for, status, submitted_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 'submitted', NOW())
      RETURNING *
    `, [
      offerNum, landowner_name, landowner_phone, landowner_email,
      survey_number, village, taluk, district || 'Chennai', area_ha, land_use,
      asking_price_lakh, offer_reason, suitable_for
    ]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit land offer' });
  }
});

// GET /api/landowner/offers - Get all land offers (govt side)
router.get('/offers', async (req, res) => {
  try {
    const { status } = req.query;
    let query = 'SELECT * FROM land_offers WHERE 1=1';
    const params = [];

    if (status) { params.push(status); query += ` AND status = $${params.length}`; }
    query += ' ORDER BY submitted_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch land offers' });
  }
});

// PATCH /api/landowner/offers/:id/review - Review land offer (govt only)
router.patch('/offers/:id/review', async (req, res) => {
  try {
    const { status, govt_response, reviewed_by } = req.body;

    await pool.query(`
      UPDATE land_offers
      SET status = $1, govt_response = $2, reviewed_by = $3, reviewed_at = NOW()
      WHERE id = $4
    `, [status, govt_response, reviewed_by, req.params.id]);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to review land offer' });
  }
});

module.exports = router;
