const CustomerShopFollowService = require("../services/CustomerShopFollowService");

const CustomerShopFollowController = {
    postAddCustomerShopFollow: async (req, res) => {
    try {
      const customerID = req.body.customerID;
      const shopID = req.body.shopID;
      const result = await CustomerShopFollowService.postAddCustomerShopFollow(
        customerID,
        shopID
      );
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
    }
  },

  deleteCustomerShopFollow: async (req, res) => {
    try {
      const customerID = req.query.customerID;
      const shopID = req.query.shopID;
      const result = await CustomerShopFollowService.deleteCustomerShopFollow(
        customerID,
        shopID
      );
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
    }
  },

  getListCustomerShopFollow: async (req, res) => {
    try {
      const customerID = req.query.customerID;
      const result = await CustomerShopFollowService.getListCustomerShopFollow(
        customerID
      );
      
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = CustomerShopFollowController;
