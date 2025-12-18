const { Schema, model } = require('mongoose')

const storeSchema = new Schema({
    name: { ype: String, required: true, unique: true },
    address: { type: String }
}, { timestamps: true })

const Store = model("store", storeSchema)
module.exports = { Store }