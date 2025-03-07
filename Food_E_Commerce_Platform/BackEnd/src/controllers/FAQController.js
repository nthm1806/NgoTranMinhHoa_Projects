const FAQService = require("../services/FAQService");

const FAQController = {
    getPopularFAQs: async (req, res) => {
        try {
            const faqs = await FAQService.getPopularFAQs();
            res.status(200).json(faqs);
        } catch (error) {
            console.error("Error fetching popular FAQs:", error.message);
            res.status(500).json({ error: "Lỗi server" });
        }
    },

    incrementViewCount: async (req, res) => {
        try {
            const { id } = req.params;
            const updated = await FAQService.incrementViewCount(id);
            if (!updated) return res.status(404).json({ error: "FAQ không tồn tại" });

            res.status(200).json({ message: "View count updated" });
        } catch (error) {
            console.error("Error updating view count:", error.message);
            res.status(500).json({ error: "Lỗi server" });
        }
    }
};

module.exports = FAQController;
