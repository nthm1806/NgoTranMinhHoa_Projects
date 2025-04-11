const { v2: cloudinary } = require("cloudinary");
const BlogService = require("../services/BlogService");

const Blog = {
    getAllBlogs: async (req, res) => {
        try {
            const blogs = await BlogService.getAllBlogs();
            return res.status(200).json(blogs);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Lỗi khi lấy danh sách blog!" });
        }
    },

    getBlogById: async (req, res) => {
        try {
            const { blogID } = req.params;
            const blog = await BlogService.getBlogById(blogID);

            if (!blog || blog.error) {
                return res.status(404).json({ error: "Blog không tồn tại!" });
            }

            return res.status(200).json(blog);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Lỗi khi lấy blog!" });
        }
    },

    getBlogByCustomer: async (req, res) => {
        try {
            const { customerID } = req.params;
            const blog = await BlogService.getBlogByCustomer(customerID);
            return res.status(200).json(blog);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Lỗi khi lấy blog!" });
        }
    },

    createBlog: async (req, res) => {
        try {
            const { title, categoryID, shortDescription, customerID, sections } = req.body;
            if (!title || !categoryID || !shortDescription || !customerID) {
                return res.status(400).json({ error: "Thiếu dữ liệu bắt buộc" });
            }

            let coverImage = null;
            if (req.files && req.files.coverImage) {
                const cloudinaryResponse = await cloudinary.uploader.upload(req.files.coverImage[0].path);
                coverImage = cloudinaryResponse.secure_url;
            } else {
                console.error("Lỗi khi upload ảnh bìa!");
                return res.status(500).json({ error: "Lỗi khi upload ảnh bìa!" });
            }

            const newImages = req.files && req.files.images ? req.files.images.map(file => file.path) : [];
            const parsedSections = typeof sections === "string" ? JSON.parse(sections) : sections;

            const blogData = {
                Title: title,
                CategoryID: categoryID,
                ShortDescription: shortDescription,
                CustomerID: customerID,
                Image: coverImage || "",
            };

            const blog = await BlogService.createBlog(blogData, parsedSections, newImages);
            return res.status(200).json(blog);
        } catch (error) {
            console.error("Error during blog creation: ", error);
            res.status(500).json({ error: "Lỗi khi tạo blog!" });
        }
    },

    updateBlog: async (req, res) => {
        try {
            const { blogID } = req.params;
            const { title, categoryID, shortDescription, sections, existingImages, existingCoverImage } = req.body;

            const blog = await BlogService.getBlogById(blogID);

            let coverImage = existingCoverImage;
            if (req.files && req.files.coverImage) {
                try {
                    const cloudinaryResponse = await cloudinary.uploader.upload(req.files.coverImage[0].path);
                    coverImage = cloudinaryResponse.secure_url;
                } catch (error) {
                    console.error("Error uploading cover image: ", error);
                    return res.status(500).json({ error: "Lỗi khi upload ảnh bìa!" });
                }
            }

            const newImages = req.files && req.files.images ? req.files.images.map(file => file.path) : [];

            let oldImages = [];
            if (existingImages) {
                try {
                    oldImages = JSON.parse(existingImages);
                } catch (error) {
                    console.error("Error parsing JSON string: ", error);
                }
            }
            const allImages = [...oldImages, ...newImages];

            const parsedSections = typeof sections === "string" ? JSON.parse(sections) : sections;
            const blogData = {
                Title: title,
                CategoryID: categoryID,
                ShortDescription: shortDescription,
                Image: coverImage || "",
            };

            const updatedBlog = await BlogService.updateBlog(blogID, blogData, parsedSections, allImages);
            return res.status(200).json(updatedBlog);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Lỗi khi cập nhật blog!" });
        }
    },

    deleteBlog: async (req, res) => {
        try {
            const { blogID } = req.params;
            const blog = await BlogService.deleteBlog(blogID);
            return res.status(200).json(blog);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Lỗi khi xóa blog!" });
        }
    },

    likeBlog: async (req, res) => {
        try {
            const { blogID } = req.params;
            const { action, customerID } = req.body;

            await BlogService.likeBlog(blogID, action, customerID);
            return res.status(200).json({ message: `Đã ${action === "like" ? "Thích" : "Bỏ thích"}` });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Có lỗi rồi!" });
        }
    },

    checkLikedBlog: async (req, res) => {
        try {
            const { blogID } = req.params;
            const { customerID } = req.query;

            const isliked = await BlogService.checkLikedBlog(blogID, customerID);
            res.json({ isliked });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Có lỗi rồi!" });
        }
    },
}

module.exports = Blog