const Products = require('../models/ProductModel');
const productServices = {
    getAllProductsNew: async (option, type)=>{
        const result = await Products.getAllProductsNew(option, type);
        return result;
    },
    getProductByShopID: async(ShopID)=>{
        const result = await Products.getProductByShopID(ShopID);
        return result;
    },
    getAllProducts: async (option)=>{
        const result = await Products.getAllProducts(option);
        return result;
    },

    getAllCategory: async ()=>{
        const result = await Products.getAllCategory();
        return result;
    },
    searchProduct: async (categoryName, pageIndex,keyword)=>{
        const result = await Products.searchProduct(categoryName, pageIndex,keyword);

        return result;
    },
    getProductByID: async(proID)=>{
        const result = Products.getProductByID(proID);
        return result;
    },
    getFavoriteByCusID: async(cusID)=>{
        const result = await Products.getFavoriteByCusID(cusID);
        return result
    },
    setProductFavorite: async (CustomerID,ProductID)=>{
        const result = await Products.setProductFavorite(CustomerID,ProductID);

        return result;
    },
    getProductFavorite: async (CustomerID)=>{
        const result = await Products.getProductFavorite(CustomerID);

        return result;
    },
    getProductsFavorite: async (CustomerID, pageIndex, keyword)=>{
        const result = await Products.getProductsFavorite(CustomerID, pageIndex, keyword);

        return result;
    },

    deleteProductFavorite: async (CustomerID,ProductID)=>{
        const result = await Products.deleteProductFavorite(CustomerID,ProductID);
        return result;
    },
    getProductDetail: async (ProductID)=>{
        const result = await Products.getProductDetail(ProductID);
        return result;
    },

    getProductShopSuggest: async (ShopID)=>{
        const result = await Products.getProductShopSuggest(ShopID);
        return result;
    },

    getCategoryProductByShopID: async (ShopID)=>{
        const result = await Products.getCategoryProductByShopID(ShopID);
        return result;
    },
    checkUserCanComment: async (CustomerID, ProductID)=>{
        const result = await Products.checkUserCanComment(CustomerID, ProductID);
        return result;
    },

    getProductShop : async (type, option, shopID)=>{
        const result = await Products.getProductShop(type, option, shopID);
        return result;
    },

    getProductByShop : async (ShopID, keyword,type)=>{
        const result = await Products.getProductByShop(ShopID, keyword,type);
        return result;
    }

}
module.exports = productServices;