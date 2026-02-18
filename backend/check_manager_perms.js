const db = require('./config/db');

async function check() {
    try {
        const [rows] = await db.promise().query(`
            SELECT p.permission_key 
            FROM role_permissions rp 
            JOIN permissions p ON rp.permission_id = p.id 
            WHERE rp.role_id = 3
        `);
        console.log("Current Manager Permissions in DB:");
        console.log(rows.map(r => r.permission_key));
    } catch (err) {
        console.error(err);
    }
    process.exit();
}

check();
