const ProductFavoriteModel = require('../models/ProductFavoriteModel');

const ProductFavoriteService = {
    
    postAddProductIDTym: async (customerID,categoryLove, productIDTym) => {
         
        const result = await ProductFavoriteModel.postAddProductIDTym(customerID, categoryLove, productIDTym);
        return result;
    },

    deleteProductIDTym: async (customerID, deleteCategoryLove, deleteProductIDTym) => {
         
        const result = await ProductFavoriteModel.deleteProductIDTym(customerID, deleteCategoryLove, deleteProductIDTym);
        return result;
    },

    getAllProductFavorite: async (customerID) => {
         
        const result = await ProductFavoriteModel.getAllProductFavorite(customerID);
        return result;
    },

};


module.exports = ProductFavoriteService;