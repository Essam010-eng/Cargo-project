const AppError = require("../helpers/globalerrorehandler");

const checkRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new AppError(401, "Unauthorized"));
        }

        if (!roles.includes(req.user.role)) {
            return next(new AppError(403, "Forbidden"));
        }

        next();
    };
};

module.exports = checkRole;