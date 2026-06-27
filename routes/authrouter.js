const { register, login } = require("../middlewares/auth");
const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);

module.exports = router;
