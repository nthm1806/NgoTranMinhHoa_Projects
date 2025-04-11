const PolicyService = require('../services/PolicyService');

const PolicyController = {
    getCategoryPolicy: async (req, res) => {
        try {
          
           const [rs] =  await PolicyService.getCategoryPolicy(req.body);
            res.status(200).json(rs);
        } catch (err) {
            res.status(500).json({ message: 'Lỗi server', err });
        }
    },

    searchPolicy: async (req, res) => {
        
        try {
            const rs = await PolicyService.searchPolicy(req.body);
            res.status(200).json(rs);
        } catch (err) {
            res.status(500).json({ message: 'Lỗi server', err });
        }
    }
};

module.exports = PolicyController;