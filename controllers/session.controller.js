const { User } = require('../models')
const { generate } = require('../lib/token')
const { compare } = require('../lib/password')

class SessionController {
  async create (req, res) {
    try {
      const { email, password } = req.body
      const user = await User.findOne({ email })
      if (!user) return res.status(400).json({ error: 'invalid email or password, please check your credentials', code: 401 })
      const validatePassword = await compare(user.password, password)
      if (!validatePassword) return res.status(400).json({ error: 'invalid email or password, please check your credentials', code: 401 })
      const token = generate({ email, userId: user.id })
      res.status(201).json({
        token,
        sucess: true
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