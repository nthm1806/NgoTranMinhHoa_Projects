const comboProductModel = require('../models/ComboProductModel');

const ComboProduct = {
    
    setComboProduct: async (combo) => {
        const result = await comboProductModel.setComboProduct(combo);
        
        return result;
    },

    getComboProduct: async (ShopID, keyword, pageIndex) => {
        const result = await comboProductModel.getComboProduct(ShopID, keyword, pageIndex);
        
        return result;
    },
   
};


module.exports = ComboProduct;