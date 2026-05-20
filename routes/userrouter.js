const express = require("express");
const router = express.Router();

const checkauth = require("../middlewares/checkauth");
const checkrole = require("../middlewares/checkrole"); 
const {
    getMe,
    updateMe,
    getAllUsers,
    getUserById,
    deleteUser
} = require("../controller/usercontroller");

router.get(
    "/",
    checkauth,
    checkrole("admin"),
    getAllUsers
);

router.get(
    "/:id",
    checkauth,
    checkrole("admin"),
    getUserById
);

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


router.delete(
    "/:id",
    checkauth,
    checkrole("admin"),
    deleteUser
);

module.exports = router;