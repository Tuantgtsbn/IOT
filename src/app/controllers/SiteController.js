const SiteController = {
    // [GET] /
    home(req, res) {
        res.render('home', { layout: 'main', 'title': 'Home', 'css': '/css/home.css' });
    },
    // [GET] /data
    data(req, res) {
        res.render('data', { layout: 'main', 'title': 'Data', 'css': '/css/data.css' });
    }
};

module.exports = SiteController;