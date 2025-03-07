const pool = require('../config/Database');

const Carts = {
    getAllCart:async()=>{
        const result = await pool.query('select * from Cart');
        return result[0];
    },
    getCartDetailByCusID: async(cusID)=>{
        const result = await pool.query('select * from CartDetail where CartID in (select CartID from Cart where CustomerID = ? Order by CartID)',[cusID])
        return result[0];
    },
    removeCartDetail: async (OrderInfor)=>{
        let query = 'delete from CartDetail where CartDetailID in (';
        let values = OrderInfor.map((item, index) => {
            return item.CartDetailID;
          });
          query += values.join(",");
          query += ')';
        await pool.query(query);      
    },
    updateCartDetailQuantity: async (cartID, quantity) => {
        const query = 'UPDATE CartDetail SET Quantity = Quantity + ? WHERE CartDetailID = ?';
        
        await pool.query(query, [quantity, cartID]);
    },
}

module.exports = Carts;