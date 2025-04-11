const pool = require("../config/Database");

const Policy = {
    getCategoryPolicy: async (body) => {
        const query = `SELECT cp.title as categoryTitle, p.title as policyTitle, p.policyId, cp.categoryPolicyId FROM 
                        category_policy cp JOIN policy_detail pd ON cp.categoryPolicyId = pd.categoryPolicyId
                        join policy p on pd.policyId = p.policyId;`;
        const [rs] = await pool.query(query);
        return [rs]
    },

    searchPolicy: async (body) => {
        const { policyId, keyword } = body;

        let query = `SELECT * FROM policy`;
        let queryParams = [];

        if (policyId) {
            query += ` WHERE policyId = ?`;
            queryParams.push(policyId);
        }

        if (keyword) {
            if (queryParams.length > 0) {
                query += ` AND (title LIKE ? OR description LIKE ?)`;
            } else {
                query += ` WHERE (title LIKE ? OR description LIKE ?)`;
            }
            queryParams.push(`%${keyword}%`, `%${keyword}%`);
        }

        const result = await pool.query(query, queryParams);
        return result[0];
    }

}

module.exports = Policy