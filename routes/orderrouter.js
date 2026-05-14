const express = require("express");
const router = express.Router();

// 🟢 استدعاء الكونترولير
const {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus
} = require("../controller/ordercontroller");

// 🟢 ميدل وير الحماية
const checkauth= require("../middlewares/checkauth");
const checkrole = require("../middlewares/checkrole");


// ===============================
// 🟢 User Routes
// ===============================

// إنشاء أوردر (لازم يكون مسجل)
router.post("/", checkauth, createOrder);

// يجيب أوردرات المستخدم نفسه
router.get("/my", checkauth, getMyOrders);


// ===============================
// 🟢 Admin Routes
// ===============================

// يجيب كل الأوردرات
router.get("/", checkauth, checkrole("admin"), getAllOrders);

// تحديث حالة الأوردر
router.patch("/:id", checkauth, checkrole("admin"), updateOrderStatus);


module.exports = router;