const requestValidator = require('./requestValidator.middleware')
const validateToken = require('./validateToken.middleware')

module.exports = {
  requestValidator,
  validateToken
}
