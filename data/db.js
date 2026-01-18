import mysql from 'mysql2/promise';

// Configurazione per Railway (produzione) o locale (sviluppo)
const pool = mysql.createPool({
    host: process.env.MYSQLHOST || 'localhost',
    port: parseInt(process.env.MYSQLPORT) || 3306,
    user: process.env.MYSQLUSER || 'root',
    password: process.env.MYSQLPASSWORD || '',
    database: process.env.MYSQLDATABASE || 'secret_santa',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000
});

// Test connessione al startup
pool.getConnection()
    .then(connection => {
        console.log('✅ MySQL Database connected successfully');
        console.log(`📍 Host: ${process.env.MYSQLHOST || 'localhost'}`);
        console.log(`📍 Port: ${process.env.MYSQLPORT || 3306}`);
        console.log(`📍 Database: ${process.env.MYSQLDATABASE || 'secret_santa'}`);
        connection.release();
    })
    .catch(err => {
        console.error('❌ MySQL connection error:', err.message);
        console.error('Full error:', err);
    });

export default pool;
