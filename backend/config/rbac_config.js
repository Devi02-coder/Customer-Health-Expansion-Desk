/**
 * RBAC_CONFIG: Single Source of Truth
 * This matrix defines module visibility and access across the entire application.
 */
const MODULES = {
    SYSTEM_BRAIN: { key: 'SYSTEM_BRAIN', label: 'System Brain' },
    HEALTH_MATRIX: { key: 'HEALTH_MATRIX', label: 'Health Matrix' },
    EXPANSION_AI: { key: 'EXPANSION_AI', label: 'Expansion AI' },
    REFERRAL_SCOUT: { key: 'REFERRAL_SCOUT', label: 'Referral Scout' },
    CUSTOMER_360: { key: 'CUSTOMER_360', label: 'Customer 360' },
    USAGE_DEPTH: { key: 'USAGE_DEPTH', label: 'Usage Depth' },
    SENTIMENT_AI: { key: 'SENTIMENT_AI', label: 'Sentiment AI' },
    INTEGRATION_HUB: { key: 'INTEGRATION_HUB', label: 'Integration Hub' },
    NEURO_LINK: { key: 'NEURO_LINK', label: 'Neuro Link' },
    AI_STUDIO: { key: 'AI_STUDIO', label: 'AI Studio' },
    SECURITY_AUDIT: { key: 'SECURITY_AUDIT', label: 'Security Audit' },
    ALERT_CENTER: { key: 'ALERT_CENTER', label: 'Alert Center' },
    EXECUTIVE_LENS: { key: 'EXECUTIVE_LENS', label: 'Executive Lens' },
    AGENT_CONSOLE: { key: 'AGENT_CONSOLE', label: 'Agent Console' },
    SYSTEM_CORE: { key: 'SYSTEM_CORE', label: 'System Core' },
    ADMIN_OPS: { key: 'ADMIN_OPS', label: 'Admin Ops' }
};

const ROLE_MODULE_ACCESS = {
    SUPER_ADMIN: [
        "SYSTEM_BRAIN",
        "HEALTH_MATRIX",
        "EXPANSION_AI",
        "REFERRAL_SCOUT",
        "CUSTOMER_360",
        "USAGE_DEPTH",
        "SENTIMENT_AI",
        "INTEGRATION_HUB",
        "NEURO_LINK",
        "AI_STUDIO",
        "SECURITY_AUDIT",
        "ALERT_CENTER",
        "EXECUTIVE_LENS",
        "AGENT_CONSOLE",
        "SYSTEM_CORE",
        "ADMIN_OPS"
    ],

    ADMIN: [
        "SYSTEM_BRAIN",
        "HEALTH_MATRIX",
        "EXPANSION_AI",
        "REFERRAL_SCOUT",
        "CUSTOMER_360",
        "USAGE_DEPTH",
        "SENTIMENT_AI",
        "INTEGRATION_HUB",
        "ALERT_CENTER",
        "EXECUTIVE_LENS",
        "AGENT_CONSOLE",
        "ADMIN_OPS"
    ],

    MANAGER: [
        "HEALTH_MATRIX",
        "EXPANSION_AI",
        "REFERRAL_SCOUT",
        "CUSTOMER_360",
        "USAGE_DEPTH",
        "SENTIMENT_AI",
        "ALERT_CENTER",
        "EXECUTIVE_LENS"
    ],

    SALES: [
        "HEALTH_MATRIX",
        "EXPANSION_AI",
        "REFERRAL_SCOUT",
        "CUSTOMER_360",
        "USAGE_DEPTH",
        "SENTIMENT_AI",
        "ALERT_CENTER",
        "AGENT_CONSOLE"
    ],

    OBSERVER: [
        "HEALTH_MATRIX",
        "CUSTOMER_360",
        "USAGE_DEPTH",
        "EXECUTIVE_LENS"
    ]
};

module.exports = {
    MODULES,
    ROLE_MODULE_ACCESS
};
