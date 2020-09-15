const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/secrets')

const generate = payload => {
  const jwt_options = {expiresIn: '15m' }
  try {
    const token = jwt.sign({ ...payload }, JWT_SECRET, { ...jwt_options })
    return token
  } catch (e) {
    const error = new Error()
    error.status = 500
    error.code = 'GEN_TOKEN_ERROR'
    error.message = err.message
  }
}


const validate = async token => {
  try {
    const isValid =  await jwt.verify(token, JWT_SECRET)
    return isValid
  } catch (e) {
    const error = new Error()
    error.status = 500
    error.code = 'VALIDATE_TOKEN_ERROR'
    error.message = error.message
  }
}

module.exports = {
  generate,
  validate
}
