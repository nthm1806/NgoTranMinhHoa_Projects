const CartModel = require('../models/CartModel');
const ProductModel = require('../models/ProductModel');
const ShopModel = require('../models/ShopModel');

const Cart = {
    getAllCarts: async () => {
        return await CartModel.getAllCart();
    },
    getCartByCusID: async (cusID) => {
        const CartDetail = await CartModel.getCartDetailByCusID(cusID);
        const result = await Promise.all(
            CartDetail.map(async (item) => {
                const product = await ProductModel.getProductByProID(item.ProductID);
                const shopName = await ShopModel.getShopByID(product[0].ShopID);
                return {
                    cartID: item.CartDetailID,
                    productID: product[0].ProductID,
                    productImg: product[0].ProductImg,
                    productName: product[0].ProductName,
                    productCategory: product[0].Category,
                    productQuantity: product[0].StockQuantity, 
                    ShopID: product[0].ShopID,
                    ShopName: shopName,
                    productPrice: product[0].Price,
                    Quantity: item.Quantity,
                    feeShip: 32000,
                    totalAmount: item.Quantity * product[0].Price + 32000,
                };
            }))
            
        return result;
    },
    updateCartDetailQuantity: async (cartID, quantity) => {
        const cartItem = await CartModel.getCartItemById(cartID);
        if (!cartItem) {
            throw new Error('Cart item not found');
        }
        if (cartItem.Quantity + quantity <= 0) {
            await CartModel.removeCartDetail([{ CartID: cartID }]);
        } else {
            await CartModel.updateCartDetailQuantity(cartID, quantity);
        }
    },
    removeCartDetail: async (OrderInfor) => {
        await CartModel.removeCartDetail(OrderInfor);
    }
}

module.exports = Cart;