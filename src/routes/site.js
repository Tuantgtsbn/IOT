const express = require('express');
const router = express.Router();
const siteController = require('../app/controllers/SiteController');
router.get('/', siteController.home);
router.get('/data', siteController.data);
module.exports = router;