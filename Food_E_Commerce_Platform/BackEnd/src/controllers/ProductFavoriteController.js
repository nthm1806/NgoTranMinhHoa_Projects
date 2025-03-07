const ProductFavoriteService = require('../services/ProductFavoriteService');

const ProductFavoriteController = {
    postAddProductIDTym: async (req, res) => {
    try {
      const customerID = req.body.customerID;
      const categoryLove = req.body.categoryLove;
      const productIDTym = req.body.productIDTym;
      // Kiểm tra nếu không có shopID
      if (!customerID) {
        return res.status(400).json({ error: "Thiếu CustomerID trong request" });
      }

      if (!productIDTym) {
        return res.status(400).json({ error: "Thiếu productIDTym trong request" });
      }

      // Gọi service để lấy dữ liệu
      const result = await ProductFavoriteService.postAddProductIDTym(customerID, categoryLove, productIDTym);

      // Trả kết quả về client
      res.status(200).json(result);
    } catch (err) {
      console.error("❌ Lỗi khi lấy thông tin shop:", err);
      res.status(500).json({ error: "Lỗi server khi lấy thông tin shop" });
    }
  },

  deleteProductIDTym: async (req, res) => {
    try {
      const customerID = req.query.customerID;
      const deleteCategoryLove = req.query.deleteCategoryLove;
      const deleteProductIDTym = req.query.deleteProductIDTym;
      // Kiểm tra nếu không có shopID
      if (!customerID) {
        return res.status(400).json({ error: "Thiếu CustomerID trong request" });
      }

      if (!deleteProductIDTym) {
        return res.status(400).json({ error: "Thiếu deleteProductIDTym trong request" });
      }

      // Gọi service để lấy dữ liệu
      const result = await ProductFavoriteService.deleteProductIDTym(customerID, deleteCategoryLove, deleteProductIDTym);

      // Trả kết quả về client
      res.status(200).json(result);
    } catch (err) {
      console.error("❌ Lỗi khi lấy thông tin shop:", err);
      res.status(500).json({ error: "Lỗi server khi lấy thông tin shop" });
    }
  },

  getAllProductFavorite: async (req, res) => {
    try {
      const customerID = req.query.customerID;
      // Kiểm tra nếu không có shopID
      if (!customerID) {
        return res.status(400).json({ error: "Thiếu CustomerID trong request" });
      }
      // Gọi service để lấy dữ liệu
      const result = await ProductFavoriteService.getAllProductFavorite(customerID);

      // Trả kết quả về client
      res.status(200).json(result);
    } catch (err) {
      console.error("❌ Lỗi khi lấy thông tin shop:", err);
      res.status(500).json({ error: "Lỗi server khi lấy thông tin shop" });
    }
  },
};

module.exports = ProductFavoriteController;
