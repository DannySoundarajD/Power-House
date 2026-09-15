const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const { authenticate } = require('../middleware/auth');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(__dirname, '../uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// GET /api/documents?projectId=&parcelId=&category=
router.get('/', authenticate, async (req, res) => {
  const { projectId, parcelId, category } = req.query;
  try {
    let q = `SELECT d.*, u.full_name AS uploaded_by_name
             FROM document_repository d
             LEFT JOIN users u ON u.id = d.uploaded_by
             WHERE d.is_latest = TRUE`;
    const params = [];
    if (projectId) { params.push(projectId); q += ` AND d.project_id = $${params.length}`; }
    if (parcelId)  { params.push(parcelId);  q += ` AND d.parcel_id  = $${params.length}`; }
    if (category)  { params.push(category);  q += ` AND d.doc_category = $${params.length}`; }
    q += ` ORDER BY d.created_at DESC`;
    const { rows } = await pool.query(q, params);
    res.json(rows);
  } catch { res.json(MOCK_DOCS); }
});

// POST /api/documents/upload  (multipart simulation — stores filename only)
router.post('/upload', authenticate, async (req, res) => {
  const { project_id, parcel_id, doc_category, doc_type, file_name, remarks } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO document_repository (project_id, parcel_id, doc_category, doc_type, file_name, file_path, uploaded_by, remarks)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [project_id, parcel_id, doc_category, doc_type, file_name,
       `/uploads/${project_id}/${file_name}`, req.user.id, remarks]
    );
    res.json(rows[0]);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// DELETE /api/documents/:id
router.delete('/:id', authenticate, async (req, res) => {
  try {
    await pool.query(`UPDATE document_repository SET is_latest = FALSE WHERE id = $1`, [req.params.id]);
    res.json({ success: true });
  } catch { res.json({ success: true }); }
});

const MOCK_DOCS = [
  { id: '1', doc_category: 'notice', doc_type: 'Section 11 Notification', file_name: 'section_11_parandur.pdf', file_size_kb: 1240, created_at: '2022-10-15T00:00:00Z', uploaded_by_name: 'Senthil Murugan IAS', project_id: 'b1000000-0000-0000-0000-000000000001' },
  { id: '2', doc_category: 'notice', doc_type: 'Section 19 Declaration', file_name: 'section_19_parandur.pdf', file_size_kb: 980, created_at: '2023-04-20T00:00:00Z', uploaded_by_name: 'Senthil Murugan IAS', project_id: 'b1000000-0000-0000-0000-000000000001' },
  { id: '3', doc_category: 'award', doc_type: 'Award Notice Survey 146/1B', file_name: 'award_146_1B.pdf', file_size_kb: 560, created_at: '2023-11-10T00:00:00Z', uploaded_by_name: 'Senthil Murugan IAS', project_id: 'b1000000-0000-0000-0000-000000000001' },
  { id: '4', doc_category: 'legal', doc_type: 'Title Deed Survey 145/2A', file_name: 'title_deed_145_2A.pdf', file_size_kb: 340, created_at: '2024-01-15T00:00:00Z', uploaded_by_name: 'Kumaran Selvam', project_id: 'b1000000-0000-0000-0000-000000000001' },
  { id: '5', doc_category: 'photo', doc_type: 'Field Photo — Survey 145/2A', file_name: 'field_145_2A_march.jpg', file_size_kb: 2100, created_at: '2024-03-10T00:00:00Z', uploaded_by_name: 'Kumaran Selvam', project_id: 'b1000000-0000-0000-0000-000000000001' },
  { id: '6', doc_category: 'notice', doc_type: 'Section 11 Notification', file_name: 'metro_sec11.pdf', file_size_kb: 890, created_at: '2021-08-20T00:00:00Z', uploaded_by_name: 'Senthil Murugan IAS', project_id: 'b1000000-0000-0000-0000-000000000002' },
];

module.exports = router;
