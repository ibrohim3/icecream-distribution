const { Stock } = require("../model/stockSchema")
const { Products } = require("../model/productsSchema")

const addStock = async (req, res) => {
    try {
        const { productId, quantity } = req.body
        if (!productId || !quantity) {
            return res.status(400).json({
                success: false,
                message: "productId va quantity majburiy"
            })
        }
        const product = await Products.findById(productId)
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product topilmadi"
            })
        }
        let stock = await Stock.findOne({ productId })
        if (stock) {
            stock.quantity += quantity
            await stock.save()
            return res.status(200).json({
                success: true,
                message: "Stock yangilandi",
                data: stock
            })
        } else {
            stock = await Stock.create({
                productId,
                quantity
            })
            return res.status(201).json({
                success: true,
                message: "Stock qo‘shildi",
                data: stock
            })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server xatosi",
            error: error.message
        })
    }
}
// get list
const getAllStocks = async (req, res) => {
    try {
        const stocks = await Stock.find()
            .populate("productId", "name buyPrice sellPrice")
            .sort({ createdAt: -1 });

        return res.json({
            success: true,
            count: stocks.length,
            data: stocks
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// get stock
const getStockById = async (req, res) => {
    try {
        const stock = await Stock.findById(req.params.id)
            .populate("productId", "name buyPrice sellPrice");

        if (!stock) {
            return res.status(404).json({
                success: false,
                message: "Stock topilmadi"
            });
        }
        return res.json({
            success: true,
            data: stock
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// update
const updateStock = async (req, res) => {
    try {
        const { quantity } = req.body;
        const stock = await Stock.findById(req.params.id);
        if (!stock) {
            return res.status(404).json({
                success: false,
                message: "Stock topilmadi"
            });
        }
        stock.quantity = quantity;
        await stock.save();
        return res.json({
            success: true,
            message: "Stock yangilandi",
            data: stock
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message
        });
    }
}

// delete
const deleteStock = async (req, res) => {
    try {
        const stock = await Stock.findByIdAndDelete(req.params.id);
        if (!stock) {
            return res.status(404).json({
                success: false,
                message: "Stock topilmadi"
            });
        }
        return res.json({
            success: true,
            message: "Stock o‘chirildi"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
module.exports = {
    addStock,
    getAllStocks,
    getStockById,
    updateStock,
    deleteStock
};