const { Schema, model } = require('mongoose');

const productsSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    isActive: { type: Boolean, default: true }
});

const Products = model("products", productsSchema)
module.exports = { Products }
