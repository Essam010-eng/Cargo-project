const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true
        }
    }],
    totalPrice: {
        type: Number,
    },
    status: {
        type: String,
        enum: ['pending', 'shipping', 'delivered'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

orderSchema.pre("save", function(next) {
    this.totalPrice = this.products.reduce((total, item) => total + (item.quantity * item.price), 0);
    next();
});

module.exports = mongoose.model("Order", orderSchema);
