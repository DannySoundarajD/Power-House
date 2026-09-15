# 👋 Welcome to NLAMS Testing!

Your friend has shared a live demo of the **National Land Acquisition & Management System** (NLAMS) prototype for Chennai District, Tamil Nadu.

---

## 🌐 Access the App

**Main App URL:** `[Your friend will share the ngrok URL here]`

Example: `https://xxxx-yyyy-zzzz.ngrok-free.app`

---

## 🔑 Login Credentials

### Government Portal

**Password for all users:** `Password@123`

| Role | Email | What you can do |
|------|-------|-----------------|
| **Central Admin** | rajesh.kumar@dolr.gov.in | Full system access, view all projects |
| **State Officer (TN)** | priya.chandran@tn.gov.in | State-level approvals, Tamil Nadu projects |
| **District Collector** | collector.chennai@tn.gov.in | Chennai district operations, awards |
| **Field Officer** | kumaran.s@tn.gov.in | Field verification, data collection |
| **Project Agency (AAI)** | anand.k@aai.aero | Parandur Airport project access |

### Landowner Citizen Portal

| Name | Phone | Last 4 Digits | Survey Numbers |
|------|-------|---------------|----------------|
| **Muthusamy Gounder** | 9840001204 | **1204** | 145/2A, 145/3B (Parandur) |
| **Ramasamy Pillai** | 9840001210 | **1210** | 146/1A (Metro Phase 2) |

---

## 🎯 What to Test

### 1️⃣ Dashboard (Government Portal)
**Login as:** District Collector (`collector.chennai@tn.gov.in`)

✅ Check out:
- Total projects KPI cards (should show 8 projects)
- Project stage breakdown pie chart
- Compensation trend line graph
- Active alerts panel

### 2️⃣ GIS Map
**Navigate to:** "GIS Map" from sidebar

✅ Try this:
- See Chennai district land parcels as colored polygons
- Click on any parcel to view details popup
- Use stage filter dropdown to filter parcels
- Color legend shows acquisition stages

### 3️⃣ Real Chennai Projects
**Navigate to:** "Projects" page

✅ Browse:
- **Parandur Greenfield Airport** - 2300 Ha, Stage: Section 19
- **Chennai Metro Phase 2** - 120.5 Ha, Stage: Award
- **TN Secretariat Expansion** - 18.3 Ha, Stage: Disbursement
- **NH-48 Widening** - 45.2 Ha
- And 4 more projects...

### 4️⃣ Innovation 1: AI Land Suitability Analysis
**Navigate to:** "Land Suitability" page

✅ See:
- AI-powered suitability scores (0-100)
- 8-factor MCDA breakdown:
  - Settlement Density (20%)
  - Multi-Crop Agriculture (20%)
  - Forest & Eco Buffer (10%)
  - Infrastructure Disruption (10%)
  - Historical Litigation (10%)
  - Connectivity (10%)
  - Flood Safety (10%)
  - Social Safeguards (10%)
- Recommendations: SUITABLE / CONDITIONAL / NOT_RECOMMENDED
- Alternative corridor suggestions

### 5️⃣ Innovation 2: Ripple Impact Analysis
**Navigate to:** "Ripple Impact" page

✅ Explore:
- Select a delayed parcel (e.g., Survey 145/2A - Court Stay)
- View dependency cascade chain
- See how delay propagates through:
  - Award Declaration → Possession → Construction → Project COD
- Cost escalation estimates (₹ Crores)
- AI-suggested mitigation strategies

### 6️⃣ Innovation 3: Voluntary Land Offers (Landowner Portal)
**Logout and Login as:** Landowner (Phone: 9840001204, Last 4: 1204)

✅ Try:
- Navigate to "Land Offers" page
- Submit a voluntary land offer
- Provide survey number, area, asking price
- Track offer status (submitted → under_review → accepted/declined)

### 7️⃣ Workflow & Proposals
**Login as:** Field Officer (`kumaran.s@tn.gov.in`)

✅ Test:
- Navigate to "Proposals" page
- Submit a new proposal
- Switch to District Collector account
- Approve the proposal
- See workflow stage progression

### 8️⃣ Compensation Tracking
**Navigate to:** "Compensation" page

✅ View:
- Assessed vs Disbursed amounts
- DBT payment status
- Landowner-wise breakdown
- Payment timeline

### 9️⃣ R&R (Rehabilitation & Resettlement)
**Navigate to:** "Families & R&R" page

✅ Check:
- Affected families count by category
- R&R site allotment status
- Livelihood restoration tracking

### 🔟 Grievance Management
**Login as:** Landowner (Phone: 9840001204, Last 4: 1204)

✅ Submit:
- Navigate to "Grievances" page
- File a new grievance
- Track grievance status
- Switch to government portal to see resolution workflow

---

## 📱 Mobile Testing

The app works on mobile browsers too! Try:
- Open the ngrok URL on your phone
- Test field data collection module
- GPS-based parcel verification
- Responsive dashboard

---

## 🐛 Report Issues

If you encounter any issues:

1. **Login Problems**
   - Double-check email and password
   - Password is case-sensitive: `Password@123`

2. **Slow Loading**
   - This is a demo over ngrok tunnel
   - Some delay is normal
   - Wait 5-10 seconds for map to load parcels

3. **Blank Page**
   - Clear browser cache
   - Try incognito/private mode
   - Make sure you're using the HTTPS ngrok URL

4. **CORS Errors**
   - Notify your friend (backend needs restart)
   - Try refreshing the page

5. **Other Issues**
   - Take a screenshot
   - Note which page and action caused the issue
   - Share with your friend

---

## 💡 Tips for Best Experience

✅ **Do:**
- Use Chrome, Firefox, or Edge (latest version)
- Test all 3 innovations - they're unique!
- Try both Government and Landowner portals
- Click on map parcels to see popups
- Check the Ngrok Inspector your friend shares (shows live traffic)

❌ **Don't:**
- Don't use Internet Explorer
- Don't expect instant loads (it's tunneled through ngrok)
- Don't share the ngrok URL publicly (demo only)

---

## 📊 What Makes This Special?

### 🚀 3 Novel Innovations

1. **AI Suitability Analysis** - Evaluates land BEFORE acquisition, not after
2. **Ripple Impact** - Shows how delays cascade through entire project
3. **Voluntary Land Offers** - Two-way portal, landowners can initiate

### 🗺 Real Technology

- **PostGIS Spatial Database** - Not basic lat-lng, real GIS
- **Government-Grade Security** - CERT-In compliant, JWT refresh tokens
- **Complete Workflow** - 8-stage acquisition pipeline (RFCTLARR Act 2013)

### 🏙 Real Chennai Projects

- Parandur Airport (2300 Ha)
- Chennai Metro Phase 2 (120.5 Ha)
- TN Secretariat Expansion (18.3 Ha)
- NH-48 Widening, Port Expansion, Ring Road, etc.

---

## 🎓 Quick Glossary

| Term | Meaning |
|------|---------|
| **Section 4** | Intent to acquire notification |
| **Section 11** | Survey and parcel verification |
| **Section 19** | Final declaration of acquisition |
| **Section 23** | Compensation award |
| **Section 38** | Physical possession |
| **DBT** | Direct Benefit Transfer (bank transfer) |
| **R&R** | Rehabilitation & Resettlement |
| **SIA** | Social Impact Assessment |
| **RFCTLARR** | Right to Fair Compensation Act 2013 |
| **PostGIS** | Spatial database extension for PostgreSQL |
| **MCDA** | Multi-Criteria Decision Analysis |

---

## 🏆 Smart India Hackathon 2026

This is a prototype for:
- **Problem Statement:** PS-26016
- **Organization:** Ministry of Rural Development, Dept of Land Resources
- **Hackathon:** Smart India Hackathon 2026

**Goal:** Digitize and streamline land acquisition across India with transparency, efficiency, and fairness.

---

## 📞 Questions?

Ask your friend who shared this with you!

Or check the full documentation:
- `README.md` - Complete project overview
- `TESTING.md` - Detailed test cases
- `NGROK_SETUP.md` - Deployment guide

---

<div align="center">

**Enjoy Testing NLAMS! 🎉**

*Transforming Land Acquisition · Empowering Landowners · Accelerating Infrastructure*

**⚠️ Demo Only - Not for Production Use**

</div>
