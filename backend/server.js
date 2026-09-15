const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const projectRoutes = require('./routes/projects');
const parcelRoutes = require('./routes/parcels');
const proposalRoutes = require('./routes/proposals');
const compensationRoutes = require('./routes/compensation');
const alertRoutes = require('./routes/alerts');
const reportRoutes = require('./routes/reports');
const familyRoutes = require('./routes/families');
const documentRoutes = require('./routes/documents');
const grievanceRoutes = require('./routes/grievances');
const fieldCollectionRoutes = require('./routes/fieldCollection');
const integrationRoutes = require('./routes/integrations');
const innovationRoutes = require('./routes/innovations');
const landownerRoutes = require('./routes/landowner');

const app = express();

// Trust proxy for ngrok/Vercel
app.set('trust proxy', 1);

// CORS - Must come BEFORE helmet to ensure headers are set
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://frontend-rust-psi-63.vercel.app', // Your Vercel deployment
  process.env.FRONTEND_URL,
].filter(Boolean);

// CORS configuration - Allow ngrok URLs, Vercel, and local development
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    // Allow configured origins
    if (allowedOrigins.includes(origin)) return callback(null, true);
    
    // Allow any ngrok.io or ngrok-free.app URL
    if (origin.includes('ngrok.io') || origin.includes('ngrok-free.app') || origin.includes('ngrok.app')) {
      return callback(null, true);
    }
    
    // Allow any Vercel deployment URL
    if (origin.includes('vercel.app')) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  exposedHeaders: ['Content-Length', 'Content-Type'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Security middleware - Must come AFTER CORS
app.use(helmet({
  contentSecurityPolicy: false, // Disable for ngrok compatibility
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow cross-origin requests
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500,
  message: { error: 'Too many requests, please try again later.' }
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many login attempts.' }
});

app.use('/api/', limiter);
app.use('/api/auth/', authLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(morgan('combined'));

// Additional CORS headers middleware as fallback (for ngrok compatibility)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && (origin.includes('vercel.app') || origin.includes('ngrok'))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Type');
  }
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  
  next();
});

// Static file serving for uploads
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/parcels', parcelRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/compensation', compensationRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/families', familyRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/grievances', grievanceRoutes);
app.use('/api/field-collection', fieldCollectionRoutes);
app.use('/api/integrations', integrationRoutes);
app.use('/api/innovations', innovationRoutes);
app.use('/api/landowner', landownerRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'NLAMS API', version: '1.0.0', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n✅ NLAMS Backend running on http://localhost:${PORT}`);
  console.log(`📦 Database: PostgreSQL + PostGIS`);
  console.log(`🔒 Security: JWT + Helmet + Rate Limiting`);
  
  if (process.env.NGROK_URL) {
    console.log(`🌐 Ngrok URL: ${process.env.NGROK_URL}`);
    console.log(`📡 Share this URL with your team!`);
  } else {
    console.log(`\n💡 To share via ngrok, run: npm run ngrok`);
  }
  console.log('');
});
