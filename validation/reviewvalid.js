const Joi = require("joi");

const reviewValid = Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().trim().max(500).optional()
    // user/product validated in controller/middleware
});

module.exports = reviewValid;
