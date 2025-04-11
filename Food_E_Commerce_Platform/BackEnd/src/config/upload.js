const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "ReportVideo", 
        allowed_formats: ["jpg", "png", "gif", "mp4", "avi", "mkv"], 
    },
});
const storageAvatar = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "avatar", 
        allowed_formats: ["jpg", "png", "gif", "mp4", "avi", "mkv"], 
    },
});

const storageBlogImage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "BlogImage", 
        allowed_formats: ["jpg", "png", "gif", "webp"], 
    },
});

const upload = multer({ storage });
const uploadBlogImage = multer({ storage: storageBlogImage });
const uploadAvatar = multer({ storage: storageAvatar });

module.exports = { upload, uploadBlogImage, uploadAvatar };
