const { Router } = require("express")
const store = Router()

const {
    createStore,
    getAllStores,
    getStoreById,
    updateStore,
    deleteStore
} = require("../controller/store.controller")

store.post("/", createStore)
store.get("/", getAllStores)
store.get("/:id", getStoreById)
store.patch("/:id", updateStore)
store.delete("/:id", deleteStore)


module.exports = { store }