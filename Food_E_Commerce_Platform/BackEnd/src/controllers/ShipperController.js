const ShipperService = require('../services/ShipperServices');

const Shipper = {
    getShipperByID: async(req,res)=>{
        try {
            const shipperID = req.body.shipperID;
            const result = await ShipperService.getShipperByID(shipperID);
            res.status(200).json(result);
        } catch (error) {
            console.log(error)
        }
    },
}

module.exports = Shipper;