const { validationResult } = require('express-validator')
const { errorCodes: { INVALID_DATA } } = require('../config/constanst')

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array(), code: INVALID_DATA })
  next()
}

module.exports = validate
