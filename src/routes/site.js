const express = require('express');
const { isLoggedIn } = require('../app/middlewares/isLoggedIn');
const router = express.Router();
const siteController = require('../app/controllers/SiteController');
router.get('/', siteController.home);
router.get('/data', siteController.data);
router.get('/action', siteController.action);
router.get('/information', siteController.information);
router.get('/alert', siteController.alert);
router.get('/login', siteController.login);
router.post('/login', siteController.postLogin);
router.get('/logout', siteController.logout);
module.exports = router;