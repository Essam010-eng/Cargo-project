const express = require('express');
const router = express.Router();
const multer = require('multer');
const damageController = require("../controller/cardamageconstroller");

// إعداد Multer في الذاكرة
const upload = multer({ storage: multer.memoryStorage() });

// ربط المسار بالـ Controller
router.post('/detect-damage', upload.single('image'), damageController.detectDamage);

module.exports = router;