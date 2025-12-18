const { Schema, model } = require("mongoose")

const storeSupplySchema = new Schema({
    storeId: { type: Schema.Types.ObjectId, ref: "store", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "products", required: true },
    unitPrice: { type: Number, required: true },
    quantity: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 }
}, { timestamps: true })

const StoreSupply = model("storeSupply", storeSupplySchema)
module.exports = { StoreSupply }