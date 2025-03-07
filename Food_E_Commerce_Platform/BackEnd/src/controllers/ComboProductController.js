const comboProductService = require('../services/ComboProductService');

const ComboProduct = {
  
  setComboProduct: async (req, res) => {
    try {
      const result = await comboProductService.setComboProduct(req.body.combo);      
      res.status(200).json(result);
    } catch (err) {
      console.log(err);
    }
  },

  getComboProduct: async (req, res) => {
    const {ShopID, keyword,pageIndex} = req.body
    try {
      const result = await comboProductService.getComboProduct(ShopID, keyword, pageIndex);      
      res.status(200).json(result);
    } catch (err) {
      console.log(err);
    }
  },
};

module.exports = ComboProduct;
