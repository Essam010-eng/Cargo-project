const checkauth = require("../middlewares/checkauth");
const Order = require("../models/order");


const createOrder = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { products } = req.body;

        if (!products || products.length === 0) {
            return res.status(400).json({
                message: "Order must contain products"
            });
        }

        const order = new Order({
            user: userId,
            products
        });

        await order.save();

        res.status(201).json({
            message: "Order created successfully",
            order
        });

    } catch (err) {
        next(err);
    }
};

const getMyOrders = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const orders = await Order.find({ user: req.user._id })
            .populate("products.product");

        res.status(200).json({
            results: orders.length,
            orders
        });

    } catch (err) {
        next(err);
    }
};


const getAllOrders = async (req, res, next) => {
    try {
        if (!req.user || req.user.role !== "admin") {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        const orders = await Order.find()
            .populate("user")
            .populate("products.product");

        res.status(200).json({
            results: orders.length,
            orders
        });

    } catch (err) {
        next(err);
    }
};


const updateOrderStatus = async (req, res, next) => {
    try {
        if (!req.user || req.user.role !== "admin") {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        const { id } = req.params;
        const { status } = req.body;

        const order = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.status(200).json({
            message: "Order updated successfully",
            order
        });

    } catch (err) {
        next(err);
    }
};


module.exports= {
    getAllOrders,
    getMyOrders,
    updateOrderStatus,
    createOrder
}