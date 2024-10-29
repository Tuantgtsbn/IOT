const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const db = require('./db');
const crypto = require('crypto');
const sessionStore = new MySQLStore({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '123456',
    database: 'smarthome'
});
const sessionConfig = session({
    key: 'session_cookie_name', // Tên cookie chứa session ID
    secret: crypto.randomBytes(64).toString('hex'),   // Khóa bí mật để mã hóa session ID
    store: sessionStore,         // Lưu session vào MySQL
    resave: false,               // Không lưu lại session nếu không thay đổi
    saveUninitialized: false,    // Không lưu session nếu chưa được khởi tạo
    cookie: {
        maxAge: 1000 * 60 * 60,    // Thời gian hết hạn cookie (15 phút)
        httpOnly: true,            // Ngăn trình duyệt truy cập cookie từ JavaScript
        secure: false              // Đặt thành true nếu sử dụng HTTPS
    }
});
module.exports = { sessionConfig };