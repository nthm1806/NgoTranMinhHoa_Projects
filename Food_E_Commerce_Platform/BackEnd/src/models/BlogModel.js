const pool = require("../config/Database");

const Blog = {
    getAllBlogs: async () => {
        const result = await pool.query(`
            SELECT Blog.*, 
                (SELECT GROUP_CONCAT(BlogImages.ImageURL ORDER BY BlogImages.SortOrder) 
                FROM BlogImages WHERE BlogImages.BlogID = Blog.BlogID) as Images
            FROM Blog 
            ORDER BY CreatedAt DESC
        `);
        return result[0];
    },

    getBlogById: async (blogID) => {
        const result = await pool.query(
            `SELECT b.*, c.FirstName, c.LastName FROM Blog b JOIN Customer c 
                ON b.CustomerID = c.CustomerID WHERE b.BlogID = ?`,
            [blogID]);

        if (result[0].length === 0) {
            return { error: "Blog not found" };
        }
        const blog = result[0][0];

        const sectionsResult = await pool.query(
            `SELECT * FROM BlogSections WHERE BlogID = ? ORDER BY SortOrder`, [blogID]
        );
        blog.Sections = sectionsResult[0];

        const imagesResult = await pool.query(
            `SELECT * FROM BlogImages WHERE BlogID = ? ORDER BY SortOrder`, [blogID]
        );
        blog.Images = imagesResult[0];

        const [likeResult] = await pool.query(
            `SELECT COUNT(*) AS likeCount FROM BlogLikes WHERE BlogID = ?`, [blogID]
        );
        blog.Likes = likeResult[0].likeCount;


        return blog;
    },

    getBlogByCustomer: async (customerID) => {
        const [rows] = await pool.query(
            `SELECT * FROM Blog WHERE CustomerID = ? ORDER BY CreatedAt DESC`,
            [customerID]
        );
        return rows;
    },

    createBlog: async (data, sections, images) => {
        const { Title, ShortDescription, CategoryID, CustomerID, Image } = data;

        const result = await pool.query(
            `INSERT INTO Blog (Title, ShortDescription, CategoryID, CustomerID, Image, CreatedAt, UpdatedAt, Views, Likes)
            VALUES (?, ?, ?, ?, ?, NOW(), NOW(), 0, 0)`,
            [Title, ShortDescription, CategoryID, CustomerID, Image || ""]
        );

        const BlogID = result[0].insertId;

        if (sections && sections.length > 0) {
            for (let i = 0; i < sections.length; i++) {
                await pool.query(
                    `INSERT INTO BlogSections (BlogID, Content, SortOrder) VALUES (?, ?, ?)`,
                    [BlogID, sections[i], i + 1]
                );
            }
        }

        if (images && images.length > 0) {
            await pool.query(`DELETE FROM BlogImages WHERE BlogID = ?`, [BlogID]);

            for (let i = 0; i < images.length; i++) {
                if (images[i]) {
                    await pool.query(
                        `INSERT INTO BlogImages (BlogID, ImageURL, SortOrder) VALUES (?, ?, ?)`,
                        [BlogID, images[i], i + 1]
                    );
                }
            }
        }

        return { BlogID };
    },

    updateBlog: async (BlogID, data, sections, images) => {
        const { Title, ShortDescription, CategoryID, Image } = data;

        await pool.query(
            `UPDATE Blog SET Title = ?, ShortDescription = ?, CategoryID = ?, Image = ?, UpdatedAt = NOW() WHERE BlogID = ?`,
            [Title, ShortDescription, CategoryID, Image, BlogID]
        );

        if (sections && sections.length > 0) {
            await pool.query(`DELETE FROM BlogSections WHERE BlogID = ?`, [BlogID]);
            for (let i = 0; i < sections.length; i++) {
                await pool.query(
                    `INSERT INTO BlogSections (BlogID, Content, SortOrder) VALUES (?, ?, ?)`,
                    [BlogID, sections[i], i + 1]
                );
            }
        }

        if (images && images.length > 0) {
            await pool.query(`DELETE FROM BlogImages WHERE BlogID = ?`, [BlogID]);
            for (let i = 0; i < images.length; i++) {
                if (images[i]) {
                    await pool.query(
                        `INSERT INTO BlogImages (BlogID, ImageURL, SortOrder) VALUES (?, ?, ?)`,
                        [BlogID, images[i], i + 1]
                    );
                }
            }
        }


        return { BlogID };
    },

    deleteBlog: async (blogID) => {
        await pool.query(`DELETE FROM Blog WHERE BlogID = ?`, [blogID]);
    },

    likeBlog: async (blogID, action, customerID) => {
        const [rows] = await pool.query(`SELECT * FROM Blog WHERE BlogID = ?`, [blogID]);
        const currentLikes = rows[0]?.Likes || 0;

        if (action === "unlike" && currentLikes <= 0) {
            throw new Error("Likes cannot be less than 0");
        }

        if (action === "like") {
            const [check] = await pool.query(`
                SELECT * FROM BlogLikes WHERE BlogID = ? AND CustomerID = ?`, [blogID, customerID]);

            if (check.length === 0) {
                await pool.query(`INSERT IGNORE INTO BlogLikes (BlogID, CustomerID) VALUES (?, ?)`,
                    [blogID, customerID]);

                await pool.query(`UPDATE Blog SET Likes = Likes + 1 WHERE BlogID = ?`, [blogID]);
            }
        } else if (action === "unlike") {
            const [check] = await pool.query(`
                SELECT * FROM BlogLikes WHERE BlogID = ? AND CustomerID = ?`, [blogID, customerID]);

            if (check.length > 0) {
                await pool.query(`DELETE FROM BlogLikes WHERE BlogID = ? AND CustomerID = ?`,
                    [blogID, customerID]);
                await pool.query(`UPDATE Blog SET Likes = Likes - 1 WHERE BlogID = ? AND Likes > 0`, [blogID]);
            }
        }
    },

    checkLikedBlog: async (blogID, customerID) => {
        const [rows] = await pool.query(`
            SELECT * FROM BlogLikes WHERE BlogID = ? AND CustomerID = ?`, [blogID, customerID]);
        return rows.length > 0;
    }
};

module.exports = Blog