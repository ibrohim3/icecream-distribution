const express = require('express');
const { connect } = require("mongoose");
const cors = require('cors');
require('dotenv').config();


const app = express()

app.use(cors())
app.use(express.json())

const URL = process.env.MONGO_URL

async function connectToDb() {
    try {
        await connect(process.env.MONGO_URL)
        console.log("MongoDB ga ulandi");
    } catch (error) {
        console.error("MongoDB ga ulanishda xato yuz berdi: ", error.message);
    }
}
connectToDb()

const PORT = process.env.PORT || 2000
app.listen(PORT, () => {
    console.log(`Server shu portda ishga tushdi http://localhost:${PORT}`);
})

const { product } = require("./routes/productsRoute")
const { stock } = require("./routes/stockRoute")
const { store } = require("./routes/storeRoute")
const { router } = require("./routes/storeSupplyRoute");
const { report } = require('./routes/reportRoute');
app.use("/api/products", product)
app.use("/api/stock", stock)
app.use("/api/store", store)
app.use("/api/storeSupply", router)
app.use("/api/report", report)
