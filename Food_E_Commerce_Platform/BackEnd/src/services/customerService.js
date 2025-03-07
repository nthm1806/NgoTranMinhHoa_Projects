const Customers = require('../models/CustomerModel');

const CustomerServices = {
    getAllCustomers: async () => {
        return await Customers.getAllCustomers();
    },

    getCustomerById: async (CustomerID) => {
        return await Customers.getCustomerById(CustomerID);
    },

    updateCustomerById: async (CustomerID, customerData) => {
        return await Customers.updateCustomerById(CustomerID, customerData);
    }
};

module.exports = CustomerServices;
