# Customer Health & Expansion Desk (CHED) - Project Synopsis

## 1. Project Overview
**Project Name:** Customer Health & Expansion Desk (CHED)
**Purpose:** A unified enterprise command center designed to monitor customer health, track and score expansion (upsell/cross-sell) opportunities, and manage referral programs in real-time. It leverages AI models to predict churn and propensity to buy, providing actionable insights across five distinct organizational roles.

---

## 2. Infrastructure & Data Storage
The project is structured as a full-stack enterprise application with a distributed architecture:

### A. Where Data is Stored
Data is persisted in a **MySQL/PostgreSQL** database (currently configured for MySQL `STARTUPS` database). 

**Key Tables:**
*   **`users` & `roles`**: Manages Identity (RBAC) and authentication metadata.
*   **`startups` (Customers)**: The master registry of all customer accounts, including industry and account ownership.
*   **`health_metrics`**: A time-series snapshot of customer behavior (Adoption, Support Tickets, Utilization, Sentiment).
*   **`expansion_leads`**: AI-scored opportunities for Upselling and Cross-selling.
*   **`referral_ledger`**: Tracking system for referrals from submission to conversion.

### B. Core Technology Stack
| Layer | Technology | Use Case |
| :--- | :--- | :--- |
| **Frontend** | React V18 + TailwindCSS + Recharts | High-performance, interactive dashboarding & UI. |
| **Backend** | Node.js + Express | RESTful API gateway, RBAC enforcement, and DB orchestration. |
| **AI Service** | FastAPI + Python | Neural kernel for health score calculation and expansion prediction. |
| **Real-Time** | Socket.io (Configured) | Global event stream for live alerts and sync status. |
| **Database** | MySQL | Relational storage for enterprise-grade consistency. |

---

## 3. Project Use & Business Value
This project acts as the "Nervous System" for a B2B SaaS organization:

1.  **Churn Prevention**: AI identifies "At-Risk" customers before they churn, alerting CSMs to execute "Recovery Missions."
2.  **Revenue Growth**: The "Expansion AI" module detects account utilization spikes (e.g., >90%) and automatically flags them as high-confidence upsell leads.
3.  **Referral Viral Loop**: Incentivizes existing healthy customers to become "Scouts," tracking their referrals through a transparent ledger.
4.  **Operational Efficiency**: Managers and Executives get a "Governance" view of the entire fleet performance without manually auditing individual accounts.

---

## 4. Role-Based Access Hierarchy
1.  **Super Admin**: Global configuration, AI threshold tuning, and multi-tenant management.
2.  **Admin**: Team management and high-level revenue reporting.
3.  **Manager**: Performance tracking and health trend monitoring.
4.  **CSM / Sales**: Operational execution—managing assigned accounts and leads.
5.  **Analyst**: Data extraction and strategic visualization (Read-only).
