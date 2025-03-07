const FAQModel = require("../models/FAQModel");

const FAQService = {
    getPopularFAQs: async () => {
        return await FAQModel.getPopularFAQs();
    },

    incrementViewCount: async (id) => {
        return await FAQModel.incrementViewCount(id);
    }
};

module.exports = FAQService;
