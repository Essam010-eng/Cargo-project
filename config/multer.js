const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const AppError = require("../helpers/globalerrorehandler");

cloudinary.config({ 
    cloud_name: process.env.cloud_name, 
    api_key: process.env.api_key, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "cargo-products",
        allowed_formats: ["jpg", "png", "jpeg"],
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new AppError(400, "Images only"));
    }
};

const upload = multer({ 
    storage, 
    fileFilter, 
    limits: { fileSize: 50 * 1024 * 1024 } 
});

module.exports = upload;