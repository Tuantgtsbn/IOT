// Init MySQL connection
const mysql = require('mysql2/promise');
require('dotenv').config({ path: 'src\\.env' }); // Load file .env vào project

// console.log(process.env);
const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: 3306, // Mặc định cổng MySQL là 3306
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}
const connectToDatabase = async () => {
    try {
        // console.log(process.env.DB_DATABASE);
        const connection = await mysql.createConnection(config);
        console.log('Connected to MySQL');
        return connection;

    } catch (error) {
        console.error('Database connection failed:', error.message);
        throw error;

    }
};

const query = async (sql, params) => {
    try {
        const connection = await connectToDatabase(); // Kết nối đến database
        const [results] = await connection.query(sql, params); // Thực thi câu truy vấn
        await connection.end(); // Đóng kết nối
        return results;
    } catch (error) {
        console.error('Error executing query:', error.message);
        throw error;
    }
};

// Xuất các module để sử dụng trong file khác
module.exports = {
    connectToDatabase,
    query
};