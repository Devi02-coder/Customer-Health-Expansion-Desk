const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

async function refreshDatabase() {
    console.log(`Connecting to remote database ${process.env.DB_NAME} at ${process.env.DB_HOST}...`);

    // Connect directly to the database
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 3306,
        multipleStatements: true
    });

    try {
        console.log('Reading schema.sql...');
        const schemaPath = path.join(__dirname, 'schema.sql');
        let sql = fs.readFileSync(schemaPath, 'utf8');

        // Remove CREATE DATABASE and USE lines from SQL to avoid permission issues
        sql = sql.replace(/CREATE DATABASE IF NOT EXISTS.*;/gi, '');
        sql = sql.replace(/USE.*;/gi, '');

        console.log('Executing SQL script on remote host...');
        await connection.query(sql);
        console.log('✅ Remote Database refreshed successfully with all seed data.');
    } catch (error) {
        console.error('❌ Error refreshing remote database:', error.message);
    } finally {
        await connection.end();
    }
}

refreshDatabase();
