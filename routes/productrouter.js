const { Router } = require("express");
const {
    getAllProducts,
    getOneProduct,
    createProduct,
    updateproductpatch,
    deleteproduct,
    sellergetallproduct,
    sellergetoneproduct,
    sellerupdatepatch,
    sellerupdateput,
    sellerdeleteproduct
} = require("../controller/productcontroller");

const upload = require("../config/multer");
const checkrole = require("../middlewares/checkrole");
const checkauth = require("../middlewares/checkauth"); // 1. لازم تستورد الـ checkauth هنا

const router = Router();

// ملاحظة: بما أن كل المسارات هنا تتطلب تسجيل دخول، يمكننا حماية الراوتر بالكامل هكذا:
router.use(checkauth); 

// ================= ADMIN =================
// الآن checkrole ستعمل بنجاح لأن checkauth جهزت لها req.user
router.get("/", checkrole("admin"), getAllProducts);
router.get("/:name", checkrole("admin"), getOneProduct);

// لاحظ هنا سمحنا للأدمن والسلر معاً
router.post("/", upload.array("images", 5), checkrole("admin", "seller"), createProduct);

router.patch("/:id", upload.array("images", 5), checkrole("admin"), updateproductpatch);
router.put("/:id", upload.array("images", 5), checkrole("admin"), updateproductpatch);
router.delete("/:id", checkrole("admin"), deleteproduct);

// ================= SELLER =================
router.get("/seller", checkrole("seller"), sellergetallproduct);
router.get("/seller/:id", checkrole("seller"), sellergetoneproduct);
router.patch("/seller/:id", upload.array("images", 5), checkrole("seller"), sellerupdatepatch);
router.put("/seller/:id", upload.array("images", 5), checkrole("seller"), sellerupdateput);
router.delete("/seller/:id", checkrole("seller"), sellerdeleteproduct);

module.exports = router;