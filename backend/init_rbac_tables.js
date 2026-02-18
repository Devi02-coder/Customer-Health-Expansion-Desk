const db = require('./config/db');
const { MODULES, ROLE_MODULE_ACCESS } = require('./config/rbac_config');

async function queryWithRetry(sql, params = [], retries = 5) {
    for (let i = 0; i < retries; i++) {
        try {
            return await db.promise().query(sql, params);
        } catch (err) {
            if (i === retries - 1) throw err;
            console.warn(`Query failed, retrying in 3s... (${i + 1}/${retries}) - Error: ${err.message}`);
            await new Promise(r => setTimeout(r, 3000));
        }
    }
}

async function run() {
    console.log("Upgrading RBAC System to Frozen Industry Standards (v2.3 - Resilient)...");

    try {
        await queryWithRetry("SET FOREIGN_KEY_CHECKS = 0;");

        const dropCreateQueries = [
            "DROP TABLE IF EXISTS role_permissions",
            "DROP TABLE IF EXISTS permissions",
            "DROP TABLE IF EXISTS users",
            "DROP TABLE IF EXISTS roles",
            "CREATE TABLE roles (id INT PRIMARY KEY AUTO_INCREMENT, role_name VARCHAR(50) UNIQUE NOT NULL)",
            "CREATE TABLE permissions (id INT PRIMARY KEY AUTO_INCREMENT, permission_key VARCHAR(100) UNIQUE NOT NULL, module_name VARCHAR(100) NOT NULL)",
            "CREATE TABLE role_permissions (role_id INT, permission_id INT, can_edit BOOLEAN DEFAULT FALSE, PRIMARY KEY (role_id, permission_id), FOREIGN KEY (role_id) REFERENCES roles(id), FOREIGN KEY (permission_id) REFERENCES permissions(id))",
            "CREATE TABLE users (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(100) NOT NULL, email VARCHAR(100) UNIQUE NOT NULL, password_hash TEXT NOT NULL, role_id INT, status ENUM('active', 'inactive') DEFAULT 'active', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (role_id) REFERENCES roles(id))"
        ];

        for (const sql of dropCreateQueries) {
            console.log(`Executing: ${sql.substring(0, 50)}...`);
            await queryWithRetry(sql);
            await new Promise(r => setTimeout(r, 1000)); // Cool down
        }

        // 1. Bulk Insert Roles
        const roleNames = ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'SALES', 'OBSERVER'];
        const roleDisplayNames = {
            'SUPER_ADMIN': 'Super Admin',
            'ADMIN': 'Admin',
            'MANAGER': 'Manager',
            'SALES': 'Sales / Success',
            'OBSERVER': 'Observer'
        };
        const roleValues = roleNames.map((name, i) => [i + 1, roleDisplayNames[name]]);
        console.log("Bulk Inserting Roles...");
        await queryWithRetry("INSERT INTO roles (id, role_name) VALUES ?", [roleValues]);

        // 2. Bulk Insert Permissions
        const moduleEntries = Object.values(MODULES);
        const permValues = moduleEntries.map((mod, i) => [i + 1, mod.key, mod.label]);
        console.log("Bulk Inserting Permissions...");
        await queryWithRetry("INSERT INTO permissions (id, permission_key, module_name) VALUES ?", [permValues]);

        // 3. Aggregate Role Permissions
        const permMap = {};
        moduleEntries.forEach((mod, i) => { permMap[mod.key] = i + 1; });

        const rpValues = [];
        for (let i = 0; i < roleNames.length; i++) {
            const roleName = roleNames[i];
            const allowedModules = ROLE_MODULE_ACCESS[roleName];
            const roleId = i + 1;

            for (const modKey of allowedModules) {
                const permId = permMap[modKey];
                if (permId) {
                    const canEdit = ['SUPER_ADMIN', 'ADMIN', 'SALES'].includes(roleName) ? 1 : 0;
                    rpValues.push([roleId, permId, canEdit]);
                }
            }
        }
        if (rpValues.length > 0) {
            console.log(`Bulk Inserting ${rpValues.length} Role-Permission Mappings...`);
            await queryWithRetry("INSERT INTO role_permissions (role_id, permission_id, can_edit) VALUES ?", [rpValues]);
        }

        // 4. Insert Default Users
        const commonPass = '$2b$10$6R6y8U0K8F/X6S3Pj3Y/e.2m.Vq/7tG1Q0Pz6yXN5x3z6J7';
        const userValues = [
            [1, 'Muthu SuperAdmin', 'super@ched.ai', commonPass, 1],
            [2, 'Operations Lead', 'admin@ched.ai', commonPass, 2],
            [3, 'Sarah Manager', 'sarah@ched.ai', commonPass, 3],
            [4, 'David Success', 'success@ched.ai', commonPass, 4],
            [5, 'Executive Observer', 'observer@ched.ai', commonPass, 5]
        ];
        console.log("Bulk Inserting Default Users...");
        await queryWithRetry("INSERT INTO users (id, name, email, password_hash, role_id) VALUES ?", [userValues]);

        await queryWithRetry("SET FOREIGN_KEY_CHECKS = 1;");
        console.log(`🚀 RBAC v2.3 Applied Successfully: Seeding Complete.`);
    } catch (err) {
        console.error("FATAL ERROR seeding RBAC:", err.message);
        if (err.sql) console.error("Failed SQL:", err.sql);
    }
    process.exit();
}

run();
