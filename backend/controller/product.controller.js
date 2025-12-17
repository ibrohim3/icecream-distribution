const { count } = require("console");
const { Products } = require("../model/productsSchema");

// Create product yoki quantity qo'shish
const createProducts = async (req, res) => {
    try {
        const { name, price, quantity } = req.body;
        let product = await Products.findOne({ name });
        if (product) {
            product.quantity += quantity;
            await product.save();
            return res.status(200).json({
                success: true,
                message: "Mavjud productga quantity qo'shildi",
                product
            });
        } else {
            product = await Products.create({ name, price, quantity });
            return res.status(201).json({
                success: true,
                message: "Yangi product qo'shildi",
                product
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server xatosi",
            error: error.message
        });
    }
}

// Get all products
const getAllProducts = async (req, res) => {
    try {
        const products = await Products.find();
        const totalPrice = products.length > 0
            ? products.map(p => p.price * p.quantity).reduce((a, b) => a + b, 0)
            : 0;
        return res.status(200).json({
            success: true,
            count: products.length,
            products,
            totalPrice
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server xatosi",
            error: error.message
        });
    }
}
module.exports = {
    createProducts,
    getAllProducts
};
