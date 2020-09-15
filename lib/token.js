const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/secrets')

const generate = payload => {
  const jwtOptions = { expiresIn: '15m' }
  try {
    const token = jwt.sign({ ...payload }, JWT_SECRET, { ...jwtOptions })
    return token
  } catch (e) {
    const error = new Error()
    error.status = 500
    error.code = 'GEN_TOKEN_ERROR'
    error.message = e.message
  }
}

const validate = async token => {
  try {
    const isValid = await jwt.verify(token, JWT_SECRET)
    return isValid
  } catch (e) {
    const error = new Error()
    error.status = 500
    error.code = 'VALIDATE_TOKEN_ERROR'
    error.message = e.message
  }
}

module.exports = {
  generate,
  validate
}
