const AddressModel = require('../models/AddressModel');
const Address = require('../models/AddressModel');

const AddressService = {
    getAddressByCustomerId: async (customerID) => {
        return await Address.getAddressByCustomerId(customerID);
    },

    addAddress: async (customerID, houseAddress, area) => {
        const result = await Address.addAddress(customerID, houseAddress, area);
    
        if (!result || !result.addressID) {
            throw new Error("Thêm địa chỉ thất bại, không có ID trả về");
        }
    
        return result;
    },
    updateAddressById: async (addressID, addressData) => {
        return await Address.updateAddressById(addressID, addressData);
    },

    removeAddress: async (addressID, customerID) => {
        return await Address.removeAddress(addressID, customerID);
    },
    setDefault:async(addressID,customerID)=>{
        await AddressModel.setDefault(addressID,customerID);
        const result = await AddressModel.getAddressByCustomerId(customerID);
        return result
    }
};

module.exports = AddressService;
