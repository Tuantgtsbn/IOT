// // Init MySQL connection
// const mysql = require('mysql2/promise');
// require('dotenv').config({ path: 'src\\.env' }); // Load file .env vào project

// // console.log(process.env);
// const config = {
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_DATABASE,
//     port: 3306, // Mặc định cổng MySQL là 3306
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
// }
// const connectToDatabase = async () => {
//     try {
//         // console.log(process.env.DB_DATABASE);
//         const connection = await mysql.createConnection(config);
//         console.log('Connected to MySQL');
//         return connection;

//     } catch (error) {
//         console.error('Database connection failed:', error.message);
//         throw error;

//     }
// };

// const query = async (sql, params) => {
//     try {
//         const connection = await connectToDatabase(); // Kết nối đến database
//         const [results] = await connection.query(sql, params); // Thực thi câu truy vấn
//         await connection.end(); // Đóng kết nối
//         return results;
//     } catch (error) {
//         console.error('Error executing query:', error.message);
//         throw error;
//     }
// };

// // Xuất các module để sử dụng trong file khác
// module.exports = {
//     connectToDatabase,
//     query
// };

const { Pool } = require('pg'); // Thư viện PostgreSQL


// Cấu hình kết nối
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: 5432, // Cổng mặc định của PostgreSQL là 5432
    max: 10, // Số kết nối tối đa trong pool
    idleTimeoutMillis: 30000, // Thời gian chờ tối đa trước khi đóng kết nối
    connectionTimeoutMillis: 2000,
    ssl: {
        rejectUnauthorized: false, // Tùy chọn này cho phép kết nối ngay cả khi không kiểm tra chứng chỉ
    }, // Thời gian chờ kết nối
});

const query = async (sql, params) => {
    try {
        const client = await pool.connect(); // Lấy một kết nối từ pool
        const result = await client.query(sql, params); // Thực thi câu truy vấn
        client.release(); // Trả kết nối lại pool
        return result // Trả về kết quả truy vấn
    } catch (error) {
        console.error('Error executing query:', error.message);
        throw error;
    }
};

// Xuất các module để sử dụng trong file khác
module.exports = {
    pool: pool,
    query,
};
