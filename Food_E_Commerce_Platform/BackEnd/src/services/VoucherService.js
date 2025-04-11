const VoucherModel = require('../models/VoucherModel');

const Voucher = {

    getAllVouchers: async () => {
        return await VoucherModel.getAllVouchers();
    },

    getVoucherAllByCusID: async(cusID,totalPrice)=>{
        const result = await VoucherModel.getVoucherAllBycusID(cusID,totalPrice);
        return result
    },
    removeVoucherDetail:async(cusID,voucher)=>{
        await Promise.all(voucher.map(async(item)=>{
            if(item.Discount !== 0){
                await VoucherModel.removeVoucherDetail(cusID,item.voucher.VoucherID);
            }
        }))
    },
    getVoucherByShopID: async(shop,cusID)=>{
        const result =  Promise.all(shop.map(async(item)=>{
            return await VoucherModel.getVoucherByShopID(item,cusID);
            
        }))
        return result;
    },
    getVoucherByID: async(voucherID)=>{
        const result = VoucherModel.getVoucherByID(voucherID);
        return result;
    },
    getVoucherByCusID: async(cusID)=>{
        const result = await VoucherModel.getVoucherByCusID(cusID);
        return result;
    }, 

    getVoucherShopByShopID: async(shopID)=>{
        const result = await VoucherModel.getVoucherShopByShopID(shopID);
        return result;
    }
}

module.exports = Voucher;