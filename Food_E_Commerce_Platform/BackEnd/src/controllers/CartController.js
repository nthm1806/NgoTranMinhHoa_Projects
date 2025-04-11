const CartService = require('../services/CartService');
const ProductModel = require('../models/ProductModel');

const Cart = {
    getAllCart: async (req, res) => {
        try {
            const result = await CartService.getAllCarts();
            res.status(200).json(result[0]);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    getCartByCusID: async (req, res) => {
        try {
            const cusID = req.body.cusID;
            const result = await CartService.getCartByCusID(cusID);
            res.status(200).json(result);
        } catch (error) {
            console.log(error)
            res.status(500).json(error);
        }
    },
    updateQuantity: async (req, res) => {
        try {
            const { cartID, newQuantity } = req.body;
            if (!cartID || newQuantity === undefined || isNaN(newQuantity)) {
                return res.status(400).json({ error: "Thiếu dữ liệu" });
            }

            const cartItem = await CartService.getCartItemById(cartID);
            if (!cartItem) {
                return res.status(404).json({ message: "Sản phẩm không tồn tại trong giỏ hàng" });
            }

            const product = await ProductModel.getProductByProID(cartItem.ProductID);
            if (!product || product.length === 0) {
                return res.status(404).json({ message: "Sản phẩm không tồn tại" });
            }

            const stockQuantity = product[0].StockQuantity;
            if (newQuantity > stockQuantity) {
                return res.status(400).json({ message: "Số lượng sản phẩm vượt quá số lượng trong kho" });
            }

            if (newQuantity <= 0) {
                await CartService.removeCartDetail(cartID);
                return res.status(200).json({ message: "Xóa sản phẩm thành công" });
            }

            await CartService.updateCartDetailQuantity(cartID, newQuantity);
            res.status(200).json({ message: "Cập nhật giỏ hàng thành công" });

        } catch (error) {
            console.error("Lỗi khi cập nhật giỏ hàng:", error);
            res.status(500).json(error);
        }
    },
    deleteItem: async (req, res) => {
        try {
            const cartID = req.body?.cartID || req.query?.cartID;
            if (!cartID) {
                return res.status(400).json({ error: "Thiếu dữ liệu" });
            }

            const cartItem = await CartService.getCartItemById(cartID);
            if (!cartItem) {
                return res.status(404).json({ message: "Sản phẩm không tồn tại trong giỏ hàng" });
            }

            await CartService.removeCartDetail(cartID);
            res.status(200).json({ message: "Item deleted successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    },
    updateCartDetail: async (req, res) => {
        try {
            await CartService.updateCartDetail(req.body);
            res.status(200).json({ message: "Thêm sản phẩm thành công", status: 200 });
        } catch (error) {
            res.status(200).json({ message: "Thêm sản phẩm thất bại", status: 204 });
            console.log(error);
        }
    }
}
module.exports = Cart;