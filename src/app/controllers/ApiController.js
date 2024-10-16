const SensorData = require('../models/SensorData');
const ApiController = {

    // GET /sensorsData/:id/:unit/latest

    async getLatestSensorData(req, res) {
        const { id, unit } = req.params;
        try {

            const result = await SensorData.getLatestValue(id, unit);
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
        const { id, unit } = req.params;
        try {
            const result = await SensorData.getLatestTenValue(id, unit);
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
    }


}

module.exports = ApiController;