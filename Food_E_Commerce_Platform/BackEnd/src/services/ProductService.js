const Products = require('../models/ProductModel');
const CustomerBehaviorModel = require('../models/CustomerBehaviorModel');
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
    },

    getProductBehaviorShop: async (customerID, shopID) => {
        let CategoryByShopCustomerBehavior = await CustomerBehaviorModel.getCategoryByShop(customerID, shopID);
        if (CategoryByShopCustomerBehavior.length === 0) {
            const result = await Products.getProductCheapestBehaviorShop(shopID);
            return result;
        }
            const result = await Promise.all(
            CategoryByShopCustomerBehavior.map(async (item) => {
                const productBehavior = await Products.getProductCustomerBehaviorShopReal(shopID, item.category);
    
                return productBehavior[0].map((product) => ({
                    ProductID: product.ProductID,
                    ProductImg: product.ProductImg,
                    ProductName: product.ProductName,
                    Category: product.Category,
                    SoldQuantity: product.StockQuantity,
                    Weight: product.Weight,
                    ShopID: product.ShopID,
                    Price: product.Price,
                }));
            })
        );    
        return result.flat();
    },

    getFollowedShopsProducts: async (customerID, shopID) => {
        let CustomerFollowedShops = await CustomerBehaviorModel.getCustomerFollowedShops(customerID);

            const result = await Promise.all(
                CustomerFollowedShops.map(async (item) => {
                const productBehavior = await Products.getProductCustomerBehaviorShop(item.shop_ID);
    
                return productBehavior[0].map((product) => ({
                    ProductID: product.ProductID,
                    ProductImg: product.ProductImg,
                    ProductName: product.ProductName,
                    Category: product.Category,
                    SoldQuantity: product.StockQuantity,
                    Weight: product.Weight,
                    ShopID: product.ShopID,
                    Price: product.Price,
                }));
            })
        );    
        return result.flat();
    },

    getBehaviorCustomerProducts: async (customerID) => {
        let BehaviorCustomerProducts = await CustomerBehaviorModel.getBehaviorCustomerProducts(customerID);

            const result = await Promise.all(
                BehaviorCustomerProducts.map(async (item) => {
                const productCustomerBehavior = await Products.getBehaviorCustomerProducts(item.category);
    
                return productCustomerBehavior[0].map((product) => ({
                    ProductID: product.ProductID,
                    ProductImg: product.ProductImg,
                    ProductName: product.ProductName,
                    Category: product.Category,
                    SoldQuantity: product.StockQuantity,
                    Weight: product.Weight,
                    ShopID: product.ShopID,
                    Price: product.Price,
                }));
            })
        );    
        return result.flat();
    },

}
module.exports = productServices;