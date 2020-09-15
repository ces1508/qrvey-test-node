const { User } = require('../models')
const { generate } = require('../lib/token')
const { compare } = require('../lib/password')
const { errorCodes: { INVALID_CREDENTIALS } } = require('../config/constanst')

class SessionController {
  async create (req, res) {
    try {
      const { email, password } = req.body
      const user = await User.findOne({ email })
      if (!user) return res.status(400).json({ error: 'invalid email or password, please check your credentials', code: INVALID_CREDENTIALS })
      const validatePassword = await compare(user.password, password)
      if (!validatePassword) return res.status(400).json({ error: 'invalid email or password, please check your credentials', code: INVALID_CREDENTIALS })
      const token = generate({ email, userId: user.id })
      res.status(201).json({
        token,
        success: true
      })
    } catch (e) {
      const error = new Error()
      error.code = 500
      error.message = 'INTERNAL SERVER'
      throw error
    }
  }
}

module.exports = new SessionController()
