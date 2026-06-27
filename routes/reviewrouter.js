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


router.post("/", checkAuth, createReview);


router.get("/", getAllReviews);


router.get("/product/:productId", getProductReviews);


router.get("/:id", getOneReview);


router.put("/:id", checkAuth, updateReview);


router.delete("/:id", checkAuth, deleteReview);


module.exports = router;