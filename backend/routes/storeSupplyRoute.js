const { Router } = require("express")
const router = Router()

const { distributeToStore, getStoreProducts, payFromStore } = require("../controller/storeSupply.controller")

router.post("/distribute", distributeToStore)
router.get("/:storeId", getStoreProducts)
router.post("/pay", payFromStore)

module.exports = { router }
