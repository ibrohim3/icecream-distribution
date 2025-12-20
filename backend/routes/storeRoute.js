const { Router } = require("express")
const store = Router()

const {
    createStore,
    getAllStores,
    getStoreById,
    updateStore,
    deleteStore
} = require("../controller/store.controller")
const { validate } = require("../middlewares/validate")
const { createStoreValidation, updateStoreValidation } = require("../validation/store.validation")

store.post("/", validate(createStoreValidation, "body"), createStore)
store.get("/", getAllStores)
store.get("/:id", getStoreById)
store.patch("/:id", validate(updateStoreValidation, "body"), updateStore)
store.delete("/:id", deleteStore)


module.exports = { store }