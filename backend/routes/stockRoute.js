const { Router } = require("express")
const stock = Router()

const {
    addStock,
    getAllStocks,
    getStockById,
    updateStock,
    deleteStock,
    getWarehouseSummary
} = require("../controller/stock.controller")

stock.get("/warehouse", getWarehouseSummary)
stock.post("/", addStock)
stock.get("/", getAllStocks)
stock.get("/:id", getStockById)
stock.put("/:id", updateStock)
stock.delete("/:id", deleteStock)

module.exports = { stock }