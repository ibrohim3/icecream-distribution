const { Router } = require("express")
const product = Router()

const { createProducts, getAllProducts } = require("../controller/product.controller")
const { validate } = require("../middlewares/validate")
const { createProductValidation, updateProductValidation } = require("../validation/product.validation")

product.post("/", validate(createProductValidation, "body"), createProducts)
product.get("/", getAllProducts)

module.exports = { product }