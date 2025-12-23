const { Router } = require("express")
const router = Router()

const { distributeToStore, payFromStore, getStoreTotalDebt } = require("../controller/storeSupply.controller")

router.post("/distribute", distributeToStore)
router.get("/:storeId", getStoreTotalDebt)
router.post("/pay", payFromStore)

module.exports = { router }
