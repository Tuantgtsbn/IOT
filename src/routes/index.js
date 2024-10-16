const apiRouter = require('./api');
const siteRouter = require('./site');
function routes(app) {
    app.use('/api', apiRouter);
    app.use('/', siteRouter);
}

module.exports = { routes };