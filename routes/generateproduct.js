const express = require('express');
const multer = require('multer');
const { generateAiIntegration } = require("../controller/generateproduct"); 
const router = express.Router();

const storage = multer.memoryStorage();

const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
    cb(null, true);
    } else {
    cb(new Error('يرجى رفع ملفات صور فقط!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: imageFilter,
    limits: {
    fileSize: 10 * 1024 * 1024 
    }
});


router.post('/generate', upload.single('car_image'), generateAiIntegration);

module.exports = router;