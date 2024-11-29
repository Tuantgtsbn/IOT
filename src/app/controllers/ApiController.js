const SensorData = require('../models/SensorData');
const Actions = require('../models/Actions.js');
const Devices = require('../models/Devices.js');
const Alerts = require('../models/Alerts.js');
const ApiController = {

    // GET /sensorsData/:id/:unit/latest

    async getLatestSensorData(req, res) {
        const { id } = req.params;
        try {

            const result = await SensorData.getLatestValue(id);
            if (result.length === 0) {
                return res.status(404).json({ message: 'Data not found' });
            }
            return res.json(result);
        } catch (error) {
            console.error('Error: ', error);
            res.status(500).json({ message: 'Internal server error' });
        }

    },
    async getLatestTenSensorData(req, res) {
        const { id } = req.params;
        try {
            const result = await SensorData.getLatestTenValue(id);
            if (result.length === 0) {
                return res.status(404).json({ message: 'Data not found' });
            }
            return res.json(result);
        } catch (error) {
            console.error('Error: ', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    // [GET] /devices/:id
    async getDevice(req, res) {
        const { id } = req.params;
        try {
            const result = await SensorData.getDevice(id);
            if (result.length === 0) {
                return res.status(404).json({ message: 'Data not found' });
            }
            return res.json(result);
        } catch (error) {
            console.error('Error: ', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    async updateDevice(req, res) {
        const { id } = req.params;
        const { status } = req.body;

        try {
            const result = await SensorData.updateDevice(id, status);
            if (!result) {
                return res.status(404).json({ message: 'Action faild' });
            }
            return res.json(result);
        } catch (error) {
            console.error('Error: ', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    async getSensorsData(req, res) {
        const { page, idDevice, time, limit } = req.query;
        const conditions = {};
        conditions.page = page ? parseInt(page) : 1;
        if (idDevice) {
            conditions.idDevice = parseInt(idDevice);
        }
        conditions.limit = limit ? parseInt(limit) : 20;
        if (time) {
            conditions.time = time;
        }
        try {
            const result = await SensorData.getAll(conditions);
            if (!result || result.result.length === 0) {
                return res.status(404).json({ message: 'Data not found' });
            }
            return res.json(result);
        } catch {
            console.error('Error: ', error);
            res.status(500).json({ message: 'Internal server error' });
        }



    },
    async getActions(req, res) {
        const { page, idDevice, time, limit } = req.query;
        const conditions = {};
        conditions.page = page ? parseInt(page) : 1;
        if (idDevice) {
            conditions.idDevice = parseInt(idDevice);
        }
        conditions.limit = limit ? parseInt(limit) : 20;
        if (time) {
            conditions.time = time;
        }
        try {
            const result = await Actions.getActions(conditions);


            if (!result || result.result.length === 0) {
                return res.status(404).json({ message: 'Data not found' });
            }
            return res.json(result);
        } catch (error) {
            console.error('Error: ', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    async getDevices(req, res) {
        try {
            const result = await Devices.getDevices();
            if (!result || result.length === 0) {
                return res.status(404).json({ message: 'Data not found' });
            }
            return res.json(result);
        } catch (error) {
            console.error('Error: ', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    async getAlerts(req, res) {
        const { page, limit, idDevice, time, sort } = req.query;
        const conditions = {};
        conditions.page = page ? parseInt(page) : 1;
        conditions.sort = sort ? parseInt(sort) : 1;
        conditions.limit = limit ? parseInt(limit) : 20;
        if (idDevice) {
            conditions.idDevice = parseInt(idDevice);
        }
        if (time) {
            conditions.time = time;
        }
        try {
            const result = await Alerts.getAlerts(conditions);
            if (!result || result.result.length === 0) {
                return res.status(404).json({ message: 'Data not found' });
            }
            return res.json(result);
        } catch (error) {
            console.error('Error: ', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    async getListDeviceSubUnSub(req, res) {
        try {
            const result = await Devices.getListDeviceSubUnSub(req.params.idUser);
            if (!result || result.length == 0) {
                return res.status(404).json({ message: 'Data not found' });
            } else {
                return res.json(result);
            }
        } catch (error) {
            console.error('Error: ', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    async updateDeviceSubUnsub(req, res) {
        const idUser = req.params.idUser;
        const { idDevice, action } = req.body;
        try {
            const result = await Devices.updateDeviceSubUnsub(idUser, idDevice, action);
            if (!result) {
                return res.status(404).json({ message: 'Action faild' });
            } else {
                return res.status(200).json({ message: 'Action success' });
            }
        } catch (error) {
            console.error('Error: ', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};




module.exports = ApiController;