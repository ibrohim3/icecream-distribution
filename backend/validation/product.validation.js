const Joi = require("joi")

const createProductValidation = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().integer().positive().required(),
    // quantity: Joi.number().integer().positive().required()
})

const updateProductValidation = Joi.object({
    name: Joi.string().optional(),
    price: Joi.number().integer().positive().optional(),
    // quantity: Joi.number().integer().positive().optional()
})

module.exports = { createProductValidation, updateProductValidation }
