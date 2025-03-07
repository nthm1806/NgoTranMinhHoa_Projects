const ShipperModels = require('../models/ShipperModels');

const Shipper = {
    getShipperByID: async(shipperID)=>{
        const result = await ShipperModels.getShipperByID(shipperID);
        return result;
    },
}

module.exports = Shipper