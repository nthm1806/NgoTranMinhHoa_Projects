const RegisterService = require('../services/RegisterService');

const RegisterController = {
    addCustomer: async (req, res) => {
        try {
           const rs = await RegisterService.addCustomer(req.body);
            res.status(200).json(rs);
        } catch (err) {
            res.status(500).json({ message: 'Lỗi server', err });
            console.log(err);

        }
    },
};

module.exports = RegisterController;