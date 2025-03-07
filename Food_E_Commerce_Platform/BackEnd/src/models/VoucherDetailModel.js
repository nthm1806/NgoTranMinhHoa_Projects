const pool = require('../config/Database');

const VoucherDetailModel = {
    postSaveVoucherID: async (customerID, saveVoucherID) => {
        // Kiểm tra xem đã có bản ghi nào với customerID và saveVoucherID chưa
        const [rows] = await pool.query('SELECT * FROM VoucherDetail WHERE CustomerID = ? AND VoucherID = ?', [customerID, saveVoucherID]);
           // Nếu không có bản ghi nào, thêm mới bản ghi vào bảng VoucherDetail
        if (rows.length === 0) {
            const insertQuery = 'INSERT INTO VoucherDetail (CustomerID, VoucherID) VALUES (?, ?)';
            await pool.query(insertQuery, [customerID, saveVoucherID]);
            
            return { success: true, message: 'Voucher saved successfully!' };
        } else {
            return { success: false, message: 'Voucher already exists for this customer!' };
        }
    },

    deleteVoucherID: async (customerID, deleteVoucherID) => {
        try {
            // ✅ Kiểm tra xem voucher có tồn tại trong VoucherDetail không
            const [existingRows] = await pool.query(`
                SELECT * FROM VoucherDetail 
                WHERE CustomerID = ? AND VoucherID = ?
            `, [customerID, deleteVoucherID]);
    
            if (existingRows.length === 0) {
                return { success: false, message: 'Voucher not found for this customer!' };
            }
    
            // ✅ Nếu tồn tại, thực hiện xóa voucher
            const [deleteResult] = await pool.query(`
                DELETE FROM VoucherDetail 
                WHERE CustomerID = ? AND VoucherID = ?
            `, [customerID, deleteVoucherID]);
    
            return { success: true, message: 'Voucher deleted successfully!', affectedRows: deleteResult.affectedRows };
    
        } catch (error) {
            console.error("Lỗi truy vấn MySQL:", error);
            return { success: false, error: 'Lỗi server, vui lòng thử lại sau.' };
        }
    },

    getListVoucherByCustomerID: async (customerID) => {
        try {
            // ✅ Lấy tất cả voucher của khách hàng theo CustomerID
            const [rows] = await pool.query(`
                SELECT * 
                FROM VoucherDetail
                WHERE CustomerID = ?
            `, [customerID]);
    
            if (rows.length > 0) {
                return { message: "Lấy voucher của user thành công!", data: rows };
            } else {
                return { message: "Không tìm thấy voucher của user." };
            }
        } catch (error) {
            console.error("Lỗi truy vấn MySQL:", error);
            return { error: "Lỗi server, vui lòng thử lại sau." };
        }
    },    
    
    
};

module.exports = VoucherDetailModel;
