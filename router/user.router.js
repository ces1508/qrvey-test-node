const router = require('express').Router()
const { body } = require('express-validator')
const { UserController } = require('../controllers')
const { requestValidator } = require('../middlewares')

router.post('/',[
  body('email').isEmail(),
  body('password').isLength({ min: 8 }).withMessage('the password should have minimum 8 characters')
], requestValidator, UserController.create)
router.get('/', UserController.index)

module.exports = router