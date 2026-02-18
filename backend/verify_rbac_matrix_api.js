const axios = require('axios');

const ROLE_MODULE_ACCESS_EXPECTED = {
    'Super Admin': [
        "SYSTEM_BRAIN", "HEALTH_MATRIX", "EXPANSION_AI", "REFERRAL_SCOUT", "CUSTOMER_360",
        "USAGE_DEPTH", "SENTIMENT_AI", "INTEGRATION_HUB", "NEURO_LINK", "AI_STUDIO",
        "SECURITY_AUDIT", "ALERT_CENTER", "EXECUTIVE_LENS", "AGENT_CONSOLE", "SYSTEM_CORE",
        "ADMIN_OPS"
    ],
    'Admin': [
        "SYSTEM_BRAIN", "HEALTH_MATRIX", "EXPANSION_AI", "REFERRAL_SCOUT", "CUSTOMER_360",
        "USAGE_DEPTH", "SENTIMENT_AI", "INTEGRATION_HUB", "ALERT_CENTER", "EXECUTIVE_LENS",
        "AGENT_CONSOLE", "ADMIN_OPS"
    ],
    'Manager': [
        "HEALTH_MATRIX", "EXPANSION_AI", "REFERRAL_SCOUT", "CUSTOMER_360", "USAGE_DEPTH",
        "SENTIMENT_AI", "ALERT_CENTER", "EXECUTIVE_LENS"
    ],
    'Sales / Success': [
        "HEALTH_MATRIX", "EXPANSION_AI", "REFERRAL_SCOUT", "CUSTOMER_360", "USAGE_DEPTH",
        "SENTIMENT_AI", "ALERT_CENTER", "AGENT_CONSOLE"
    ],
    'Observer': [
        "HEALTH_MATRIX", "CUSTOMER_360", "USAGE_DEPTH", "EXECUTIVE_LENS"
    ]
};

const roleToUserId = {
    'Super Admin': 1,
    'Admin': 2,
    'Manager': 3,
    'Sales / Success': 4,
    'Observer': 5
};

async function verify() {
    console.log("Starting RBAC Matrix API Verification...");
    let allPassed = true;

    for (const [role, expectedModules] of Object.entries(ROLE_MODULE_ACCESS_EXPECTED)) {
        const userId = roleToUserId[role];
        try {
            const res = await axios.get('http://localhost:5005/api/user/permissions', {
                headers: { 'x-role': role, 'x-user-id': userId }
            });

            const actualModules = res.data.modules.map(m => m.key);
            const missing = expectedModules.filter(m => !actualModules.includes(m));
            const extra = actualModules.filter(m => !expectedModules.includes(m));

            if (missing.length === 0 && extra.length === 0) {
                console.log(`✅ ${role}: OK (${actualModules.length} modules)`);
            } else {
                allPassed = false;
                console.log(`❌ ${role}: FAILED`);
                if (missing.length > 0) console.log(`   Missing: ${missing.join(', ')}`);
                if (extra.length > 0) console.log(`   Extra: ${extra.join(', ')}`);
            }
        } catch (e) {
            allPassed = false;
            console.log(`❌ ${role}: ERROR - ${e.message}`);
        }
    }

    if (allPassed) {
        console.log("\n🚀 Verification COMPLETE: All roles match the RBAC Matrix exactly.");
    } else {
        console.log("\n⚠️ Verification FAILED: Some roles do not match the expected Matrix.");
    }
}

verify();
