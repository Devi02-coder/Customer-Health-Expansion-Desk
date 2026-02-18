const mysql = require('mysql2');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

connection.connect((err) => {
    if (err) {
        console.error('Connection failed:', err);
        return;
    }
    console.log('Connected.');

    const query = "CREATE TABLE IF NOT EXISTS test_creation (id INT PRIMARY KEY)";
    connection.query(query, (err, results) => {
        if (err) {
            console.error('CREATE TABLE failed:', err.code, err.message);
        } else {
            console.log('CREATE TABLE succeeded:', results);
            // Clean up
            connection.query("DROP TABLE test_creation", (err) => {
                if (err) console.error('DROP TABLE failed:', err);
                else console.log('DROP TABLE succeeded');
                connection.end();
            });
        }
    });
});
