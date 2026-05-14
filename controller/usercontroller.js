const User = require("../models/user");
const AppError = require("../helpers/globalerrorehandler");


// 🟢 Get My Profile
const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select("-password");

        if (!user) {
            return next(new AppError(404, "User not found"));
        }

        res.status(200).json({
            status: "success",
            user
        });

    } catch (err) {
        next(err);
    }
};


// 🟢 Update My Profile (safe update)
const updateMe = async (req, res, next) => {
    try {
        const allowedFields = {
            username: req.body.username,
            email: req.body.email
        };

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            allowedFields,
            {
                new: true,
                runValidators: true
            }
        ).select("-password");

        if (!updatedUser) {
            return next(new AppError(404, "User not found"));
        }

        res.status(200).json({
            status: "success",
            message: "Profile updated successfully",
            user: updatedUser
        });

    } catch (err) {
        next(err);
    }
};


// 🟢 Get All Users (Admin only)
const getAllUsers = async (req, res, next) => {
    try {
        if (!req.user || req.user.role !== "admin") {
            return next(new AppError(403, "Access denied"));
        }

        const users = await User.find().select("-password");

        res.status(200).json({
            status: "success",
            results: users.length,
            users
        });

    } catch (err) {
        next(err);
    }
};


// 🟢 Get User By ID (Admin only)
const getUserById = async (req, res, next) => {
    try {
        if (!req.user || req.user.role !== "admin") {
            return next(new AppError(403, "Access denied"));
        }

        const user = await User.findById(req.params.id).select("-password");

        if (!user) {
            return next(new AppError(404, "User not found"));
        }

        res.status(200).json({
            status: "success",
            user
        });

    } catch (err) {
        next(err);
    }
};


// 🔴 Delete User (Admin only)
const deleteUser = async (req, res, next) => {
    try {
        if (!req.user || req.user.role !== "admin") {
            return next(new AppError(403, "Access denied"));
        }

        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return next(new AppError(404, "User not found"));
        }

        res.status(200).json({
            status: "success",
            message: "User deleted successfully"
        });

    } catch (err) {
        next(err);
    }
};


module.exports = {
    getMe,
    updateMe,
    getAllUsers,
    getUserById,
    deleteUser
};