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

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for ngrok compatibility
  crossOriginEmbedderPolicy: false,
}));

// CORS - Allow ngrok URLs, Vercel, and local development
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

// Also allow any ngrok URL and Vercel URLs
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
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
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
