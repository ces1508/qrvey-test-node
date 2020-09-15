const router = require('express').Router()
const { body } = require('express-validator')
const { requestValidator } = require('../middlewares')
const { SessionController } = require('../controllers')

router.post('/', [
  body('email').isEmail().withMessage('the email need to be a valid email address'),
  body('password').isLength({ min: 8 }).withMessage('the password should have minimum 8 characters')
], requestValidator, SessionController.create)

module.exports = router
