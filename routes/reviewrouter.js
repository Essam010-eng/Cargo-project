const express = require("express");
const router = express.Router();

const {
    createReview,
    getAllReviews,
    getOneReview,
    updateReview,
    deleteReview,
    getProductReviews
} = require("../controller/reviewcontroller");

const checkAuth = require("../middlewares/checkauth");


// 🟢 Create Review (لازم يكون logged in)
router.post("/", checkAuth, createReview);


// 🟢 Get all reviews
router.get("/", getAllReviews);


// 🟢 Get reviews for specific product
router.get("/product/:productId", getProductReviews);


// 🟢 Get one review
router.get("/:id", getOneReview);


// 🟢 Update review (لازم يكون logged in)
router.put("/:id", checkAuth, updateReview);


// 🟢 Delete review (لازم يكون logged in)
router.delete("/:id", checkAuth, deleteReview);


module.exports = router;