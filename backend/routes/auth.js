const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db/pool');
const { generateTokens, JWT_REFRESH_SECRET, authenticate } = require('../middleware/auth');
const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND is_active = TRUE',
      [email.toLowerCase().trim()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    await pool.query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);

    // Generate access and refresh tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Log successful login
    await pool.query(
      `INSERT INTO audit_logs (table_name, record_id, action, new_data, changed_by, ip_address)
       VALUES ('users', $1, 'LOGIN', $2, $1, $3)`,
      [user.id, JSON.stringify({ email: user.email }), req.ip]
    );

    res.json({
      token: accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        district: user.district,
        employeeId: user.employee_id
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/refresh - Refresh access token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token required' });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

    // Get user details
    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1 AND is_active = TRUE',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'User not found or inactive' });
    }

    const user = result.rows[0];

    // Generate new tokens
    const tokens = generateTokens(user);

    res.json({
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken
    });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Refresh token expired', code: 'REFRESH_EXPIRED' });
    }
    return res.status(403).json({ error: 'Invalid refresh token' });
  }
});

// GET /api/auth/me - Get current user details
router.get('/me', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, department, district, phone, employee_id, last_login, created_at FROM users WHERE id = $1',
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/logout - Logout (client-side token removal, audit log)
router.post('/logout', authenticate, async (req, res) => {
  try {
    // Log logout
    await pool.query(
      `INSERT INTO audit_logs (table_name, record_id, action, changed_by, ip_address)
       VALUES ('users', $1, 'LOGOUT', $1, $2)`,
      [req.user.userId, req.ip]
    );

    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/auth/demo-users - For prototype demo
router.get('/demo-users', async (req, res) => {
  const users = [
    { email: 'rajesh.kumar@dolr.gov.in', role: 'Central Ministry Admin', name: 'Rajesh Kumar IAS' },
    { email: 'priya.chandran@tn.gov.in', role: 'State Officer (TN)', name: 'Priya Chandran IAS' },
    { email: 'collector.chennai@tn.gov.in', role: 'District Collector (Chennai)', name: 'Senthil Murugan IAS' },
    { email: 'kumaran.s@tn.gov.in', role: 'Field Officer', name: 'Kumaran Selvam' },
    { email: 'anand.k@aai.aero', role: 'Project Agency (AAI)', name: 'Anand Krishnamurthy' },
  ];
  res.json({ users, password: 'Password@123' });
});

// GET /api/auth/audit-logs - Get user's audit trail (admin only)
router.get('/audit-logs', authenticate, async (req, res) => {
  const allowedRoles = ['central_admin', 'state_officer', 'district_collector'];
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }

  try {
    const { userId, limit = 100 } = req.query;
    let query = `
      SELECT al.*, u.name as user_name, u.email as user_email
      FROM audit_logs al
      LEFT JOIN users u ON u.id = al.changed_by
      WHERE 1=1
    `;
    const params = [];

    if (userId) {
      params.push(userId);
      query += ` AND al.changed_by = $${params.length}`;
    }

    query += ` ORDER BY al.changed_at DESC LIMIT $${params.length + 1}`;
    params.push(parseInt(limit));

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Audit logs error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
