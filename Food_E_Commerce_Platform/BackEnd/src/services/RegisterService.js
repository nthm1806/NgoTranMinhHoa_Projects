const Register = require("../models/RegisterModel");

const RegisterService = {
    addCustomer: async (body) => {
        return await Register.addCustomer(body);
    },
};

module.exports = RegisterService;