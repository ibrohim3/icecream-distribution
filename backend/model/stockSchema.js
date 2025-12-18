const { Schema, model } = require("mongoose");

const stockSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: "products",
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    totalPrice: {
        type: Number
    }
},
    { timestamps: true }
);

stockSchema.pre("save", async function () {
    const { Products } = require("./productsSchema")
    const product = await Products.findById(this.productId)
    if (!product) {
        throw new Error("Product topilmadi")
    }
    this.totalPrice = this.quantity * product.price
})



const Stock = model("Stock", stockSchema);
module.exports = { Stock };
