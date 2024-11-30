const { query } = require('../../config/db');
const SiteController = {
    // [GET] /
    home(req, res) {
        res.render('home', { layout: 'main', 'title': 'Home', 'css': '/css/home.css', username: req.session.username, idUser: req.session.userId });
    },
    // [GET] /data
    data(req, res) {
        res.render('data', { layout: 'main', 'title': 'Data', 'css': '/css/data.css', username: req.session.username, idUser: req.session.userId });
    },
    action(req, res) {
        res.render('action', { layout: 'main', 'title': 'Action', 'css': '/css/data.css', username: req.session.username, idUser: req.session.userId });
    },
    information(req, res) {
        res.render('information', { layout: 'main', 'title': 'Information', 'css': '/css/information.css', username: req.session.username, idUser: req.session.userId });
    },
    login(req, res) {
        res.render('login', { layout: 'noheaderfooter', 'title': 'Login', 'css': '/css/login.css' });
    },
    async alert(req, res) {
        fetch('http://localhost:8080/api/devices')
            .then(response => response.json())
            .then(result => {
                res.render('alert', { layout: 'main', 'title': 'Alter', 'css': '/css/alert.css', devices: result, username: req.session.username, idUser: req.session.userId });

            })
    },
    manageDevices(req, res) {
        res.render('manageDevices', { layout: 'main', 'title': 'Manage Devices', 'css': '/css/manageDevices.css', username: req.session.username, idUser: req.session.userId });
    },
    // [POST] /login
    async postLogin(req, res) {
        const { email, password } = req.body;
        const sql = 'Select * from users where email = $1';
        try {
            const result = await query(sql, [email]);
            // console.log(result);
            if (result.rows.length === 0) {
                res.render('login', { layout: 'noheaderfooter', 'title': 'Login', 'css': '/css/login.css', errorEmail: 'Email is not exist', email, password });
            } else {
                for (const user of result.rows) {
                    if (user.password === password) {
                        req.session.userId = user.id;
                        req.session.username = user.username;
                        return res.redirect('/');
                    }
                }
                res.render('login', { layout: 'noheaderfooter', 'title': 'Login', 'css': '/css/login.css', errorPassword: 'Password is incorrect', password, email });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    // [GET] /logout
    logout(req, res) {
        req.session.destroy(err => {
            if (err) {
                return res.redirect('/');
            }
            res.clearCookie('session_cookie_name'); // Xóa cookie session
            res.redirect('/login');
        });
    },


};

module.exports = SiteController;