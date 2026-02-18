
const axios = require('axios');

async function testPermissions() {
    try {
        console.log("Testing Super Admin (ID 1)...");
        const res1 = await axios.get('http://localhost:5005/api/user/permissions', {
            headers: { 'x-role': 'Super Admin', 'x-user-id': 1 }
        });
        console.log("Super Admin Modules:", res1.data.modules.length);

        console.log("Testing Manager (ID 3)...");
        const res3 = await axios.get('http://localhost:5005/api/user/permissions', {
            headers: { 'x-role': 'Manager', 'x-user-id': 3 }
        });
        console.log("Manager Modules:", res3.data.modules.length);

        if (res1.data.modules.length > 0) {
            console.log("✅ RBAC API is working.");
        } else {
            console.log("❌ RBAC API returned 0 modules.");
        }
    } catch (error) {
        console.error("❌ RBAC API Failed:", error.message);
    }
}

testPermissions();
