const jwt = require('jsonwebtoken');
const pool = require('../db/pool');

// JWT secret with fallback for development
const JWT_SECRET = process.env.JWT_SECRET || 'nlams_dev_secret_key_2024';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'nlams_refresh_secret_2024';

// Token expiry durations
const ACCESS_TOKEN_EXPIRY = '8h';
const REFRESH_TOKEN_EXPIRY = '7d';

/**
 * Generate access and refresh tokens
 */
function generateTokens(user) {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    department: user.department,
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
  const refreshToken = jwt.sign({ userId: user.id }, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });

  return { accessToken, refreshToken };
}

/**
 * Middleware: Authenticate JWT token
 */
function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
    }
    return res.status(403).json({ error: 'Invalid token' });
  }
}

/**
 * Middleware: Role-based access control (RBAC)
 * Usage: requireRole(['central_admin', 'state_officer'])
 */
function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        required: allowedRoles,
        current: req.user.role
      });
    }

    next();
  };
}

/**
 * Middleware: Audit logging for sensitive operations
 */
async function auditLog(action, details = {}) {
  return async (req, res, next) => {
    // Store original json method
    const originalJson = res.json.bind(res);

    // Override json to log after response
    res.json = function(data) {
      // Log to audit table
      if (req.user) {
        pool.query(
          `INSERT INTO audit_logs (table_name, record_id, action, new_data, changed_by, ip_address, user_agent)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            details.table || action,
            details.recordId || req.params.id || null,
            action,
            JSON.stringify({ ...req.body, ...details }),
            req.user.userId,
            req.ip || req.connection.remoteAddress,
            req.headers['user-agent']
          ]
        ).catch(err => console.error('Audit log error:', err));
      }

      return originalJson(data);
    };

    next();
  };
}

/**
 * Check if user is active
 */
async function checkUserActive(req, res, next) {
  if (!req.user) return next();

  try {
    const result = await pool.query(
      'SELECT is_active FROM users WHERE id = $1',
      [req.user.userId]
    );

    if (result.rows.length === 0 || !result.rows[0].is_active) {
      return res.status(403).json({ error: 'User account is inactive' });
    }

    next();
  } catch (err) {
    console.error('User status check error:', err);
    next(); // Continue on error to avoid blocking
  }
}

// Export all middleware
module.exports = authenticate;
module.exports.authenticate = authenticate;
module.exports.requireRole = requireRole;
module.exports.auditLog = auditLog;
module.exports.checkUserActive = checkUserActive;
module.exports.generateTokens = generateTokens;
module.exports.JWT_SECRET = JWT_SECRET;
module.exports.JWT_REFRESH_SECRET = JWT_REFRESH_SECRET;
