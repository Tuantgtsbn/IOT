const express = require('express');
const router = express.Router();
const apiController = require('../app/controllers/ApiController');
router.get('/sensorsData/:id/latest', apiController.getLatestSensorData);
router.get('/sensorsData/:id/latestTen', apiController.getLatestTenSensorData);
router.get('/sensorsData', apiController.getSensorsData)
router.get('/devices/:id', apiController.getDevice);
router.patch('/devices/:id', apiController.updateDevice);
router.get('/devices', apiController.getDevices);
router.get('/actions', apiController.getActions);
router.get('/alerts', apiController.getAlerts);
module.exports = router;