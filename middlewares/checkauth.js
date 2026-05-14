const jwt = require("jsonwebtoken");
const User = require("../models/user"); // يفضل تسمية المتغير User (حرف كبير)
const AppError = require("../helpers/globalerrorehandler");
require("dotenv").config();

const checkauth = async (req, res, next) => {
    try {
        let token;

        // 1. استخراج التوكن من الهيدر
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return next(new AppError(401, "You are not logged in, please log in to get access"));
        }

        // 2. التحقق من صحة التوكن
        const decoded = jwt.verify(token, process.env.secret_key);

        // 3. البحث عن المستخدم (التصحيح هنا)
        // نستخدم findById ونمرر له decoded.id (الذي وضعناه في التوكن عند الـ login)
        const finduser = await User.findById(decoded.id);

        if (!finduser) {
            return next(new AppError(401, "The user belonging to this token no longer exists"));
        }

        // 4. تخزين بيانات المستخدم في الـ request لاستخدامها لاحقاً
        req.user = finduser;

        next();
    } catch (err) {
        // في حال كان التوكن منتهي الصلاحية أو تم التلاعب به
        return next(new AppError(401, "Invalid token or token expired"));
    }
};

module.exports = checkauth;