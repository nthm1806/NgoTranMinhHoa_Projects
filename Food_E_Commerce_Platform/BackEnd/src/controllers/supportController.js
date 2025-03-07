const SupportService = require('../services/supportService');


const SupportController = {
    createRequest: async (req, res) => {
        try {
            const { customer_id, category, subject, details } = req.body;
            if (!customer_id || !category || !subject || !details) {
                return res.status(400).json({ error: "Vui lòng điền đầy đủ thông tin." });
            }

            const request = await SupportService.createRequest(customer_id, category, subject, details);
            res.status(201).json({ message: 'Yêu cầu của bạn đã được gửi thành công!', request });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Lỗi khi gửi yêu cầu!' });
        }
    },

    getUserRequests: async (req, res) => {
        try {
            const { customer_id } = req.params;
            if (!customer_id) {
                return res.status(400).json({ error: "Thiếu customer_id" });
            }

            const requests = await SupportService.getUserRequests(customer_id);
            res.status(200).json(requests);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Lỗi khi lấy lịch sử yêu cầu!' });
        }
    },

    // API lấy chi tiết một yêu cầu hỗ trợ theo ID
    getRequestById: async (req, res) => {
        try {
            const { id } = req.params;
            const request = await SupportService.getRequestById(id);

            if (!request) {
                return res.status(404).json({ error: "Không tìm thấy yêu cầu hỗ trợ!" });
            }

            res.status(200).json(request);
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết yêu cầu:", error);
            res.status(500).json({ error: "Lỗi server!" });
        }
    },
    getRequestCategories: async (req, res) => {
        try {
            const categories = await SupportService.getRequestCategories();
            res.status(200).json(categories);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách loại yêu cầu:", error);
            res.status(500).json({ error: "Lỗi server!" });
        }
    },
    getCategories: async (req, res) => {
        try {
            const [categories] = await pool.query("SELECT * FROM RequestCategories");
            res.status(200).json(categories);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách categories:", error);
            res.status(500).json({ error: "Lỗi server!" });
        }
    }
};

module.exports = SupportController;
