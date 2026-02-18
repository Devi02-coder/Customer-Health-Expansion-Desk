const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Role Definitions for Consistency
const ROLES = {
    SUPER_ADMIN: 'Super Admin',
    ADMIN: 'Admin',
    MANAGER: 'Manager',
    SALES_SUCCESS: 'Sales / Success',
    OBSERVER: 'Observer'
};

// Database Connection
// Database Connection
const db = require('./config/db');

// Mock Auth Middleware
const mockAuth = (req, res, next) => {
    req.user = {
        role: req.headers['x-role'] || ROLES.SUPER_ADMIN,
        id: req.headers['x-user-id'] || 1
    };
    next();
};

// Industry-Grade RBAC Middleware
// Industry-Grade RBAC Middleware
const { ROLE_MODULE_ACCESS, MODULES } = require('./config/rbac_config');

const checkAccess = (moduleKey) => {
    return (req, res, next) => {
        const userId = req.user.id;
        const query = `
            SELECT rp.can_edit
            FROM users u
            JOIN role_permissions rp ON u.role_id = rp.role_id
            JOIN permissions p ON rp.permission_id = p.id
            WHERE u.id = ? AND p.permission_key = ?
        `;
        db.query(query, [userId, moduleKey], (err, results) => {
            if (err || results.length === 0) {
                // FALLBACK: Use Static Config if DB fails or is empty/missing user
                if (err) console.warn(`[RBAC] DB Check failed for ${moduleKey}: ${err.message}`);

                // Find user role key by value
                const roleKey = Object.keys(ROLES).find(key => ROLES[key] === req.user.role) || 'SUPER_ADMIN';
                const allowedModules = ROLE_MODULE_ACCESS[roleKey] || [];

                if (allowedModules.includes(moduleKey)) {
                    req.canEdit = true; // Default to true in fallback
                    return next();
                } else {
                    return res.status(403).json({
                        error: "PERMISSION_DENIED_FALLBACK",
                        message: `Access Denied (Fallback): Restricted Module [${moduleKey}]`
                    });
                }
            }

            req.canEdit = !!results[0].can_edit;
            next();
        });
    };
};

const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        if (allowedRoles.includes(req.user.role)) next();
        else res.status(403).json({ error: "Role Unauthorized" });
    };
};

// --- ROUTES ---

// 1. Dashboard Aggregates
app.get('/api/dashboard/stats', mockAuth, checkAccess('SYSTEM_BRAIN'), (req, res) => {
    const queries = {
        health: "SELECT risk_level as name, COUNT(*) as value FROM health_metrics GROUP BY risk_level",
        expansion: "SELECT opportunity_type as name, SUM(potential_value) as value FROM expansion_leads GROUP BY opportunity_type",
        referrals: "SELECT status as name, COUNT(*) as value FROM referral_ledger GROUP BY status",
        kpis: "SELECT AVG(final_health_score) as avg_health, SUM(potential_value) as pipeline_value FROM health_metrics JOIN expansion_leads"
    };
    // ... logic ...
    const results = {};
    let completed = 0;
    const keys = Object.keys(queries);

    keys.forEach(key => {
        db.query(queries[key], (err, data) => {
            if (err) return res.status(500).json({ error: err.message });
            results[key] = data;
            completed++;
            if (completed === keys.length) res.json(results);
        });
    });
});

app.post('/api/health/update', mockAuth, checkAccess('HEALTH_MATRIX'), (req, res) => {
    if (!req.canEdit) return res.status(403).json({ error: "Access Denied: Read-Only Authority" });
    const { startupId, score } = req.body;

    // ANTI-GRAVITY BUG: Missing backend validation for negative scores!
    if (score < 0 || score > 100) {
        return res.status(400).json({ error: "Score must be between 0 and 100" });
    }

    const query = `UPDATE health_metrics SET final_health_score = ? WHERE startup_id = ?`;
    db.query(query, [score, startupId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, message: `Health score updated to ${score}` });
    });
});


// 2. Recovery Mission Diagnostics
app.get('/api/ai/diagnose/:startupId', mockAuth, checkAccess('HEALTH_MATRIX'), (req, res) => {
    const { startupId } = req.params;
    const query = `
        SELECT s.company_name, h.* 
        FROM startups s
        JOIN health_metrics h ON s.id = h.startup_id
        WHERE s.id = ?
    `;
    db.query(query, [startupId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: "Startup not found" });

        const data = results[0];
        const missionBrief = {
            priority: data.churn_probability > 0.7 ? "CRITICAL" : data.active_support_tickets > 3 ? "URGENT" : "MEDIUM",
            objective: `Autonomous Engagement: ${data.company_name}`,
            churn_risk: `${(data.churn_probability * 100).toFixed(0)}%`,
            suggestedAction: data.feature_adoption_rate < 30
                ? "Trigger Re-Onboarding sequence via AI browser agent."
                : "Escalate support ticket #4429 - Account requires technical intervention.",
            diagnostics: {
                adoption: data.feature_adoption_rate,
                tickets: data.active_support_tickets,
                seats: data.seat_utilization
            }
        };
        res.json(missionBrief);
    });
});

// 3. Expansion Leads
app.get('/api/growth/expansion-leads', mockAuth, checkAccess('EXPANSION_AI'), (req, res) => {
    const query = `
        SELECT s.company_name, e.*, h.seat_utilization, h.feature_adoption_rate
        FROM startups s
        JOIN expansion_leads e ON s.id = e.startup_id
        JOIN health_metrics h ON s.id = h.startup_id
        WHERE e.lead_status != 'Converted'
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        const enhancedResults = results.map(lead => ({
            ...lead,
            reasoning: lead.seat_utilization > 90
                ? `Critical Utilization: ${lead.seat_utilization}% seats active. Expansion is inevitable.`
                : `Product Maturity: Adoption at ${lead.feature_adoption_rate}%. Candidate for ${lead.opportunity_type}.`
        }));
        res.json(enhancedResults);
    });
});

// 4. Referral Ledger
app.get('/api/growth/referrals', mockAuth, checkAccess('REFERRAL_SCOUT'), (req, res) => {
    const query = `
        SELECT r.*, s.company_name as referrer_name
        FROM referral_ledger r
        JOIN startups s ON r.referrer_id = s.id
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 5. System Audit Logs
app.get('/api/admin/audit-logs', mockAuth, checkAccess('SECURITY_AUDIT'), (req, res) => {
    // Mocking active agent logs
    const logs = [
        { id: 1, action: 'AUTH_OVERRIDE', actor: 'Super Admin', target: 'AI_MODEL_V4', status: 'SUCCESS', time: '2m ago' },
        { id: 2, action: 'WEIGHT_SYNC', actor: 'System_Daemon', target: 'Neural_Node_4', status: 'COMPLETED', time: '14m ago' },
        { id: 3, action: 'ACCESS_REJECT', actor: 'Guest_77', target: 'Executive_DB', status: 'BLOCKED', time: '1h ago' },
        { id: 4, action: 'RECOVERY_TRIGGER', actor: 'CHED_Agent', target: 'Startup_X', status: 'ACTIVE', time: '2h ago' }
    ];
    res.json(logs);
});

// 6. AI Model Tuning
app.post('/api/ai/tune-thresholds', mockAuth, checkAccess('AI_STUDIO'), (req, res) => {
    if (!req.canEdit) return res.status(403).json({ error: "Access Denied: Read-Only Authority" });
    const { thresholds } = req.body;
    // Simulation of updating model config
    res.json({ success: true, message: "AI thresholds updated successfully.", active_version: "V4.2-STABLE" });
});

// 7. All Startups (Role-Filtered)
app.get('/api/startups', mockAuth, (req, res) => {
    let query = `
        SELECT s.*, h.feature_adoption_rate, h.active_support_tickets, h.seat_utilization, h.risk_level, h.final_health_score
        FROM startups s
        LEFT JOIN health_metrics h ON s.id = h.startup_id
    `;
    if (req.user.role === ROLES.MANAGER) query += ` WHERE s.account_manager_id = ${req.user.id}`;

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 8. System Intelligence (For Super Admin)
app.get('/api/admin/identity-config', mockAuth, checkAccess('SYSTEM_CORE'), (req, res) => {
    res.json({
        roles: Object.values(ROLES),
        system_stats: {
            uptime: "128.4h",
            connectivity: "99.99%",
            agents_deployed: 14,
            neural_link: "Active"
        }
    });
});

// 9. User Permissions & Dynamic Routing (Single Source of Truth)
app.get('/api/user/permissions', mockAuth, (req, res) => {
    const userId = req.user.id;
    const role = req.user.role;

    const query = `
        SELECT r.role_name, p.permission_key as \`key\`, rp.can_edit
        FROM users u
        JOIN roles r ON u.role_id = r.id
        JOIN role_permissions rp ON r.id = rp.role_id
        JOIN permissions p ON rp.permission_id = p.id
        WHERE u.id = ?
    `;
    db.query(query, [userId], (err, results) => {
        if (err || results.length === 0) {
            // FALLBACK for Permissions
            if (err) console.warn(`[PERMISSIONS] DB Error: ${err.message}`);

            const roleKey = Object.keys(ROLES).find(key => ROLES[key] === role) || 'SUPER_ADMIN';
            const allowedKeys = ROLE_MODULE_ACCESS[roleKey] || [];

            const modules = allowedKeys.map(key => ({
                key: key,
                can_edit: true // Default true for fallback
            }));

            return res.json({
                role: role,
                modules: modules
            });
        }

        const modules = results.map(r => ({
            key: r.key,
            can_edit: !!r.can_edit
        }));

        res.json({
            role: results[0].role_name,
            modules: modules
        });
    });
});

// 10. Global Search
app.get('/api/search', mockAuth, (req, res) => {
    const { q } = req.query;
    if (!q) return res.json([]);

    const userId = req.user.id;
    const role = req.user.role;
    const term = `%${q}%`;

    // 1. Get User Permissions first to filter search scope
    const permQuery = `
        SELECT p.permission_key 
        FROM users u 
        JOIN role_permissions rp ON u.role_id = rp.role_id 
        JOIN permissions p ON rp.permission_id = p.id 
        WHERE u.id = ? OR ? = 'Super Admin'
    `;

    db.query(permQuery, [userId, role], (pErr, pResults) => {
        if (pErr) return res.status(500).json({ error: "Search Authorization Error" });

        const allowedKeys = pResults.map(r => r.permission_key);
        const isSuper = role === 'Super Admin';

        const searchQueries = [];
        if (isSuper || allowedKeys.includes('HEALTH_MATRIX')) {
            searchQueries.push({ key: 'startups', sql: "SELECT id, company_name as title, 'Startup' as type, status as subtitle FROM startups WHERE company_name LIKE ?" });
        }
        if (isSuper || allowedKeys.includes('EXPANSION_AI')) {
            searchQueries.push({ key: 'leads', sql: "SELECT e.id, s.company_name as title, 'Opportunity' as type, e.opportunity_type as subtitle FROM expansion_leads e JOIN startups s ON e.startup_id = s.id WHERE s.company_name LIKE ?" });
        }
        if (isSuper || allowedKeys.includes('REFERRAL_SCOUT')) {
            searchQueries.push({ key: 'referrals', sql: "SELECT r.id, r.referee_email as title, 'Referral' as type, s.company_name as subtitle FROM referral_ledger r JOIN startups s ON r.referrer_id = s.id WHERE r.referee_email LIKE ?" });
        }

        if (searchQueries.length === 0) return res.json([]);

        const results = [];
        let completed = 0;

        searchQueries.forEach(target => {
            db.query(target.sql, [term], (err, data) => {
                if (!err) results.push(...data);
                completed++;
                if (completed === searchQueries.length) res.json(results);
            });
        });
    });
});

// 11. AI Agent Chat
app.post('/api/ai/chat', mockAuth, checkAccess('AGENT_CONSOLE'), (req, res) => {
    const { message, context } = req.body;

    // Simple Rules-Based AI Simulation
    let reply = "I'm analyzing the neural stream... can you clarify?";
    const lowerMsg = message.toLowerCase();

    if (lowerMsg.includes('risk') || lowerMsg.includes('churn')) {
        reply = "I've detected 3 accounts with high churn probability: TechNova (75%), LogiLink (95%), and HealthSync (40%). Recommending immediate intervention for TechNova due to recent drop in adoption.";
    } else if (lowerMsg.includes('revenue') || lowerMsg.includes('forecast')) {
        reply = "Current revenue velocity is favorable. we are tracking $124k in the expansion pipeline. Q3 forecast is projecting a 15% increase quarter-over-quarter.";
    } else if (lowerMsg.includes('opportunity') || lowerMsg.includes('upsell')) {
        reply = "EcoFlow is our top upsell candidate (95% confidence). They have hit 92% seat utilization. Shall I draft a proposal?";
    } else if (lowerMsg.includes('status') || lowerMsg.includes('health')) {
        reply = "System health is nominal. 98.2% of active nodes are reporting steady heartbeats. 2 alerts require your attention in the Alert Core.";
    } else if (lowerMsg.includes('email') || lowerMsg.includes('send')) {
        reply = "Dispatching autonomous communication sequences... Done. Emails have been queued for the identified contacts.";
    }

    // Simulate thinking delay
    setTimeout(() => {
        res.json({ reply, timestamp: new Date().toISOString() });
    }, 1500);
});

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`🚀 CHED Backend running on port ${PORT}`));
