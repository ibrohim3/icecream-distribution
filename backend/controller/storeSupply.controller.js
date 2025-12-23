// controllers/StoreSupply.controller.js
const { StoreSupply } = require("../model/storeSupplySchema")
const { Stock } = require("../model/stockSchema")
const { Products } = require("../model/productsSchema")
const mongoose = require("mongoose")

// 1️⃣ Distribution (do‘konga product berish)

const distributeToStore = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { storeId, products, paidAmount = 0 } = req.body;

        if (!storeId || !products?.length)
            return res.status(400).json({ success: false, message: "storeId va products majburiy" });

        // 1️⃣ Jami summa
        const totalSalesAmount = products.reduce(
            (sum, p) => sum + p.totalAmount,
            0
        );

        if (paidAmount > totalSalesAmount)
            return res.status(400).json({ success: false, message: "Paid amount jami summadan katta bo'lishi mumkin emas" });

        const results = [];

        // 2️⃣ Productlar bo‘yicha
        for (const p of products) {
            const { productId, quantity, unitPrice, totalAmount } = p;

            // Stock
            const stock = await Stock.findOne({ productId }).session(session);
            if (!stock || stock.quantity < quantity)
                throw new Error("Omborda yetarli mahsulot yo'q");

            stock.quantity -= quantity;
            await stock.save({ session });

            // Paymentni proportional taqsimlash
            const productPaid =
                totalSalesAmount > 0
                    ? (totalAmount / totalSalesAmount) * paidAmount
                    : 0;

            // Supply = sotuv
            const supply = await StoreSupply.create(
                [{
                    storeId,
                    productId,
                    unitPrice,
                    quantity,
                    totalAmount,
                    paidAmount: productPaid
                }],
                { session }
            );

            results.push({
                productId,
                quantity,
                totalAmount,
                paidAmount: productPaid,
                debt: totalAmount - productPaid,
                remainingStock: stock.quantity
            });
        }

        await session.commitTransaction();

        res.status(201).json({
            success: true,
            message: "Sotuv muvaffaqiyatli amalga oshdi",
            totalSalesAmount,
            paidAmount,
            totalDebt: totalSalesAmount - paidAmount,
            data: results
        });

    } catch (e) {
        await session.abortTransaction();
        res.status(500).json({ success: false, message: e.message });
    } finally {
        session.endSession();
    }
};



// const distributeToStore = async (req, res) => {
//     try {
//         const { storeId, products, paidAmount = 0 } = req.body
//         if (!storeId || !products?.length)
//             return res.status(400).json({ success: false, message: "storeId va products majburiy" })

//         const results = []

//         for (const p of products) {
//             const { productId, quantity } = p
//             if (!productId || !quantity)
//                 return res.status(400).json({ success: false, message: "productId va quantity majburiy" })

//             const stock = await Stock.findOne({ productId })
//             if (!stock || stock.quantity < quantity)
//                 return res.status(400).json({ success: false, message: `${productId} uchun yetarli stock yo‘q` })

//             const product = await Products.findById(productId)
//             const unitPrice = product.price
//             const totalAmount = unitPrice * quantity

//             let supply = await StoreSupply.findOne({ storeId, productId })
//             if (supply) {
//                 supply.quantity += quantity
//                 supply.totalAmount += totalAmount
//                 const perProductPaid = paidAmount / products.length;
//                 supply.paidAmount += perProductPaid;

//                 await supply.save()
//             } else {
//                 supply = await StoreSupply.create({
//                     storeId,
//                     productId,
//                     unitPrice,
//                     quantity,
//                     totalAmount,
//                     paidAmount
//                 })
//             }

//             stock.quantity -= quantity
//             await stock.save()

//             results.push({
//                 productId,
//                 supplyId: supply._id,
//                 quantity: supply.quantity,
//                 totalAmount: supply.totalAmount,
//                 paidAmount: supply.paidAmount,
//                 remainingStock: stock.quantity
//             })
//         }

//         res.status(201).json({ success: true, message: "Products do‘konga berildi", data: results })
//     } catch (e) {
//         res.status(500).json({ success: false, message: e.message })
//     }
// }

// 2️⃣ Store summary (do‘kondagi productlar va qarz)
const getStoreProducts = async (req, res) => {
    try {
        const { storeId } = req.params
        const data = await StoreSupply.aggregate([
            { $match: { storeId: new mongoose.Types.ObjectId(storeId) } },
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "product"
                }
            },
            { $unwind: "$product" },
            {
                $project: {
                    name: "$product.name",
                    quantity: 1,
                    unitPrice: 1,
                    totalAmount: 1,
                    paidAmount: 1,
                    debt: { $max: [{ $subtract: ["$totalAmount", "$paidAmount"] }, 0] }
                }
            }
        ])
        const totalDebt = data.reduce((sum, item) => sum + item.debt, 0)
        res.json({ success: true, data })
    } catch (e) {
        res.status(500).json({ success: false, message: e.message })
    }
}

// 3️⃣ Pul to‘lash / qarzni kamaytirish
const payFromStore = async (req, res) => {
    try {
        const { supplyId, amount } = req.body
        const supply = await StoreSupply.findById(supplyId)
        if (!supply) return res.status(404).json({ success: false, message: "Supply topilmadi" })

        supply.paidAmount += amount
        await supply.save()

        res.json({
            success: true,
            message: "To'lov qabul qilindi",
            debt: Math.max(supply.totalAmount - supply.paidAmount, 0)
        })
    } catch (e) {
        res.status(500).json({ success: false, message: e.message })
    }
}

module.exports = { distributeToStore, getStoreProducts, payFromStore }
