const pool = require('../config/Database');

const CustomerShopFollowModel = {
    postAddCustomerShopFollow: async (customerID, shopID) => {
        // Kiểm tra xem đã có bản ghi nào với customerID và saveVoucherID chưa
        const [rows] = await pool.query('SELECT * FROM Customer_Shop_Follow WHERE CustomerID = ? AND ShopID = ?', [customerID, shopID]);
           // Nếu không có bản ghi nào, thêm mới bản ghi vào bảng VoucherDetail
        if (rows.length === 0) {
            const insertQuery = 'INSERT INTO Customer_Shop_Follow (CustomerID, ShopID, FollowedAt) VALUES (?, ?, NOW())';
            await pool.query(insertQuery, [customerID, shopID, ]);
            
            return { success: true, message: 'Follow saved successfully!' };
        } else {
            return { success: false, message: 'Follow already exists for this customer!' };
        }
    },

    deleteCustomerShopFollow: async (customerID, shopID) => {
        try {
            // ✅ Kiểm tra xem voucher có tồn tại trong VoucherDetail không
            const [existingRows] = await pool.query(`
                SELECT * FROM Customer_Shop_Follow 
                WHERE CustomerID = ? AND ShopID = ?
            `, [customerID, shopID]);
    
            if (existingRows.length === 0) {
                return { success: false, message: 'Follow not found for this customer!' };
            }
    
            // ✅ Nếu tồn tại, thực hiện xóa voucher
            const [deleteResult] = await pool.query(`
                DELETE FROM Customer_Shop_Follow 
                WHERE CustomerID = ? AND ShopID = ?
            `, [customerID, shopID]);
    
            return { success: true, message: 'Follow deleted successfully!', affectedRows: deleteResult.affectedRows };
    
        } catch (error) {
            console.error("Lỗi truy vấn MySQL:", error);
            return { success: false, error: 'Lỗi server, vui lòng thử lại sau.' };
        }
    },

    getListCustomerShopFollow: async (customerID) => {
        try {
            // ✅ Lấy tất cả Follow của khách hàng theo CustomerID
            const [rows] = await pool.query(`
                SELECT * 
                FROM Customer_Shop_Follow
                WHERE CustomerID = ?
            `, [customerID]);
    
            if (rows.length > 0) {
                return { message: "Lấy Follow của user thành công!", data: rows };
            } else {
                return { message: "Không tìm thấy Follow của user." };
            }
        } catch (error) {
            console.error("Lỗi truy vấn MySQL:", error);
            return { error: "Lỗi server, vui lòng thử lại sau." };
        }
    },    
    
    
};

module.exports = CustomerShopFollowModel;
