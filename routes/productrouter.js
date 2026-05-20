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
const checkauth = require("../middlewares/checkauth"); 

const router = Router();

router.use(checkauth); 

router.get("/", checkrole("admin"), getAllProducts);
router.get("/:name", checkrole("admin"), getOneProduct);

router.post("/", upload.array("images", 5), checkrole("admin", "seller"), createProduct);

router.patch("/:id", upload.array("images", 5), checkrole("admin"), updateproductpatch);
router.put("/:id", upload.array("images", 5), checkrole("admin"), updateproductpatch);
router.delete("/:id", checkrole("admin"), deleteproduct);


router.get("/seller", checkrole("seller"), sellergetallproduct);
router.get("/seller/:id", checkrole("seller"), sellergetoneproduct);
router.patch("/seller/:id", upload.array("images", 5), checkrole("seller"), sellerupdatepatch);
router.put("/seller/:id", upload.array("images", 5), checkrole("seller"), sellerupdateput);
router.delete("/seller/:id", checkrole("seller"), sellerdeleteproduct);

module.exports = router;