const { encrypt } = require('../lib/password')
const { User } = require('../models')

class UserController {
  async create (req, res) {
    const { email, password } = req.body
    try {
      const userAlreadyExits = await User.findOne({ email })
      if (userAlreadyExits) {
        return res.status(400).json({
          status: 400,
          error: 'user already exits, please login'
        })
      }
      const securePassword = await encrypt(password)
      const user = await User.create({ email, password: securePassword })
      res.status(201).json({ emai: user.email })
    } catch (e) {
      throw e
    }
  }

  index (req, res) {
    try {

    } catch (e) {

    }
    res.json({ users: [] })
  }
}

module.exports = new UserController()
