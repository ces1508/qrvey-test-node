const { encrypt } = require('../lib/password')
const { errorCodes: { USER_EXITS } } = require('../config/constanst')
const { User } = require('../models')

class UserController {
  async create (req, res) {
    const { email, password } = req.body
    const userAlreadyExits = await User.findOne({ email })
    if (userAlreadyExits) {
      return res.status(400).json({
        status: 400,
        code: USER_EXITS,
        error: 'user already exits, please login'
      })
    }
    const securePassword = await encrypt(password)
    const user = await User.create({ email, password: securePassword })
    res.status(201).json({ user: { email: user.email, id: user.id }, created: true })
  }
}

module.exports = new UserController()
