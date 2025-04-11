const express = require("express");
const { upload } = require("../config/upload"); // Import Multer + Cloudinary

const router = express.Router();

// API upload ảnh lên Cloudinary
router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.json({ url: req.file.path }); // Trả về URL ảnh trên Cloudinary
});

module.exports = router;
