const express = require('express');
const router = express.Router();
const apiController = require('../app/controllers/ApiController');

router.get('/sensorsData/:id/:unit/latest', apiController.getLatestSensorData);
router.get('/sensorsData/:id/:unit/latestTen', apiController.getLatestTenSensorData);
router.get('/devices/:id', apiController.getDevice);
router.patch('/devices/:id', apiController.updateDevice);
module.exports = router;