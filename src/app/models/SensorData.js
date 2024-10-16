const { query } = require('../../config/db');
const { getDevice, updateDevice } = require('../controllers/ApiController');
const SensorData = {
    getLatestValue: async (id, unit) => {
        const sql = 'SELECT sensors_data.value,devices.status,sensors_data.created_at FROM sensors_data join devices on sensors_data.id_device=devices.id where sensors_data.unit=? and devices.id=? order by sensors_data.created_at desc limit 1';
        try {
            const result = await query(sql, [unit, id]);
            return result[0];
        } catch (error) {
            console.error('Error: ', error);
            return null;
        }
    },
    getLatestTenValue: async (id, unit) => {
        const sql = 'SELECT sensors_data.value, convert_tz(sensors_data.created_at,"+00:00","+07:00") as created_at  FROM sensors_data join devices on sensors_data.id_device=devices.id where sensors_data.unit=? and devices.id=? order by sensors_data.created_at desc limit 10';
        try {
            const result = await query(sql, [unit, id]);
            return result;
        } catch (error) {
            console.error('Error: ', error);
            return null;
        }
    },
    getDevice: async (id) => {
        const sql = 'SELECT name, position, status,id FROM devices WHERE id=?';
        try {
            const result = await query(sql, [id]);
            return result[0];
        } catch (error) {
            console.error('Error: ', error);
            return null;
        }
    },
    updateDevice: async (id, status) => {
        const sql = 'UPDATE devices SET status=? WHERE id=?';
        try {
            const result = await query(sql, [!!status, id]);

            if (result.changedRows === 0) {
                return null;
            }
            return { status: !!status };

        } catch (error) {
            console.error('Error: ', error);
            return error;
        }
    }
};
module.exports = SensorData;