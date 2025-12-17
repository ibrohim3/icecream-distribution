const validate = (schema, property = "body") => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req[property], {
            abortEarly: false
        })
        if (error) {
            return res.status(400).json({
                success: false,
                message: "Validate xatosi",
                error: error.details.map(e => e.message)
            })
        }
        req[property] = value
        next()
    }
}
module.exports = { validate }
