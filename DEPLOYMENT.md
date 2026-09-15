# 🚀 NLAMS Deployment Guide

Complete guide for deploying NLAMS to production or demo environments.

---

## Deployment Options

1. **Local Development** (Current setup)
2. **Docker Containers** (Recommended for demos)
3. **Cloud Deployment** (AWS/Azure Government Cloud)
4. **NIC MeghRaj** (Government cloud platform)

---

## Option 1: Local Development Setup

### Quick Start (5 minutes)

```powershell
# 1. Clone repository
git clone https://github.com/yourusername/nlams-chennai.git
cd nlams-chennai

# 2. Setup backend
cd backend
npm install
.\setup-db.ps1  # Run database setup wizard
cp .env.example .env
# Edit .env with your settings
npm start

# 3. Setup frontend (new terminal)
cd ../frontend
npm install
npm run dev
```

**Access:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Database: postgresql://localhost:5432/nlams_db

---

## Option 2: Docker Deployment

### Prerequisites
- Docker Desktop installed
- Docker Compose v2

### Docker Compose Configuration

Create `docker-compose.yml` in project root:

```yaml
version: '3.8'

services:
  # PostgreSQL + PostGIS Database
  database:
    image: postgis/postgis:16-3.4
    container_name: nlams-postgres
    environment:
      POSTGRES_DB: nlams_db
      POSTGRES_USER: nlams_user
      POSTGRES_PASSWORD: nlams_secure_2024
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backend/db:/docker-entrypoint-initdb.d
    ports:
      - "5432:5432"
    networks:
      - nlams-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U nlams_user -d nlams_db"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Backend API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: nlams-backend
    environment:
      NODE_ENV: production
      PORT: 5000
      DB_HOST: database
      DB_PORT: 5432
      DB_NAME: nlams_db
      DB_USER: nlams_user
      DB_PASSWORD: nlams_secure_2024
      JWT_SECRET: ${JWT_SECRET:-your_production_secret_here}
      FRONTEND_URL: http://localhost:3000
    ports:
      - "5000:5000"
    depends_on:
      database:
        condition: service_healthy
    networks:
      - nlams-network
    restart: unless-stopped

  # Frontend (Nginx + Static Build)
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: nlams-frontend
    environment:
      VITE_API_URL: http://localhost:5000/api
    ports:
      - "3000:80"
    depends_on:
      - backend
    networks:
      - nlams-network
    restart: unless-stopped

volumes:
  postgres_data:

networks:
  nlams-network:
    driver: bridge
```

### Backend Dockerfile

Create `backend/Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application
COPY . .

# Create uploads directory
RUN mkdir -p uploads

EXPOSE 5000

CMD ["node", "server.js"]
```

### Frontend Dockerfile

Create `frontend/Dockerfile`:

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Production nginx server
FROM nginx:alpine

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Frontend Nginx Config

Create `frontend/nginx.conf`:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
    gzip_comp_level 6;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api {
        proxy_pass http://backend:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Deploy with Docker

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes (clean reset)
docker-compose down -v
```

---

## Option 3: Cloud Deployment (AWS)

### Architecture

```
Internet → CloudFront (CDN)
            ↓
         ALB (Load Balancer)
            ↓
    ┌───────┴───────┐
    ↓               ↓
 ECS Tasks      ECS Tasks
 (Backend)      (Frontend)
    ↓
 RDS PostgreSQL + PostGIS
 (Multi-AZ)
    ↓
 S3 (File Storage)
```

### AWS Services Required

1. **Amazon ECS** (Elastic Container Service)
   - Backend containers
   - Frontend containers
   - Auto-scaling enabled

2. **Amazon RDS** (Relational Database Service)
   - PostgreSQL 16 with PostGIS
   - Multi-AZ for high availability
   - Automated backups

3. **Amazon S3**
   - Document storage
   - Static assets (optional)

4. **Amazon CloudFront**
   - CDN for frontend assets
   - SSL/TLS termination

5. **AWS Certificate Manager**
   - Free SSL certificates

6. **Amazon CloudWatch**
   - Logging and monitoring
   - Alerts

### Infrastructure as Code (Terraform)

Create `infrastructure/main.tf`:

```hcl
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# VPC
resource "aws_vpc" "nlams_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "nlams-vpc"
    Project = "NLAMS"
  }
}

# RDS PostgreSQL
resource "aws_db_instance" "nlams_db" {
  identifier           = "nlams-postgres"
  engine               = "postgres"
  engine_version       = "16.1"
  instance_class       = "db.t3.medium"
  allocated_storage    = 100
  storage_type         = "gp3"
  storage_encrypted    = true
  
  db_name  = "nlams_db"
  username = var.db_username
  password = var.db_password
  
  multi_az               = true
  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"
  
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  db_subnet_group_name   = aws_db_subnet_group.nlams_db_subnet.name
  
  skip_final_snapshot = false
  final_snapshot_identifier = "nlams-final-snapshot"

  tags = {
    Name = "nlams-postgres"
    Project = "NLAMS"
  }
}

# ECS Cluster
resource "aws_ecs_cluster" "nlams_cluster" {
  name = "nlams-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

# ... (Additional resources: ALB, ECS Services, CloudFront, etc.)
```

### Deploy to AWS

```bash
# 1. Configure AWS CLI
aws configure

# 2. Initialize Terraform
cd infrastructure
terraform init

# 3. Plan deployment
terraform plan

# 4. Apply infrastructure
terraform apply

# 5. Push Docker images to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
docker build -t nlams-backend backend/
docker tag nlams-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/nlams-backend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/nlams-backend:latest

# 6. Update ECS service
aws ecs update-service --cluster nlams-cluster --service nlams-backend --force-new-deployment
```

---

## Option 4: NIC MeghRaj Cloud

### Prerequisites
- MeghRaj cloud account
- STQC/CERT-In compliance certification
- eMail ID and digital signature

### Deployment Architecture

```
NIC Load Balancer (HAProxy)
    ↓
NIC Virtual Machines (CentOS/RHEL)
    ├─ Frontend (Nginx)
    ├─ Backend (Node.js)
    └─ PostgreSQL (NIC Managed Service)
```

### Security Compliance

1. **CERT-In Guidelines**
   - Mandatory 6-hour log retention
   - Intrusion detection system (IDS)
   - DDoS mitigation
   - Vulnerability assessment

2. **Data Localization**
   - All data stored in Indian data centers
   - No cross-border data transfer

3. **Encryption**
   - Data at rest: AES-256
   - Data in transit: TLS 1.3
   - Database: PostgreSQL native encryption

### Deployment Steps

1. **Request VM instances** from NIC
   - Application server: 4 vCPU, 16 GB RAM
   - Database server: 8 vCPU, 32 GB RAM, 500 GB SSD

2. **Install dependencies**
   ```bash
   sudo yum install nodejs postgresql16
   ```

3. **Configure firewall**
   ```bash
   sudo firewall-cmd --permanent --add-service=http
   sudo firewall-cmd --permanent --add-service=https
   sudo firewall-cmd --reload
   ```

4. **Deploy application** (same as local setup)

5. **Configure SSL** with NIC CA certificate

---

## Environment Variables (Production)

Create `.env` for production:

```bash
# Database
DB_HOST=nlams-postgres.xxxxx.rds.amazonaws.com
DB_PORT=5432
DB_NAME=nlams_db
DB_USER=nlams_admin
DB_PASSWORD=<strong-random-password>

# JWT
JWT_SECRET=<generate-with-openssl-rand-base64-64>
JWT_REFRESH_SECRET=<generate-with-openssl-rand-base64-64>
JWT_EXPIRES_IN=8h

# Server
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://nlams.gov.in

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=500

# File Upload
UPLOAD_DIR=/var/nlams/uploads
MAX_FILE_SIZE_MB=10

# Logging
LOG_LEVEL=warn
LOG_FILE=/var/log/nlams/app.log

# Monitoring
SENTRY_DSN=<your-sentry-dsn>
```

### Generate Secrets

```bash
# JWT Secret
openssl rand -base64 64

# Database Password
openssl rand -base64 32
```

---

## Database Backup & Recovery

### Automated Backups

```bash
# Create backup script
cat > /opt/nlams/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backup/nlams"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DB_NAME="nlams_db"
DB_USER="nlams_user"

# Create backup directory
mkdir -p $BACKUP_DIR

# Dump database
pg_dump -U $DB_USER -d $DB_NAME -F c -b -v -f "$BACKUP_DIR/nlams_$TIMESTAMP.backup"

# Compress
gzip "$BACKUP_DIR/nlams_$TIMESTAMP.backup"

# Keep only last 7 days
find $BACKUP_DIR -name "*.gz" -mtime +7 -delete

# Upload to S3 (optional)
aws s3 cp "$BACKUP_DIR/nlams_$TIMESTAMP.backup.gz" s3://nlams-backups/
EOF

chmod +x /opt/nlams/backup.sh

# Add to crontab (daily at 2 AM)
crontab -e
0 2 * * * /opt/nlams/backup.sh
```

### Restore from Backup

```bash
# Restore database
gunzip nlams_20240315_020000.backup.gz
pg_restore -U nlams_user -d nlams_db -v nlams_20240315_020000.backup
```

---

## Monitoring & Alerts

### Health Check Endpoints

```javascript
// backend/server.js
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'NLAMS API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/health/db', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch (err) {
    res.status(503).json({ status: 'error', database: 'disconnected' });
  }
});
```

### Prometheus Metrics

```javascript
const prometheus = require('prom-client');

// Create metrics
const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status']
});

// Expose metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', prometheus.register.contentType);
  res.end(await prometheus.register.metrics());
});
```

### Grafana Dashboard

Import dashboard JSON:
```json
{
  "dashboard": {
    "title": "NLAMS Monitoring",
    "panels": [
      {
        "title": "API Requests/sec",
        "targets": [{"expr": "rate(http_requests_total[5m])"}]
      },
      {
        "title": "Response Time (p95)",
        "targets": [{"expr": "histogram_quantile(0.95, http_request_duration_seconds)"}]
      },
      {
        "title": "Database Connections",
        "targets": [{"expr": "pg_stat_database_numbackends"}]
      }
    ]
  }
}
```

---

## SSL/TLS Configuration

### Let's Encrypt (Free SSL)

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Generate certificate
sudo certbot --nginx -d nlams.gov.in -d www.nlams.gov.in

# Auto-renewal (crontab)
0 0 * * 0 certbot renew --quiet
```

### Nginx SSL Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name nlams.gov.in;

    ssl_certificate /etc/letsencrypt/live/nlams.gov.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/nlams.gov.in/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # ... rest of config
}
```

---

## Scaling Considerations

### Horizontal Scaling

1. **Load Balancer**
   - Distribute traffic across multiple backend instances
   - Session affinity if needed

2. **Database Read Replicas**
   - Read-heavy queries → replicas
   - Write queries → primary

3. **CDN**
   - Static assets
   - API caching (with proper cache headers)

### Vertical Scaling

| Tier | Users | Backend | Database | Storage |
|------|-------|---------|----------|---------|
| Small | < 100 | 2 vCPU, 4GB RAM | 2 vCPU, 8GB RAM | 100GB |
| Medium | < 1000 | 4 vCPU, 8GB RAM | 4 vCPU, 16GB RAM | 500GB |
| Large | < 10000 | 8 vCPU, 16GB RAM | 8 vCPU, 32GB RAM | 1TB |
| Enterprise | > 10000 | 16 vCPU, 32GB RAM | 16 vCPU, 64GB RAM | 5TB |

---

## Troubleshooting

### Common Issues

**Issue:** Database connection fails
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check connection
psql -U nlams_user -d nlams_db -h localhost

# Check logs
sudo tail -f /var/log/postgresql/postgresql-16-main.log
```

**Issue:** Frontend can't reach backend
```bash
# Check CORS settings
# Ensure FRONTEND_URL in .env matches actual frontend URL

# Check network
curl http://localhost:5000/health
```

**Issue:** PostGIS functions not available
```sql
-- Reinstall extension
DROP EXTENSION IF EXISTS postgis CASCADE;
CREATE EXTENSION postgis;

-- Check version
SELECT PostGIS_Version();
```

---

## Post-Deployment Checklist

- [ ] Database backups configured and tested
- [ ] SSL certificates installed and auto-renewal enabled
- [ ] Monitoring dashboards configured
- [ ] Log aggregation setup (ELK/CloudWatch)
- [ ] Security scan passed (OWASP ZAP)
- [ ] Load testing completed (JMeter/k6)
- [ ] DR plan documented
- [ ] User training completed
- [ ] Support contact established

---

## Support & Maintenance

**Technical Support:**
- Email: support@nlams.gov.in
- Phone: 1800-XXX-XXXX (Toll-free)
- Portal: https://support.nlams.gov.in

**Maintenance Windows:**
- Sunday 2:00 AM - 4:00 AM IST
- Advance notice via email

**SLA:**
- Uptime: 99.5% (excluding maintenance)
- Response time: < 1 second (95th percentile)
- Bug fixes: Critical (24h), High (3 days), Medium (7 days)

---

**Deployment completed successfully! 🎉**
