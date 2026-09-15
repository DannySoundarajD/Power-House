const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const { authenticate } = require('../middleware/auth');

const MOCK_INTEGRATIONS = [
  {
    id: 'dilrmp',
    name: 'DILRMP (Digital India Land Records)',
    ministry: 'DoLR, Ministry of Rural Development',
    status: 'connected',
    lastSync: '2024-03-15T04:30:00Z',
    latencyMs: 142,
    recordsSynced: 14820,
    health: 99.8,
    description: 'Syncs cadastral maps, RoR (Record of Rights), parcel spatial polygons, and mutation records.'
  },
  {
    id: 'bhu-arjan',
    name: 'Bhu-Arjan Portal (MoRTH/NHAI)',
    ministry: 'Ministry of Road Transport & Highways',
    status: 'connected',
    lastSync: '2024-03-15T06:15:00Z',
    latencyMs: 198,
    recordsSynced: 842,
    health: 98.5,
    description: 'National highway acquisition gazette notifications, awards, and compensation approvals.'
  },
  {
    id: 'pfms',
    name: 'PFMS (Public Financial Management System)',
    ministry: 'Ministry of Finance',
    status: 'connected',
    lastSync: '2024-03-15T09:00:00Z',
    latencyMs: 230,
    recordsSynced: 1250,
    health: 99.2,
    description: 'Direct Benefit Transfer (DBT) verification, beneficiary account validation, and treasury disbursals.'
  },
  {
    id: 'digilocker',
    name: 'DigiLocker NAD & Citizen Vault',
    ministry: 'MeitY (Ministry of Electronics & IT)',
    status: 'connected',
    lastSync: '2024-03-15T08:45:00Z',
    latencyMs: 110,
    recordsSynced: 3410,
    health: 99.9,
    description: 'Direct issuance of Section 11/19 notices and award certificates to landowners DigiLocker.'
  },
  {
    id: 'pm-gatisakti',
    name: 'PM GatiShakti NMP (National Master Plan)',
    ministry: 'DPIIT, Ministry of Commerce & Industry',
    status: 'connected',
    lastSync: '2024-03-14T23:00:00Z',
    latencyMs: 310,
    recordsSynced: 19,
    health: 97.4,
    description: 'Multi-modal corridor alignment verification, environmental layers, and utility crossing clearance.'
  }
];

// GET /api/integrations/status
router.get('/status', authenticate, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM integration_logs ORDER BY called_at DESC LIMIT 20');
    res.json({ integrations: MOCK_INTEGRATIONS, logs: rows.length ? rows : MOCK_LOGS });
  } catch {
    res.json({ integrations: MOCK_INTEGRATIONS, logs: MOCK_LOGS });
  }
});

// POST /api/integrations/sync/:id
router.post('/sync/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const item = MOCK_INTEGRATIONS.find(i => i.id === id);
  if (!item) return res.status(404).json({ error: 'Integration not found' });
  
  const logEntry = {
    system_name: item.name,
    endpoint: `https://api.gov.in/v2/${id}/sync`,
    request_type: 'POST',
    status: 'success',
    response_time_ms: Math.floor(Math.random() * 150) + 80,
    called_at: new Date().toISOString()
  };

  try {
    await pool.query(
      `INSERT INTO integration_logs (system_name, endpoint, request_type, status, response_time_ms, called_by)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [logEntry.system_name, logEntry.endpoint, logEntry.request_type, logEntry.status, logEntry.response_time_ms, req.user?.id || null]
    );
  } catch {
    // Ignore db fallback
  }

  res.json({
    success: true,
    message: `Triggered full synchronization with ${item.name}`,
    timestamp: new Date().toISOString(),
    recordsProcessed: Math.floor(Math.random() * 50) + 10,
    latencyMs: logEntry.response_time_ms
  });
});

const MOCK_LOGS = [
  { id: '1', system_name: 'PFMS Disbursal Engine', endpoint: '/pfms/v1/dbt/disburse-batch', request_type: 'POST', status: 'success', response_time_ms: 185, called_at: '2024-03-15T09:00:12Z' },
  { id: '2', system_name: 'DILRMP Cadastral API', endpoint: '/dilrmp/v2/cadastral/survey-batch', request_type: 'GET', status: 'success', response_time_ms: 120, called_at: '2024-03-15T08:32:45Z' },
  { id: '3', system_name: 'Bhu-Arjan Gazette Sync', endpoint: '/bhu-arjan/v1/notifications', request_type: 'GET', status: 'success', response_time_ms: 210, called_at: '2024-03-15T07:15:02Z' },
  { id: '4', system_name: 'PM GatiShakti GIS Hub', endpoint: '/gati-shakti/v3/layer/corridor-check', request_type: 'POST', status: 'success', response_time_ms: 295, called_at: '2024-03-14T23:02:11Z' }
];

module.exports = router;
