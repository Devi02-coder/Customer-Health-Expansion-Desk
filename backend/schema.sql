SET FOREIGN_KEY_CHECKS = 0;

-- Reset All Enterprise Tables
DROP TABLE IF EXISTS referral_ledger;
DROP TABLE IF EXISTS expansion_leads;
DROP TABLE IF EXISTS health_metrics;
DROP TABLE IF EXISTS startups;
DROP TABLE IF EXISTS role_permissions;
DROP TABLE IF EXISTS permissions;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;

CREATE TABLE IF NOT EXISTS roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS permissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    permission_key VARCHAR(100) UNIQUE NOT NULL,
    module_name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS role_permissions (
    role_id INT,
    permission_id INT,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (permission_id) REFERENCES permissions(id)
);

CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role_id INT,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- 2. Master Startup Registry
CREATE TABLE IF NOT EXISTS startups (
    id INT PRIMARY KEY AUTO_INCREMENT,
    company_name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    funding_stage ENUM('Seed', 'Series A', 'Series B', 'Series C', 'IPO'),
    current_mrr DECIMAL(15, 2) DEFAULT 0.00,
    account_manager_id INT,
    status ENUM('Active', 'At-Risk', 'Churned') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_manager_id) REFERENCES users(id)
);

-- 3. AI Data Feed
CREATE TABLE IF NOT EXISTS health_metrics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    startup_id INT,
    login_frequency_7d INT DEFAULT 0,
    feature_adoption_rate DECIMAL(5, 2),
    active_support_tickets INT DEFAULT 0,
    seat_utilization DECIMAL(5, 2) DEFAULT 0.00,
    api_usage_percentage DECIMAL(5, 2) DEFAULT 0.00,
    payment_score DECIMAL(5, 2) DEFAULT 0.00,
    nps_score DECIMAL(5, 2) DEFAULT 0.00,
    final_health_score DECIMAL(5, 2) DEFAULT 0.00,
    risk_level ENUM('Healthy', 'At-Risk', 'Churn') DEFAULT 'Healthy',
    churn_probability DECIMAL(5, 4) DEFAULT 0.0000,
    last_score_update DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (startup_id) REFERENCES startups(id) ON DELETE CASCADE
);

-- 4. Expansion & Referral
CREATE TABLE IF NOT EXISTS expansion_leads (
    id INT PRIMARY KEY AUTO_INCREMENT,
    startup_id INT,
    opportunity_type ENUM('Upsell', 'Cross-sell', 'Referral'),
    lead_status ENUM('Identified', 'AI_Notified', 'In_Progress', 'Converted'),
    potential_value DECIMAL(15, 2),
    confidence_score DECIMAL(3, 2) DEFAULT 0.00,
    FOREIGN KEY (startup_id) REFERENCES startups(id)
);

CREATE TABLE IF NOT EXISTS referral_ledger (
    id INT PRIMARY KEY AUTO_INCREMENT,
    referrer_id INT,
    referee_email VARCHAR(255),
    status ENUM('Pending', 'Verified', 'Converted'),
    reward_value DECIMAL(15, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (referrer_id) REFERENCES startups(id)
);

-- ==========================================================
-- SEED DATA
-- ==========================================================

REPLACE INTO roles (id, role_name) VALUES 
(1, 'Super Admin'), 
(2, 'Admin'), 
(3, 'Manager'), 
(4, 'Observer'), 
(5, 'Analyst');

REPLACE INTO permissions (id, permission_key, module_name) VALUES 
(1, 'mission-manifesto', 'Mission Overview'),
(2, 'system-brain', 'System Brain'),
(3, 'vital-signs', 'Health Matrix'),
(4, 'growth-engine', 'Expansion AI'),
(5, 'referral-scout', 'Referral Scout'),
(6, 'customer-360', 'Customer 360'),
(7, 'usage-telemetry', 'Usage Depth'),
(8, 'support-risk', 'Sentiment AI'),
(9, 'integration-hub', 'Integration Hub'),
(10, 'neurolink', 'Neuro-Link'),
(11, 'learning-studio', 'AI Studio'),
(12, 'audit-matrix', 'Security Audit'),
(13, 'alert-core', 'Alert Center'),
(14, 'executive-summary', 'Executive Lens'),
(15, 'system-config', 'System Core'),
(16, 'admin-ops', 'Admin Ops');

REPLACE INTO role_permissions (role_id, permission_id) VALUES 
(1,1),(1,2),(1,3),(1,4),(1,5),(1,6),(1,7),(1,8),(1,9),(1,10),(1,11),(1,12),(1,13),(1,14),(1,15),(1,16),
(2,1),(2,3),(2,4),(2,5),(2,6),(2,7),(2,8),(2,9),(2,11),(2,13),(2,14),(2,15),(2,16),
(3,1),(3,3),(3,6),(3,7),(3,8),(3,13),(3,14),(3,16),
(4,1),(4,14),(4,3),(4,6),(4,7),
(5,1),(5,3),(5,6),(5,7),(5,14);

REPLACE INTO users (id, name, email, password_hash, role_id) VALUES 
(1, 'Muthu SuperAdmin', 'super@ched.ai', '$2b$10$6R6y8U0K8F/X6S3Pj3Y/e.2m.Vq/7tG1Q0Pz6yXN5x3z6J7', 1),
(2, 'Operations Lead', 'admin@ched.ai', '$2b$10$6R6y8U0K8F/X6S3Pj3Y/e.2m.Vq/7tG1Q0Pz6yXN5x3z6J7', 2),
(3, 'Sarah Manager', 'sarah@ched.ai', '$2b$10$6R6y8U0K8F/X6S3Pj3Y/e.2m.Vq/7tG1Q0Pz6yXN5x3z6J7', 3),
(4, 'David Observer', 'david@ched.ai', '$2b$10$6R6y8U0K8F/X6S3Pj3Y/e.2m.Vq/7tG1Q0Pz6yXN5x3z6J7', 4),
(5, 'Executive Analyst', 'exec@ched.ai', '$2b$10$6R6y8U0K8F/X6S3Pj3Y/e.2m.Vq/7tG1Q0Pz6yXN5x3z6J7', 5);

INSERT INTO startups (id, company_name, industry, funding_stage, current_mrr, account_manager_id, status) VALUES 
(1, 'EcoFlow', 'CleanTech', 'Series A', 50000.00, 3, 'Active'),
(2, 'TechNova', 'SaaS', 'Seed', 12000.00, 3, 'At-Risk'),
(3, 'CloudScale', 'Infrastructure', 'Series B', 150000.00, 3, 'Active'),
(4, 'DataMesh', 'Data AI', 'Series A', 45000.00, 3, 'Active'),
(5, 'FinStream', 'Fintech', 'Series C', 250000.00, 3, 'Active'),
(6, 'HealthSync', 'Healthcare', 'Series A', 35000.00, 3, 'At-Risk'),
(7, 'CyberGuard', 'Cybersecurity', 'Series B', 85000.00, 3, 'Active'),
(8, 'LogiLink', 'Logistics', 'Seed', 8000.00, 3, 'Churned'),
(9, 'EduPath', 'EdTech', 'Series A', 22000.00, 3, 'Active'),
(10, 'GreenGrid', 'CleanTech', 'Series B', 72000.00, 3, 'Active'),
(11, 'MarketMind', 'MarTech', 'Seed', 15000.00, 3, 'At-Risk'),
(12, 'SecureNet', 'Cybersecurity', 'Series C', 190000.00, 3, 'Active'),
(13, 'BioGen', 'Healthcare', 'Series A', 48000.00, 3, 'Active'),
(14, 'QuantReady', 'Fintech', 'Series B', 95000.00, 3, 'Active'),
(15, 'NanoSol', 'DeepTech', 'Series A', 31000.00, 3, 'Active')
ON DUPLICATE KEY UPDATE company_name=VALUES(company_name);

INSERT INTO health_metrics (startup_id, feature_adoption_rate, active_support_tickets, seat_utilization, api_usage_percentage, payment_score, nps_score, final_health_score, risk_level, churn_probability) VALUES 
(1, 85.00, 1, 92.00, 45.00, 95.00, 88.00, 88.00, 'Healthy', 0.05),
(2, 25.00, 3, 40.00, 10.00, 60.00, 40.00, 38.00, 'Churn', 0.75),
(3, 95.00, 0, 98.00, 88.00, 99.00, 95.00, 96.00, 'Healthy', 0.01),
(4, 70.00, 2, 60.00, 30.00, 80.00, 75.00, 72.00, 'At-Risk', 0.15),
(5, 88.00, 0, 95.00, 90.00, 100.00, 92.00, 93.00, 'Healthy', 0.02),
(6, 45.00, 5, 65.00, 40.00, 70.00, 50.00, 52.00, 'At-Risk', 0.40),
(7, 82.00, 1, 80.00, 70.00, 90.00, 85.00, 84.00, 'Healthy', 0.08),
(8, 10.00, 8, 15.00, 5.00, 30.00, 20.00, 18.00, 'Churn', 0.95),
(9, 65.00, 2, 70.00, 55.00, 85.00, 70.00, 70.00, 'Healthy', 0.20),
(10, 90.00, 1, 94.00, 85.00, 95.00, 90.00, 92.00, 'Healthy', 0.03),
(11, 35.00, 4, 30.00, 20.00, 50.00, 45.00, 42.00, 'At-Risk', 0.55),
(12, 92.00, 0, 91.00, 95.00, 100.00, 94.00, 94.00, 'Healthy', 0.01),
(13, 78.00, 1, 75.00, 60.00, 88.00, 80.00, 79.00, 'Healthy', 0.12),
(14, 84.00, 1, 88.00, 75.00, 92.00, 85.00, 86.00, 'Healthy', 0.06),
(15, 75.00, 2, 82.00, 65.00, 85.00, 78.00, 77.00, 'Healthy', 0.14)
ON DUPLICATE KEY UPDATE final_health_score=VALUES(final_health_score);

INSERT INTO expansion_leads (startup_id, opportunity_type, lead_status, potential_value, confidence_score) VALUES 
(1, 'Upsell', 'Identified', 15000.00, 0.95),
(3, 'Upsell', 'In_Progress', 25000.00, 0.98),
(5, 'Cross-sell', 'AI_Notified', 12000.00, 0.85),
(7, 'Upsell', 'Identified', 8000.00, 0.75),
(10, 'Upsell', 'In_Progress', 20000.00, 0.92),
(12, 'Cross-sell', 'Identified', 18000.00, 0.88),
(14, 'Upsell', 'Identified', 10000.00, 0.80),
(15, 'Referral', 'Identified', 5000.00, 0.70),
(4, 'Cross-sell', 'Converted', 7000.00, 0.99),
(13, 'Upsell', 'Identified', 12500.00, 0.82)
ON DUPLICATE KEY UPDATE potential_value=VALUES(potential_value);

INSERT INTO referral_ledger (referrer_id, referee_email, status, reward_value) VALUES 
(3, 'newstartup1@gmail.com', 'Converted', 5000.00),
(5, 'contact@finproto.io', 'Verified', 2500.00),
(12, 'growth@cybernext.com', 'Pending', 0.00),
(1, 'founder@cleanloop.co', 'Converted', 5000.00),
(10, 'info@gridbase.energy', 'Pending', 0.00),
(14, 'partner@quantpay.com', 'Verified', 2500.00),
(7, 'security@shieldhub.ai', 'Converted', 5000.00),
(9, 'dean@edunext.edu', 'Pending', 0.00),
(15, 'labs@nanotech.io', 'Pending', 0.00),
(4, 'data@meshlabs.ai', 'Converted', 5000.00)
ON DUPLICATE KEY UPDATE reward_value=VALUES(reward_value);

SET FOREIGN_KEY_CHECKS = 1;
