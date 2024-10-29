const { query } = require('../../config/db');
const Devices = {
    async getDevices() {
        const sql = `Select devices.id as id, devices.name as name, devices.status as status, devices.position as position, devices.created_at as created_at, devices.last_updated as last_updated, type.type as type, devices.src as src from devices inner join type on devices.id_type = type.id order by name`;
        try {
            const result = await query(sql);
            return result;
        } catch (error) {
            console.error('Error: ', error);
            return null;
        }
    }
};
module.exports = Devices;