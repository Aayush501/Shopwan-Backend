const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Cloudinary Storage Configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const fileType = file.mimetype.split("/")[0]; // "image" or "video"
    return {
      folder: "shopwans", // Cloudinary folder name
      resource_type: "auto", // Automatically detect file type (image/video)
      allowed_formats: ["jpg", "png", "jpeg", "webp", "mp4", "avi", "mov", "mkv"],
    };
  },
});

// Multer Middleware for Uploading
const upload = multer({ storage });

module.exports = { upload, cloudinary };
