const { validate } = require('../lib/token')
const { errorCodes: { INVALID_TOKEN } } = require('../config/constanst')

const unAuthorizationResponse = {
  status: 401,
  errors: 'you need to send a valid token',
  code: INVALID_TOKEN
}

const validateToken = async (req, res, next) => {
  let hasError = false
  let decode = null
  const authorizationHeader = req.headers.authorization || req.headers.Authorization
  if (authorizationHeader) {
    const [tokenType, token] = authorizationHeader.split(' ')
    if (tokenType.toLowerCase() !== 'bearer') hasError = true
    decode = await validate(token)
    if (!decode) hasError = true
  } else {
    hasError = true
  }
  if (hasError) return res.status(unAuthorizationResponse.status).json({ ...unAuthorizationResponse })
  req.user = { id: decode.userId, email: decode.email }
  next()
}

module.exports = validateToken
