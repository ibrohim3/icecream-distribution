const mongoose = require("mongoose")
const { StoreSupply } = require("../model/storeSupplySchema")

// Daily Report
const getDailyReport = async (req, res) => {
    try {
        const { date } = req.query

        // Sana tekshiruvi
        if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return res.status(400).json({
                success: false,
                message: "Invalid date format. Use YYYY-MM-DD"
            })
        }

        const start = new Date(date)
        start.setHours(0, 0, 0, 0)

        const end = new Date(date)
        end.setHours(23, 59, 59, 999)

        const data = await StoreSupply.aggregate([
            { $match: { createdAt: { $gte: start, $lte: end } } },
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "product"
                }
            },
            { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    storeId: 1,
                    productName: "$product.name",
                    quantity: 1,
                    totalAmount: 1,
                    paidAmount: 1,
                    debt: { $subtract: ["$totalAmount", "$paidAmount"] }
                }
            }
        ])

        res.json({ success: true, data })
    } catch (e) {
        res.status(500).json({ success: false, message: e.message })
    }
}

// Monthly Report
const getMonthlyReport = async (req, res) => {
    try {
        const { month } = req.query // YYYY-MM

        // Sana tekshiruvi
        if (!month || !/^\d{4}-\d{2}$/.test(month)) {
            return res.status(400).json({
                success: false,
                message: "Invalid month format. Use YYYY-MM"
            })
        }

        const [year, m] = month.split("-").map(Number)
        const start = new Date(year, m - 1, 1)
        start.setHours(0, 0, 0, 0)

        const end = new Date(year, m, 0)
        end.setHours(23, 59, 59, 999)

        const data = await StoreSupply.aggregate([
            { $match: { createdAt: { $gte: start, $lte: end } } },
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "product"
                }
            },
            { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    storeId: 1,
                    productName: "$product.name",
                    quantity: 1,
                    totalAmount: 1,
                    paidAmount: 1,
                    debt: { $subtract: ["$totalAmount", "$paidAmount"] }
                }
            }
        ])

        res.json({ success: true, data })
    } catch (e) {
        res.status(500).json({ success: false, message: e.message })
    }
}

module.exports = { getDailyReport, getMonthlyReport }
