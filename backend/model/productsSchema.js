const { Schema, model } = require('mongoose');

const productsSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 0 }
});

const Products = model("products", productsSchema)
module.exports = { Products }
