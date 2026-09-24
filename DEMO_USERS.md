# NLAMS Demo Users

## 🔐 All passwords: `Password@123`

## User Accounts by Role

### 🏛️ Central Admin (2 users)
| Name | Email | Department |
|------|-------|------------|
| System Admin | `admin@nlams.gov.in` | Ministry of Rural Development |
| Rajesh Kumar IAS | `rajesh.kumar@dolr.gov.in` | Ministry of Rural Development |

### 🏢 State Officer (2 users)
| Name | Email | Department |
|------|-------|------------|
| Priya Chandran IAS | `priya.chandran@tn.gov.in` | Revenue Department Tamil Nadu |
| Priya Chandran IAS | `state.officer@tn.gov.in` | Revenue Department Tamil Nadu |

### 👨‍💼 District Collector (1 user)
| Name | Email | Department |
|------|-------|------------|
| **Senthil Murugan IAS** | **`collector.chennai@tn.gov.in`** | District Collectorate Chennai |

### 📋 Field Officers (4 users)
| Name | Email | Department |
|------|-------|------------|
| Kumaran Selvam | `surveyor.south@tn.gov.in` | Survey Department Tamil Nadu |
| Kumaran Selvam | `kumaran.s@tn.gov.in` | Survey Department Tamil Nadu |
| Meenakshi Rajan | `legal.chennai@tn.gov.in` | Legal Department Chennai |
| Anand Krishnamurthy | `comp.officer@tn.gov.in` | Compensation Office Chennai |

### 🏗️ Project Agency (5 users)
| Name | Email | Department |
|------|-------|------------|
| Anand Krishnamurthy | `anand.k@aai.aero` | Airports Authority of India |
| Lakshmi Venkatesh | `lakshmi.v@cmrl.gov.in` | Chennai Metro Rail Ltd |
| Ravi Prakash | `ravi.p@nhai.gov.in` | National Highways Authority |
| John Smith | `owner.smith@gmail.com` | Individual Landowner |
| Rajesh Kumar | `owner.kumar@gmail.com` | Individual Landowner |

## 🚀 Quick Test Login

**Recommended test user:**
- **Email:** `collector.chennai@tn.gov.in`
- **Password:** `Password@123`
- **Role:** District Collector (full dashboard access)

## 📊 Total Users: 14

## 🌐 Access the App

- **Local:** http://localhost:5173
- **Backend API:** http://localhost:5000/api

## 🔄 Reset Password (if needed)

If you need to reset any user's password to `Password@123`:

```sql
-- Connect to database
psql -U postgres -d nlams_db

-- Update password for any user (replace email)
UPDATE users 
SET password_hash = '$2b$12$7OpSfzVsDPg4kxbFjbvxtOoeJSkO3PFIAsuZD4kFOr3TtvSfE8yf6'
WHERE email = 'user@example.com';
```

## 📝 Notes

- All users are currently **ACTIVE**
- The `project_agency` role is used for landowners in this demo
- Password hash is bcrypt with 12 rounds
- All users have phone numbers for SMS notifications (feature TBD)

---

**Generated:** September 15, 2026
**Database:** nlams_db @ localhost:5432
