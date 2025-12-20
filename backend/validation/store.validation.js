const Joi = require("joi")

const createStoreValidation = Joi.object({
    name: Joi.string().pattern(/^[A-Za-z\s]+$/).trim().required().min(3),
    address: Joi.string().trim().required(),
    phone_number: Joi.string().pattern(/^\+998\d{9}$/).required()
})

const updateStoreValidation = Joi.object({
    name: Joi.string().pattern(/^[A-Za-z\s]+$/).trim().optional().min(3),
    address: Joi.string().trim().optional(),
    phone_number: Joi.string().pattern(/^\+998\d{9}$/).optional()
})

module.exports = { createStoreValidation, updateStoreValidation }