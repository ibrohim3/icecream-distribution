const { Store } = require("../model/storeSchema")

// Create Store
const createStore = async (req, res) => {
    try {
        const { name, address } = req.body
        if (!name) {
            return res.status(400).json({ success: false, message: "Store nomi majburiy" })
        }
        const exists = await Store.findOne({ name })
        if (exists) {
            return res.status(409).json({ success: false, message: "Bunday store allaqachon mavjud" })
        }
        const store = await Store.create({ name, address })
        res.status(201).json({ success: true, message: "Store yaratildi", data: store })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// get all
const getAllStores = async (req, res) => {
    try {
        const stores = await Store.find().sort({ createdAt: -1 })
        if (!stores) {
            return res.status(404).json({ success: false, message: "Stores topilmadi" })
        }
        return res.status(200).json({ success: true, count: stores.length, stores })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

// get one
const getStoreById = async (req, res) => {
    try {
        const { id } = req.params
        const store = await Store.findById(id)
        if (!store) {
            return res.status(404).json({ success: false, message: "Store topilmadi" })
        }
        return res.status(200).json({ success: true, data: store })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// update
const updateStore = async (req, res) => {
    try {
        const { id } = req.params
        const { name, address } = req.body
        const store = await Store.findById(id)
        if (!store) {
            return res.status(404).json({ success: false, message: "Store topilmadi" })
        }
        if (name && name !== store.name) {
            const existing = await Store.findOne({ name })
            if (existing) {
                return res.status(409).json({ success: false, message: "Bunday name allaqachon mavjud" })
            }
            store.name = name
        }
        if (address !== undefined) store.address = address
        await store.save()
        return res.status(200).json({
            success: true, message: "Store yangilandi", data: store
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// delete 
const deleteStore = async (req, res) => {
    try {
        const { id } = req.params
        const store = await Store.findByIdAndDelete(id)
        if (!store) {
            return res.status(404).json({ success: false, message: "Store topilmadi" })
        }
        return res.status(200).json({ success: true, message: "Store o‘chirildi" })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}
module.exports = {
    createStore,
    getAllStores,
    getStoreById,
    updateStore,
    deleteStore
}