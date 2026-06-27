const { required } = require("joi");
const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Enter the name of the product"]
    },
    description: {
        type: String,
        required: [true, "Enter the description of the product"]
    },
    category: {
        type: String,
        required: [true, "Enter the category of the product"]
    },
    price: {
        type: Number,
        required: [true, "Enter price of product"]
    },
    colorimage: [
        {
            color: String,
            images: [String]
        }
    ],
    stock: {
        type: Number,
        required: true
    },
    carsforproduct: [
        {
            name: {
                type: String,
                required: [true, "Enter the car model that matches the product"]
            }
        }
    ],
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        required: true
    },
    averageRating: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model("Product", productSchema);
