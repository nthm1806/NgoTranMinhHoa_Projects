const BlogModel = require("../models/BlogModel");

const Blog = {
    getAllBlogs: async () => {
        return await BlogModel.getAllBlogs()
    },

    getBlogById: async (BlogID) => {
        return await BlogModel.getBlogById(BlogID)
    },

    getBlogByCustomer: async (customerID) => {
        return await BlogModel.getBlogByCustomer(customerID)
    },

    createBlog: async (data, sections, images) => {
        return await BlogModel.createBlog(data, sections, images)
    },

    updateBlog: async (BlogID, data, sections, images) => {
        return await BlogModel.updateBlog(BlogID, data, sections, images)
    },

    deleteBlog: async (blogID) => {
        return await BlogModel.deleteBlog(blogID)
    },

    likeBlog: async (blogID, action, customerID) => {
        return await BlogModel.likeBlog(blogID, action, customerID)
    },

    checkLikedBlog: async (blogID, customerID) => {
        return await BlogModel.checkLikedBlog(blogID, customerID)
    },
}

module.exports = Blog