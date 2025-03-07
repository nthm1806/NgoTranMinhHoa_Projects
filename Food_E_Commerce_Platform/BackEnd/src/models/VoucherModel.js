const pool = require('../config/Database');

const Voucher =  {
    getVoucherAllBycusID:async(cusID,totalPrice) =>{
        const result = await pool.query('select * from Voucher where VoucherID in (select VoucherID from VoucherDetail where CustomerID = ?) and ShopID is null and validate <= ?', [cusID,totalPrice]);
        return result[0];
    },
    removeVoucherDetail: async(cusID,voucher)=>{
        const result = await pool.query('delete from VoucherDetail where CustomerID = ? and VoucherID = ?',[cusID,voucher]);
        return result;
    },
    getVoucherByShopID: async(shop,cusID)=>{
        const result = await pool.query('select * from Voucher where ShopID = ? and Validate <= ? and VoucherID in (select VoucherID from VoucherDetail where CustomerID = ?)',[shop.shopID,shop.total,cusID]);
        return result[0];
    },
    getVoucherByID: async(voucherID)=>{
        const result = await pool.query('select * from Voucher where VoucherID= ?',[voucherID]);
        return result[0];
    },
    getVoucherByCusID: async(cusID)=>{
        const result = await pool.query('select * from Voucher where VoucherID in (select VoucherID from VoucherDetail where CustomerID =?)',[cusID]);
        return result[0];
    },

    getVoucherShopByShopID: async(shopID)=>{
        const result = await pool.query('select * from Voucher where ShopID = ?',[shopID]);
        return result[0];
    }
}

module.exports = Voucher