const { Schema, model } = require('mongoose')

const storeSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true, trim: true
    },
    address: { type: String },
    // phone_number: { type: String, required: true }
}, { timestamps: true })

const Store = model("store", storeSchema)
module.exports = { Store }