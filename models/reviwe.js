const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a user.']
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: [true, 'Review must belong to a product.']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'Review must have a rating.']
    },
    comment: {
        type: String,
        required: [true, 'Review cannot be empty!']
    }
}, { timestamps: true });

reviewSchema.statics.calcAverageRatings = async function(productId) {
    const stats = await this.aggregate([
        { $match: { product: productId } },
        {
            $group: {
                _id: "$product",
                avgRating: { $avg: "$rating" },
                ratingsQuantity: { $sum: 1 }
            }
        }
    ]);

    if (stats.length > 0) {
        await mongoose.model('Product').findByIdAndUpdate(productId, {
            ratingsAverage: stats[0].avgRating,
            ratingsQuantity: stats[0].ratingsQuantity
        });
    } else {
        await mongoose.model('Product').findByIdAndUpdate(productId, {
            ratingsAverage: 0,
            ratingsQuantity: 0
        });
    }
};

reviewSchema.post('save', function() {
    this.constructor.calcAverageRatings(this.product);
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;