const jwt = require("jsonwebtoken");
const User = require("../models/user");
const AppError = require("../helpers/globalerrorehandler");
require("dotenv").config();

const checkauth = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return next(new AppError(401, "You are not logged in, please log in to get access"));
        }

        const decoded = jwt.verify(token, process.env.secret_key);

        const finduser = await User.findById(decoded.id);

        if (!finduser) {
            return next(new AppError(401, "The user belonging to this token no longer exists"));
        }


        req.user = finduser;

        next();
    } catch (err) {
        return next(new AppError(401, "Invalid token or token expired"));
    }
};

module.exports = checkauth;