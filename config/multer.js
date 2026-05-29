const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const AppError = require("../helpers/globalerrorehandler");

// تفعيل dotenv هنا في أول السطر عشان نضمن قراءة المتغيرات لو السيرفر ملقطهاش
require("dotenv").config(); 

cloudinary.config({ 
    cloud_name: process.env.Cloud_name, 
    api_key: process.env.Api_key, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        return {
            folder: "cargo-products",
            // بنخلي الفورمات يتحدد أوتوماتيك بناءً على نوع الملف عشان نمنع لغبطة الـ Signature
            format: file.mimetype.split("/")[1], 
            public_id: file.originalname.split(".")[0] + "-" + Date.now(),
        };
    },
});

const fileFilter = (req, file, cb) => {
    // التأكد من الامتدادات المسموحة هنا في الـ Filter بدل الـ params عشان نريح Cloudinary
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg") {
        cb(null, true);
    } else {
        cb(new AppError(400, "Images only (jpg, png, jpeg)"));
    }
};

const upload = multer({ 
    storage, 
    fileFilter, 
    limits: { fileSize: 50 * 1024 * 1024 } 
});

module.exports = upload;