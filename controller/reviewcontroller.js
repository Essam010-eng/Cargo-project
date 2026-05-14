const Review = require("../models/reviwe");

// 🟢 Create Review
const createReview = async (req, res, next) => {
    try {
        const { product, rating, comment } = req.body;

        // منع تكرار review لنفس المنتج من نفس المستخدم
        const exist = await Review.findOne({
            user: req.user._id,
            product
        });

        if (exist) {
            return res.status(400).json({
                status: "fail",
                message: "You already reviewed this product"
            });
        }

        const review = await Review.create({
            user: req.user._id,
            product,
            rating,
            comment
        });

        res.status(201).json({
            status: "success",
            data: review
        });

    } catch (err) {
        next(err);
    }
};


// 🟢 Get All Reviews
const getAllReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find()
            .populate("user", "username email")
            .populate("product", "name price");

        res.status(200).json({
            status: "success",
            results: reviews.length,
            data: reviews
        });

    } catch (err) {
        next(err);
    }
};


// 🟢 Get One Review
const getOneReview = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id)
            .populate("user", "username")
            .populate("product", "name");

        if (!review) {
            return res.status(404).json({
                status: "fail",
                message: "Review not found"
            });
        }

        res.status(200).json({
            status: "success",
            data: review
        });

    } catch (err) {
        next(err);
    }
};


// 🟡 Update Review (only owner)
const updateReview = async (req, res, next) => {
    try {
        const review = await Review.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user._id
            },
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!review) {
            return res.status(404).json({
                status: "fail",
                message: "Review not found or not yours"
            });
        }

        res.status(200).json({
            status: "success",
            data: review
        });

    } catch (err) {
        next(err);
    }
};


// 🔴 Delete Review (only owner)
const deleteReview = async (req, res, next) => {
    try {
        const review = await Review.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!review) {
            return res.status(404).json({
                status: "fail",
                message: "Review not found or not yours"
            });
        }

        res.status(200).json({
            status: "success",
            message: "Review deleted successfully"
        });

    } catch (err) {
        next(err);
    }
};


// 🟢 Get Reviews for specific product
const getProductReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find({
            product: req.params.productId
        }).populate("user", "username");

        res.status(200).json({
            status: "success",
            results: reviews.length,
            data: reviews
        });

    } catch (err) {
        next(err);
    }
};


module.exports = {
    createReview,
    getAllReviews,
    getOneReview,
    updateReview,
    deleteReview,
    getProductReviews
};