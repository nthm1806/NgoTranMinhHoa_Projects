const VoucherService = require('../services/VoucherService');

const Voucher = {
    getVoucherAllByCusID: async(req,res)=>{
        try {
            const cusID = req.body.cusID;
        const totalPrice = req.body.totalPrice;
        const result = await VoucherService.getVoucherAllByCusID(cusID,totalPrice);
        res.status(200).json(result)
        } catch (error) {
            console.log(error)
        }
    },
    getVoucherByShopID: async(req,res)=>{
        try {
            const shop = req.body.shop;
            const cusID = req.body.cusID;
            const result = await VoucherService.getVoucherByShopID(shop,cusID);
            res.status(200).json(result)
        } catch (error) {
            console.log(error)
        }
    },
    getVoucherByCusID: async (req,res)=>{
        try {
            const cusID = req.body.cusID;
            const result = await VoucherService.getVoucherByCusID(cusID);
            res.status(200).json(result);
        } catch (error) {
           console.log(error)
        }
    },

    getVoucherShopByShopID:  async (req,res)=>{
        try {
            const shopID = req.query.shopID;
            const result = await VoucherService.getVoucherShopByShopID(shopID);
            res.status(200).json(result);
        } catch (error) {
           console.log(error)
        }
    }

    
}

module.exports = Voucher;