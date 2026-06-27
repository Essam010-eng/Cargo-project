const express = require("express");
const router = express.Router();

const {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus
} = require("../controller/ordercontroller");

const checkauth= require("../middlewares/checkauth");
const checkrole = require("../middlewares/checkrole");

router.post("/", checkauth, createOrder);

router.get("/my", checkauth, getMyOrders);

router.get("/", checkauth, checkrole("admin"), getAllOrders);

router.patch("/:id", checkauth, checkrole("admin"), updateOrderStatus);


module.exports = router;