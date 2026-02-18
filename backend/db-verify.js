
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

async function verifyConnection() {
    console.log(`[DB Verify] Attempting connection to ${process.env.DB_HOST}...`);

    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME || 'startups_db',
            port: process.env.DB_PORT || 3306,
            connectTimeout: 10000
        });

        console.log('✅ [SUCCESS] Connected to database!');

        const [rows] = await connection.execute('SHOW TABLES');
        console.log('📄 Tables found:', rows.map(r => Object.values(r)[0]));

        const [startupCount] = await connection.execute('SELECT COUNT(*) as count FROM startups');
        console.log(`📊 Startup count: ${startupCount[0].count}`);

        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ [FAILURE] Database connection failed:', error.message);
        if (error.code === 'ETIMEDOUT') {
            console.error('   -> Hint: Check your IP whitelist or VPN settings.');
        }
        process.exit(1);
    }
}

verifyConnection();
