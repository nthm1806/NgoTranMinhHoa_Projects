const pool = require("../config/Database");

const ProductFavoriteModel = {
    postAddProductIDTym: async (customerID, categoryLove, productIDTym) => {
        try {
            // ✅ Kiểm tra xem dữ liệu đã tồn tại chưa
            const [existingRows] = await pool.query(`
                SELECT * FROM ProductFavorite
                WHERE CustomerID = ? AND CategoryFavorite = ? AND ProductID = ?
            `, [customerID, categoryLove, productIDTym]);

            if (existingRows.length > 0) {
                return { message: "Sản phẩm đã có trong danh sách yêu thích." };
            }

            // ✅ Nếu chưa có thì thêm mới
            const [result] = await pool.query(`
                INSERT INTO ProductFavorite (CustomerID, CategoryFavorite, ProductID, AddedDate)
                VALUES (?, ?, ?, NOW())
            `, [customerID, categoryLove, productIDTym]);


            return { message: "Thêm sản phẩm yêu thích thành công!", insertedId: result.insertId };

        } catch (error) {
            console.error("Lỗi truy vấn MySQL:", error);
            return { error: "Lỗi server, vui lòng thử lại sau." };
        }
    }, 

    deleteProductIDTym: async (customerID, deleteCategoryLove, deleteProductIDTym) => {
        try {
            // ✅ Kiểm tra xem dữ liệu có tồn tại không
            const [existingRows] = await pool.query(`
                SELECT * FROM ProductFavorite
                WHERE CustomerID = ? AND CategoryFavorite = ? AND ProductID = ?
            `, [customerID, deleteCategoryLove, deleteProductIDTym]);
    
            if (existingRows.length === 0) {
                return { message: "Sản phẩm không tồn tại trong danh sách yêu thích." };
            }
    
            // ✅ Nếu tồn tại, thực hiện DELETE
            const [deleteResult] = await pool.query(`
                DELETE FROM ProductFavorite 
                WHERE CustomerID = ? AND CategoryFavorite = ? AND ProductID = ?
            `, [customerID, deleteCategoryLove, deleteProductIDTym]);
    
            return { message: "Xóa sản phẩm yêu thích thành công!", affectedRows: deleteResult.affectedRows };
    
        } catch (error) {
            console.error("Lỗi truy vấn MySQL:", error);
            return { error: "Lỗi server, vui lòng thử lại sau." };
        }
    },

    getAllProductFavorite: async (customerID) => {
        try {
            // ✅ Lấy tất cả các sản phẩm yêu thích của khách hàng theo CustomerID
            const [rows] = await pool.query(`
                SELECT * 
                FROM ProductFavorite
                WHERE CustomerID = ?
            `, [customerID]);
    
            if (rows.length > 0) {
                return { message: "Lấy thông tin sản phẩm yêu thích thành công!", data: rows };
            } else {
                return { message: "Không tìm thấy sản phẩm yêu thích cho khách hàng này." };
            }
        } catch (error) {
            console.error("Lỗi truy vấn MySQL:", error);
            return { error: "Lỗi server, vui lòng thử lại sau." };
        }
    },    
    
};

module.exports = ProductFavoriteModel;
