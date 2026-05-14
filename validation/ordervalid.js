const joi = require("joi");

const ordervalid = joi.object({
    user : joi.string().required(),
    product : joi.array().itmas(
        joi.object({
            quantity : joi.number().min(1),
            price : joi.number().min()
        })
    ),
    tatalprice : joi.number().min(0)
})


module.exports = ordervalid ; 