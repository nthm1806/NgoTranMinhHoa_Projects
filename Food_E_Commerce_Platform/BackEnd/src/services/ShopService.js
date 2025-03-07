const shopModel = require('../models/ShopModel');

const Shop = {
    
    getInforShop: async (req, res) => {
        const result = await shopModel.getInforShop(req, res);
        
        return result;
    },
    getAllShop: async () => {
        const result = await shopModel.getAllShop();
        
        return result;
    }
};


module.exports = Shop;