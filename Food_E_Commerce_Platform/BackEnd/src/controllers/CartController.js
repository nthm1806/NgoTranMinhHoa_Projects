const CartService = require('../services/CartService');

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
            const { cartID, quantity } = req.body;
            if (!cartID || quantity === undefined) {
                return res.status(400).json({ error: "Thiếu dữ liệu" });
            }
            const result = await CartService.updateCartDetailQuantity(cartID, quantity);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    deleteItem: async (req, res) => {
        try {
            const { cartID } = req.body;
            if (!cartID) {
                return res.status(400).json({ error: "Thiếu dữ liệu" });
            }
            await CartService.removeCartDetail([{ CartID: cartID }]);
            res.status(200).json({ message: "Item deleted successfully" });
        } catch (error) {
            res.status(500).json(error);
        }
    }
}
module.exports = Cart;