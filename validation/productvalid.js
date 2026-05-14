const joi =require("joi");


const productvalid = joi.object({
    name : joi.string().required(),
    description : joi.string().required(),
    category : joi.string().required(),
    price : joi.number().required(),
    colorimage : joi.array().items(
        joi.object({
            color : joi.string(),
            images : joi.array().items(joi.string())
        })
    ),
    stock : joi.number().required(),
    owner : joi.string().required(),
    carsforporduct : joi.array().items(
        joi.object({
            name : joi.string().required()
        })
    )
})