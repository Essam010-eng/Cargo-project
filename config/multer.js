const multer = require("multer");
const AppError = require("../helpers/globalerrorehandler");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "images");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
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
