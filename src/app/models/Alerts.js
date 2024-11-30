const { query } = require('../../config/db');
const Alerts = {
    async getAlerts(conditions) {
        const { page, limit, idDevice, time, sort } = conditions;
        //Select , alerts.message as message,  as created_at,    order by created_at ${} offset ${limit * (page-1)} limit ${limit}`;
        let sqlStart = `SELECT devices.name as device, alerts.isSafe as isSafe,alerts.created_at, alerts.message as message from alerts inner join devices on alerts.id_device = devices.id`;
        const sqlEnd = `ORDER BY alerts.created_at ${sort == 1 ? 'asc' : 'desc'} LIMIT ${limit} OFFSET ${(page - 1) * limit}`;
        if (time) {
            if (idDevice) {
                sqlStart += ` WHERE date(alerts.created_at) ='${time}' AND alerts.id_device = ${idDevice}`;
            } else {
                sqlStart += ` WHERE date(alerts.created_at) ='${time}'`;
            }
        } else {
            if (idDevice) {
                sqlStart += ` WHERE alerts.id_device = ${idDevice}`;
            }
        }

        try {
            const result = await query(sqlStart);
            const totalPage = Math.ceil(result.rows.length / limit);
            const result2 = await query(sqlStart + ' ' + sqlEnd);
            return { result: result2.rows, totalPage, currentPage: page };
        } catch (error) {
            console.error('Error: ', error);
            return null;
        }
    }
}
module.exports = Alerts;