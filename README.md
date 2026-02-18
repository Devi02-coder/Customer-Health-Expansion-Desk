# Startup Management Ecosystem & CHED AI Agent

This project is a comprehensive Startup Management Platform built on a React-Node-MySQL stack, designed to power the Customer Health & Expansion Desk (CHED) AI agent.

## Project Structure
- **/frontend**: React + Vite application with Tailwind CSS, Lucide icons, and Recharts.
- **/backend**: Node.js + Express API with MySQL integration and RBAC.

## Prerequisites
1. **Node.js** (v18+)
2. **MySQL Server** running locally or on a server.
3. **Google Fonts**: Uses 'Outfit' and 'Inter' (recommended).

## Setup Instructions

### 1. Database Setup
1. Open your MySQL client.
2. Run the commands found in `backend/schema.sql`.
   ```sql
   source backend/schema.sql;
   ```
   *Note: This will create the `startups_db` and populate it with dummy data for the CHED AI demo.*

### 2. Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Check `.env` file and ensure DB credentials match your local setup.
3. Start the server:
   ```bash
   node server.js
   ```
   *The server runs on http://localhost:5000*

### 3. Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
   *The dashboard will be available at http://localhost:5173 (standard Vite port)*

## CHED AI Logic Gate
- **Health Scorer**: Calculates 40/20/40 weighted health.
- **Expansion Scout**: Triggers upsell missions at 90% seat utilization.
- **Recovery Agent**: Spawns re-engagement workflows when adoption drops < 30%.

## Antigravity Mission Control
The dashboard is designed for high-fidelity data visualization for human teams, while providing the "Feed" for Antigravity agents to execute browser missions and terminal-based demo scaffolding.
