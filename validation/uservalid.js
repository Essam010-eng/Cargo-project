const joi = require("joi")

const uservalid = joi.object({
    username : joi.string().required(),
    password : joi.string().required().min(3).max(10),
    email : joi.email().required()
})


module.exports = uservalid;