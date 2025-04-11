const PolicyModel = require("../models/PolicyModel");

const PolicyService = {
    getCategoryPolicy: async (body) => {
        return await PolicyModel.getCategoryPolicy(body);
    },

    searchPolicy: async (body) => {
        return await PolicyModel.searchPolicy(body);
    }
};

module.exports = PolicyService;