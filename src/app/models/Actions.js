const { query } = require('../../config/db');
const Actions = {
    getActions: async function (conditions) {

        const { page, time, idDevice, limit } = conditions;
        let sqlStart = `SELECT users.username as user, devices.name as device, action.action_type as action_type, action.status as status, convert_tz(action.created_at,"+00:00","+07:00") as created_at
            FROM action inner join devices on action.id_device = devices.id inner join users on action.id_user = users.id`;
        const sqlEnd = `ORDER BY action.created_at DESC LIMIT ${limit} OFFSET ${(page - 1) * limit}`;
        if (time) {
            if (idDevice) {
                sqlStart += ` WHERE date(action.created_at) ='${time}' AND action.id_device = ${idDevice}`;
            } else {
                sqlStart += ` WHERE date(action.created_at) ='${time}'`;
            }
        } else {
            if (idDevice) {
                sqlStart += ` WHERE action.id_device = ${idDevice}`;
            }
        }
        try {
            const result = await query(sqlStart);
            const totalPage = Math.ceil(result.length / limit);
            const result2 = await query(sqlStart + ' ' + sqlEnd);
            return { result: result2, totalPage, currentPage: page };
        } catch (error) {
            console.log(error);
            return null;
        }

    },
};
module.exports = Actions;