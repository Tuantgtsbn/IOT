// const session = require('express-session');
// const MySQLStore = require('express-mysql-session')(session);
// const db = require('./db');
// const crypto = require('crypto');
// const sessionStore = new MySQLStore({
//     host: 'localhost',
//     port: 3306,
//     user: 'root',
//     password: '123456',
//     database: 'smarthome'
// });
// const sessionConfig = session({
//     key: 'session_cookie_name', // Tên cookie chứa session ID
//     secret: crypto.randomBytes(64).toString('hex'),   // Khóa bí mật để mã hóa session ID
//     store: sessionStore,         // Lưu session vào MySQL
//     resave: false,               // Không lưu lại session nếu không thay đổi
//     saveUninitialized: false,    // Không lưu session nếu chưa được khởi tạo
//     cookie: {
//         maxAge: 1000 * 60 * 1000,    // Thời gian hết hạn cookie (15 phút)
//         httpOnly: true,            // Ngăn trình duyệt truy cập cookie từ JavaScript
//         secure: false              // Đặt thành true nếu sử dụng HTTPS
//     }
// });
// module.exports = { sessionConfig };

const session = require('express-session');
const PgSession = require('connect-pg-simple')(session);
const { Pool } = require('pg');
const crypto = require('crypto');

// Cấu hình kết nối PostgreSQL
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: 5432, // Cổng mặc định của PostgreSQL là 5432
    max: 10, // Số kết nối tối đa trong pool
    idleTimeoutMillis: 30000, // Thời gian chờ tối đa trước khi đóng kết nối
    connectionTimeoutMillis: 2000, // Thời gian chờ kết nối
    ssl: {
        rejectUnauthorized: false, // Tùy chọn này cho phép kết nối ngay cả khi không kiểm tra chứng chỉ
    },
});

const sessionStore = new PgSession({
    pool: pool, // Sử dụng pool của PostgreSQL
    tableName: 'session', // Tên bảng lưu trữ session (có thể thay đổi theo nhu cầu)
});

const sessionConfig = session({
    key: 'session_cookie_name', // Tên cookie chứa session ID
    secret: crypto.randomBytes(64).toString('hex'),   // Khóa bí mật để mã hóa session ID
    store: sessionStore,         // Lưu session vào PostgreSQL
    resave: false,               // Không lưu lại session nếu không thay đổi
    saveUninitialized: false,    // Không lưu session nếu chưa được khởi tạo
    cookie: {
        maxAge: 1000 * 60 * 1000,    // Thời gian hết hạn cookie (15 phút)
        httpOnly: true,            // Ngăn trình duyệt truy cập cookie từ JavaScript
        secure: false              // Đặt thành true nếu sử dụng HTTPS
    }
});

module.exports = { sessionConfig };
