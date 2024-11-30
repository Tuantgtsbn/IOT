const { query } = require('../../config/db');
// const { getDevice, updateDevice } = require('../controllers/ApiController');
const SensorData = {
    getLatestValue: async (id) => {
        const sql = 'SELECT sensors_data.value,devices.status,sensors_data.created_at FROM sensors_data join devices on sensors_data.id_device=devices.id where devices.id=$1 order by sensors_data.created_at desc limit 1';
        try {
            const result = await query(sql, [id]);
            return result.rows[0];
        } catch (error) {
            console.error('Error: ', error);
            return null;
        }
    },
    getLatestTenValue: async (id, unit) => {
        const sql = 'SELECT sensors_data.value, devices.unit as unit, devices.name as name, sensors_data.created_at  FROM sensors_data join devices on sensors_data.id_device=devices.id where devices.id=$1 order by sensors_data.created_at desc limit 10';
        try {
            const result = await query(sql, [id]);
            console.log(result.rows);
            result.rows.reverse();
            return result.rows;
        } catch (error) {
            console.error('Error: ', error);
            return null;
        }
    },
    getDevice: async (id) => {
        const sql = 'SELECT name, position, status,id FROM devices WHERE id=$1';
        try {
            const result = await query(sql, [id]);
            return result.rows[0];
        } catch (error) {
            console.error('Error: ', error);
            return null;
        }
    },
    updateDevice: async (id, status) => {
        const sql = 'UPDATE devices SET status=$1 WHERE id=$2';
        try {
            const result = await query(sql, [!!status, id]);

            if (result.rowCount === 0) {
                return null;
            }
            return { status: !!status };

        } catch (error) {
            console.error('Error: ', error);
            return error;
        }
    },
    getAll: async (conditions) => {

        var totalPage;
        const { page, idDevice, time, limit } = conditions;
        const offset = (page - 1) * limit;
        let sqlEnd = `limit ${limit} offset ${offset}`;
        let sqlStart;
        //const sql = 'SELECT sensors_data.value, convert_tz(sensors_data.created_at,"+00:00","+07:00") as created_at, devices.name FROM sensors_data join devices on sensors_data.id_device=devices.id where devices.id=? and sensors_data.created_at>=? order by sensors_data.created_at desc limit ?,?';
        if (time) {
            if (idDevice) {
                sqlStart = `SELECT value,unit, created_at from sensors_data where id_device=${idDevice} and created_at::date = '${time}'::date`;
            } else {
                sqlStart = `SELECT value,unit, created_at from sensors_data where created_at::date = '${time}'::date`;
            }
        } else {
            if (idDevice) {
                sqlStart = `SELECT value,unit, created_at from sensors_data where id_device=${idDevice}`;
            } else {
                sqlStart = `SELECT value,unit, created_at from sensors_data`;
            }
        }

        try {
            const result = await query(sqlStart);
            totalPage = Math.ceil(result.rows.length / limit);
            const result2 = await query(sqlStart + ' ' + sqlEnd);
            return { result: result2.rows, totalPage, currentPage: page };

        } catch (error) {
            console.error('Error: ', error);
            return null;
        }

        // try {
        //     const result = await query(sqlStart + ' ' + sqlEnd);
        //     return { result, totalPage };
        // } catch (error) {
        //     console.error('Error: ', error);
        //     return null;
        // }


    }
};
module.exports = SensorData;