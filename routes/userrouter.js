const express = require("express");
const router = express.Router();

const checkauth = require("../middlewares/checkauth");
const checkrole = require("../middlewares/checkrole"); // لو عندك role system
const {
    getMe,
    updateMe,
    getAllUsers,
    getUserById,
    deleteUser
} = require("../controller/usercontroller");

// GET all users (admin فقط)
router.get(
    "/",
    checkauth,
    checkrole("admin"),
    getAllUsers
);

// GET single user (admin فقط)
router.get(
    "/:id",
    checkauth,
    checkrole("admin"),
    getUserById
);

// UPDATE user (user نفسه أو admin حسب تصميمك)
router.put(
    "/:id",
    checkauth,
    updateMe
);

router.get(
    "/:id",
    checkauth,
    getMe
);

// DELETE user (admin فقط)
router.delete(
    "/:id",
    checkauth,
    checkrole("admin"),
    deleteUser
);

module.exports = router;