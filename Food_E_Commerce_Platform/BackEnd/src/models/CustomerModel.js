const bcrypt = require('bcryptjs'); // Import bcryptjs để mã hóa mật khẩu
const pool = require('../config/Database');

const Customers = {
    getAllCustomers: async () => {
        const result = await pool.query('SELECT * FROM Customer');
        return result[0];
    },

    getCustomerById: async (CustomerID) => {
        const result = await pool.query('SELECT * FROM Customer WHERE CustomerID = ?', [CustomerID]);
        return result[0][0];
    },

    updateCustomerById: async (CustomerID, customerData) => {
        const oldCustomerQuery = await pool.query('SELECT * FROM Customer WHERE CustomerID = ?', [CustomerID]);
        const oldCustomer = oldCustomerQuery[0][0];
    
        if (!oldCustomer) {
            throw new Error('Khách hàng không tồn tại');
        }

        // Kiểm tra mật khẩu cũ và mã hóa mật khẩu mới
        if (customerData.oldPassword && customerData.newPassword) {
            // So sánh mật khẩu cũ với mật khẩu đã băm trong cơ sở dữ liệu
            const isOldPasswordCorrect = await bcrypt.compare(customerData.oldPassword, oldCustomer.password);

            if (!isOldPasswordCorrect) {
                throw new Error('Mật khẩu cũ không chính xác');
            }

            // Mã hóa mật khẩu mới
            customerData.password = await bcrypt.hash(customerData.newPassword, 10);
        } else {
            // Nếu không thay đổi mật khẩu, giữ nguyên mật khẩu cũ
            customerData.password = oldCustomer.password;
        }
    
        // Giữ nguyên dữ liệu cũ nếu không có giá trị mới
        const updatedCustomer = {
            FirstName: customerData.FirstName || oldCustomer.FirstName,
            LastName: customerData.LastName || oldCustomer.LastName,
            DateOfBirth: customerData.DateOfBirth || oldCustomer.DateOfBirth,
            Email: customerData.Email || oldCustomer.Email,
            PhoneNumber: customerData.PhoneNumber || oldCustomer.PhoneNumber,
            Gender: customerData.Gender || oldCustomer.Gender,
            password: customerData.password || oldCustomer.password,
            Avatar: customerData.Avatar || oldCustomer.Avatar,
            xu: customerData.xu !== undefined ? customerData.xu : oldCustomer.xu 
        };
    
        const result = await pool.query(
            'UPDATE Customer SET FirstName = ?, LastName = ?, DateOfBirth = ?, Email = ?, PhoneNumber = ?, Gender = ?, password = ?, Avatar = ?, xu = ? WHERE CustomerID = ?',
            [updatedCustomer.FirstName, updatedCustomer.LastName, updatedCustomer.DateOfBirth, updatedCustomer.Email, updatedCustomer.PhoneNumber, updatedCustomer.Gender, updatedCustomer.password, updatedCustomer.Avatar, updatedCustomer.xu, CustomerID]
        );
    
        return result;
    },

    addCoinCustomer: async (inforFullUser, item) => {
                const addCoin = Math.ceil((item.bill_amount / 1000) * 0.1);
    
        // Cập nhật số xu của khách hàng
        const result = await pool.query(
            'UPDATE Customer SET xu = xu + ? WHERE CustomerID = ?',
            [addCoin, item.customer_id]
        );
    
        // Kiểm tra kết quả
        if (result.affectedRows > 0) {
            // Trả về thông tin đã cập nhật
            return { success: true, message: 'Coins updated successfully!' };
        } else {
            // Trường hợp không tìm thấy CustomerID
            return { success: false, message: 'Customer not found!' };
        }
    },
    
};

module.exports = Customers;
