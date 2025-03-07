const VoucherDetailModel = require('../models/VoucherDetailModel');

const VoucherDetailService = {
    postSaveVoucherID: async(customerID,saveVoucherID)=>{
        const result = await VoucherDetailModel.postSaveVoucherID(customerID,saveVoucherID);
        return result
    },

    deleteVoucherID: async(customerID,deleteVoucherID)=>{
        const result = await VoucherDetailModel.deleteVoucherID(customerID,deleteVoucherID);
        return result
    },

    getListVoucherByCustomerID: async(customerID)=>{
        const result = await VoucherDetailModel.getListVoucherByCustomerID(customerID);
        return result
    },
}

module.exports = VoucherDetailService;

