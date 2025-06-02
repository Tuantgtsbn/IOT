const { query } = require("../../config/db");
const Devices = {
  async getDevices() {
    const sql = `Select devices.id as id, devices.name as name, devices.status as status, devices.position as position, devices.created_at at time zone 'utc' at time zone 'asia/ho_chi_minh' as created_at, devices.last_updated as last_updated, type.type as type, devices.src as src from devices inner join type on devices.id_type = type.id order by name`;
    try {
      const result = await query(sql);
      return result.rows;
    } catch (error) {
      console.error("Error: ", error);
      return null;
    }
  },
  async getListDeviceSubUnSub(idUser) {
    const sql = `select d.id as id, d.name as name, d.position as position, d.unit as unit, d.status as status, d.isautomatic as isautomatic, t.id_user as idUser from devices as d left join  (select * from subcrible where subcrible.id_user= $1 ) as t on d.id = t.id_device `;
    try {
      const result = await query(sql, [idUser]);
      return result.rows;
    } catch (error) {
      console.error("Error: ", error);
      return null;
    }
  },
  async updateDeviceSubUnsub(idUser, idDevice, action) {
    if (action == "sub") {
      sql = `insert into subcrible(id_user, id_device) values($1,$2)`;
      try {
        const result = await query(sql, [idUser, idDevice]);
        return result.rows;
      } catch (error) {
        console.error("Error: ", error);
        return null;
      }
    } else if (action == "unsub") {
      sql = `delete from subcrible where id_user=$1 and id_device=$2`;
      try {
        const result = await query(sql, [idUser, idDevice]);
        return result;
      } catch (error) {
        console.error("Error: ", error);
        return null;
      }
    }
  },
};
module.exports = Devices;
