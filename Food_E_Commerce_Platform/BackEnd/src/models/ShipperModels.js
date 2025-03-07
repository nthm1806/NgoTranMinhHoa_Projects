const pool = require('../config/Database');

const Shipper = {
    getShipperByID: async(shipperID)=>{
    
        const result = await pool.query('select * from Shipper where ShipperID = ?',[shipperID])
        console.log(shipperID, result)
        return result[0]
    }
}

module.exports = Shipper