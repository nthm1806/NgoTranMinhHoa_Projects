const pool = require('../config/Database');

const AddressModel = {
    getAddressByCustomerId: async (customerID) => {
        const [rows] = await pool.query("SELECT * FROM address WHERE CustomerID = ?", [customerID]);
        return rows;
    },

    addAddress: async (customerID, houseAddress, area) => {
        try {
            const [result] = await pool.query(
                "INSERT INTO address (CustomerID, HouseAddress, Area) VALUES (?, ?, ?)",
                [customerID, houseAddress, area]
            );
            if (!result || result.affectedRows === 0) {
                throw new Error("Không thể chèn dữ liệu vào bảng address");
            }
            return { addressID: result.insertId };
        } catch (error) {
            console.error("Lỗi khi thực hiện query thêm địa chỉ:", error);
            throw error;
        }
    },
    setDefault:async(addressID)=>{
        await pool.query('update address set isDefault = 1 where AddressID = ?',[addressID[0]])
        await pool.query('update address set isDefault = 0 where AddressID = ?',[addressID[1]])
    },
    updateAddressById: async (addressID, addressData) => {
        try {
            const [oldAddressQuery] = await pool.query(
                'SELECT * FROM address WHERE AddressID = ?', [addressID]
            );
            const oldAddress = oldAddressQuery[0];
    
            if (!oldAddress) {
                return { success: false, message: 'Địa chỉ không tồn tại' };
            }
    
            const updatedAddress = {
                HouseAddress: addressData.houseAddress || oldAddress.HouseAddress,
                Area: addressData.area || oldAddress.Area,
            };
    
            const [result] = await pool.query(
                'UPDATE address SET HouseAddress = ?, Area = ? WHERE AddressID = ?',
                [updatedAddress.HouseAddress, updatedAddress.Area, addressID]
            );
    
            if (result.affectedRows === 0) {
                return { success: false, message: "Không có bản ghi nào được cập nhật" };
            }
    
            return { success: true, message: "Cập nhật địa chỉ thành công" };
        } catch (error) {
            console.error("Lỗi khi cập nhật địa chỉ:", error);
            return { success: false, message: "Lỗi khi cập nhật địa chỉ" };
        }
    },
    
    removeAddress: async (addressID, customerID) => {
        try {
            // Kiểm tra số lượng địa chỉ của khách hàng
            const [countResult] = await pool.query(
                "SELECT COUNT(*) AS count FROM address WHERE CustomerID = ?", 
                [customerID]
            );
    
            // Xóa địa chỉ
            const [result] = await pool.query("DELETE FROM address WHERE AddressID = ?", [addressID]);
    
            if (result.affectedRows === 0) {
                return { success: false, message: "Không tìm thấy địa chỉ để xóa!" };
            }
    
            return { success: true, message: "Địa chỉ đã được xóa thành công!" };
    
        } catch (error) {
            console.error("Lỗi khi xóa địa chỉ:", error);
            return { success: false, message: "Lỗi khi xóa địa chỉ!" };
        }
    }
    
};

module.exports = AddressModel;
