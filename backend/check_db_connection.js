const mysql = require('mysql2');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

console.log('Connecting to:', {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to Db:', err.code, err.message);
        return;
    }
    console.log('Connected to Db!');

    connection.query('SHOW TABLES', (err, results) => {
        if (err) {
            console.error('Error showing tables:', err);
        } else {
            console.log('Tables found:', results.length);
            console.log(results.map(r => Object.values(r)[0]));
        }
        connection.end();
    });
});
