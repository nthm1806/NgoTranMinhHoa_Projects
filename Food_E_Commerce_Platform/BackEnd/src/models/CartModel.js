const pool = require('../config/Database');

const Carts = {
    getAllCart: async () => {
        const result = await pool.query('select * from Cart');
        return result[0];
    },
    getCartDetailByCusID: async (cusID) => {
        const result = await pool.query('select * from CartDetail where CartID in (select CartID from Cart where CustomerID = ? Order by CartID)', [cusID])
        return result[0];
    },
    removeCartDetail: async (OrderInfor)=>{
        if (Array.isArray(OrderInfor)) {
            let query = 'DELETE FROM CartDetail WHERE CartDetailID IN (';
            let values = OrderInfor.map(item => item.CartDetailID);
            query += values.join(",");
            query += ')';
            await pool.query(query); 
        } else {
            await pool.query('DELETE FROM CartDetail WHERE CartDetailID = ?', [OrderInfor]);
        }    
    },
    updateCartDetailQuantity: async (CartID, quantity) => {
        if (quantity <= 0) {
            await pool.query('DELETE FROM CartDetail WHERE CartDetailID = ?', [CartID]);
        }
            await pool.query('UPDATE CartDetail SET Quantity = ? WHERE CartDetailID = ?', [quantity, CartID]);
    },
    getCartItemById: async (CartID) => {
        const result = await pool.query('select * from CartDetail where CartDetailID = ?', [CartID]);
        if (result[0].length > 0) {
            return result[0][0];
        } else {
            return null;
        }
    },

    updateCartDetail: async (body) => {
        const {customerID, productID, quantity} = body
        const CartCurrentRecord =  await pool.query(
            "SELECT  * FROM Cart WHERE CustomerID = ? ORDER BY CartID desc", [customerID]
        );

        let currentCartID = CartCurrentRecord?.[0]?.[0]?.CartID

        if(!currentCartID){
            const [resultCart] = await pool.query(
                "INSERT INTO Cart (CustomerID) values (?)", [customerID]
              );
            currentCartID = resultCart.insertId;
        }

        const CartDetailCurrentRecord =  await pool.query(
            "SELECT * FROM CartDetail WHERE CartID = ? AND ProductID = ? ORDER BY CartDetailID desc", [currentCartID, productID]
        );

        let currentCartdDetailID = CartDetailCurrentRecord?.[0]?.[0]?.CartDetailID
        
        if(currentCartdDetailID){
            await pool.query(
                "UPDATE CartDetail SET Quantity = ? WHERE (CartDetailID = ? and ProductID = ?)", [ ((CartDetailCurrentRecord?.[0]?.[0]?.Quantity || 0) + quantity),currentCartdDetailID, productID]
              );
            return
        }
         await pool.query(
            "INSERT INTO CartDetail (CartID, ProductID, Quantity) values (?,?,?)", [currentCartID, productID, quantity]
          );
    },
}

module.exports = Carts;