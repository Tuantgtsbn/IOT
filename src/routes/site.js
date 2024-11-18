const express = require('express');
const { isLoggedIn } = require('../app/middlewares/isLoggedIn');
const router = express.Router();
const siteController = require('../app/controllers/SiteController');
router.get('/', isLoggedIn, siteController.home);
router.get('/data', isLoggedIn, siteController.data);
router.get('/action', isLoggedIn, siteController.action);
router.get('/information', isLoggedIn, siteController.information);
router.get('/alert', isLoggedIn, siteController.alert);
router.get('/login', siteController.login);
router.post('/login', siteController.postLogin);
router.get('/logout', siteController.logout);
module.exports = router;