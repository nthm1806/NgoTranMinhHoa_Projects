const CustomerBehaviorService = require('../services/CustomerBehaviorService');

const CustomerBehaviorController = {
    addCustomerBehavior: async(req,res)=>{
        try {
        const cusID = req.body.customerID;
        const productID = req.body.productID;
        const category = req.body.category;
        const type = req.body.type;
        const shopID = req.body.shopID;
        const result = await CustomerBehaviorService.addCustomerBehavior(cusID, productID, category, type, shopID);
        res.status(200).json(result)
        } catch (error) {
            console.log(error)
        }
    },

    getNewCategory: async(req,res)=>{
        try {
        const customerID = req.query.customerID;
        const result = await CustomerBehaviorService.getNewCategory(customerID);
        res.status(200).json(result)
        } catch (error) {
            console.log(error)
        }
    },
    
}

module.exports = CustomerBehaviorController;