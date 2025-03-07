const pool = require('../config/Database');

const review ={
    addReview: async(form,cusID,categoryID)=>{
        if(form.category === 'product'){
            await pool.query('insert into ProductReview(Review,Rate,CustomerID,ProductID) values (?,?,?,? )',[form.reviewText,form.rating,cusID,categoryID])
        }else if(form.category === 'shop'){
            await pool.query('insert into ShopReview(CustomerID,ShopID,Rate,Review) values ( ?,? ,?,?)',[cusID,categoryID,form.rating,form.reviewText])
        }else{
            await pool.query('insert into ShipperReview (CustomerID,ShipperID,Rate,Review) values ( ?,? ,?,?)',[cusID,categoryID,form.rating,form.reviewText])
        }
    },

    getReview: async(form)=>{
        if(form.category === 'product'){
            return await pool.query("SELECT pr.*,c.Avatar as avatarViewer, concat(c.FirstName, ' ' , c.LastName) AS reviewer FROM ProductReview pr JOIN Customer c ON c.CustomerID = pr.CustomerID WHERE pr.ProductID = ? ORDER BY pr.ReviewProductID DESC",[form.ProductID])
        }
    }
}

module.exports = review;