const express = require('express');
const router = express.Router();
const multer = require('multer');
const damageController = require("../controller/cardamageconstroller");

const upload = multer({ storage: multer.memoryStorage() });

router.post('/detect-damage', upload.single('image'), damageController.detectDamage);

module.exports = router;