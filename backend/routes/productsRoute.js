const { Router } = require("express")
const product = Router()

const { createProducts, getAllProducts, updateProducts, deleteProducts } = require("../controller/product.controller")
const { validate } = require("../middlewares/validate")
const { createProductValidation, updateProductValidation } = require("../validation/product.validation")

product.post("/", validate(createProductValidation, "body"), createProducts)
product.get("/", getAllProducts)
product.patch("/:id", validate(updateProductValidation, "body"), updateProducts)
product.delete("/:id", deleteProducts)
module.exports = { product }