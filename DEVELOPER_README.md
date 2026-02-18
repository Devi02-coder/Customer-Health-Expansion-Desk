# Startup Mission Control: Developer Integration Guide

This repository contains a fully functional ecosystem designed to manage startup operations via autonomous Antigravity Agents and real-time AI analytics.

## 🏗️ System Architecture & Observe-Plan-Act Loop
The system is built on a high-fidelity data loop:
1. **Observe**: MySQL database (`startups_db`) stores raw telemetry (usage, logs, MRR).
2. **Plan**: Node.js & FastAPI Provide filtered "Mission Briefs" and ML churn predictions.
3. **Act**: Antigravity Agents execute missions via the React Dashboards (Browser Tool) or Terminal.

## 🚀 Quick Start: Docker Orchestration
The easiest way to launch the entire stack (Database, Backend, AI Service, Frontend) is using Docker Compose:
```bash
docker-compose up --build
```

## 🛠️ Manual Component Setup

### 1. Database Initialization
```bash
# Connect to your MySQL instance (Local or Google Cloud SQL)
mysql -u root -p < backend/schema.sql
```

### 2. AI Churn Service (FastAPI)
- **Port**: 8000
- **Auth**: JWT (OAuth2)
- **Deployment**:
  ```bash
  cd ai-service
  pip install -r requirements.txt
  uvicorn app:app --reload
  ```
- **System Feature**: Predicts churn risk based on 6 key behavioral signals.

### 3. Backend API (Node.js)
- **Port**: 5000
- **Auth**: RBAC Middleware + API Key for AI Agents.
- **Deployment**:
  ```bash
  cd backend
  npm install
  node server.js
  ```

### 4. Frontend Dashboard (React)
- **Port**: 3000 (Docker) / 5173 (Vite Local)
- **Features**: Vital Signs, Strategic Admin (Charts), Growth Engine.
- **Deployment**:
  ```bash
  cd frontend
  npm install
  npm run dev
  ```

## 🔑 Role-Based Access Control (RBAC) Matrix
| Role | Dashboard Access | AI Control |
| :--- | :--- | :--- |
| **Super Admin** | Full access to all modules + ML Retraining | Manual Override |
| **Admin** | Org-level metrics, Team management | Approval Required |
| **CSM** | Assigned Customer Health & Risk Alerts | Execute Recovery |
| **Sales** | Expansion Leads & Referral Loops | Execute Upsell |
| **Viewer** | Execution Summaries & Reports | Read Only |

## 🤖 Antigravity Agent Configuration (CHED AI)
**Agent Name**: CHED (Customer Health & Expansion Desk)
**System Instructions**: 
1. Monitor `http://localhost:5000/api/ai/health-check` every 5 minutes.
2. If `feature_adoption_rate` < 30%, trigger a **Recovery Mission** in the CS Portal.
3. If `seat_utilization` > 90%, trigger an **Expansion Pitch** in the Growth Engine.
4. All actions must be logged in `expansion_leads` table via API.
5. Use `x-api-key: antigravity_secret_7788` for authenticated requests.

## 📊 Visualization Stack
- **Pie Charts**: Real-time Health Distribution (Healthy/At-Risk/Churn).
- **Bar Charts**: Monthly Revenue (MRR) Velocity.
- **Area Charts**: Ecosystem Health Trends over 7 days.
- **Risk Badges**: Dynamic indicators based on AI health scoring.
