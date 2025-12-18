const { Router } = require("express")
const report = Router()

const { getDailyReport, getMonthlyReport } = require("../controller/report.controller")

report.get("/daily", getDailyReport)
report.get("/monthly", getMonthlyReport)

module.exports = { report }