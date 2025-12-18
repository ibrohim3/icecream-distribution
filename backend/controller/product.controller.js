const { Products } = require("../model/productsSchema");

const createProducts = async (req, res) => {
    try {
        const { name, price } = req.body;
        let product = await Products.findOne({ name: name.trim() });
        if (product) {
            return res.status(200).json({
                success: true,
                message: "Bu nomdagi product allaqachon mavjud",
                product
            });
        }
        product = await Products.create({ name, price });
        return res.status(201).json({
            success: true,
            message: "Yangi product muvaffaqiyatli yaratildi",
            product
        });
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
        return res.status(200).json({
            success: true,
            count: products.length,
            products,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server xatosi",
            error: error.message
        });
    }
}

// update
const updateProducts = async (req, res) => {
    try {
        const { id } = req.params
        const { name, price } = req.body
        const updateData = { name, price }
        const updatedProduct = await Products.findByIdAndUpdate(
            id, updateData, { new: true }
        )
        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product topilmadi."
            })
        }
        return res.status(200).json({
            success: true,
            message: "Yangilandi",
            updatedProduct
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server xatosi",
            error: error.message
        })
    }
}

// delete
const deleteProducts = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Products.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product topilmadi."
            });
        }
        return res.status(200).json({
            success: true,
            message: "Product o'chirildi",
            deletedProduct
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
    getAllProducts,
    updateProducts,
    deleteProducts
};
