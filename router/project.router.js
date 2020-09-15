const router = require('express').Router()
const { body, param } = require('express-validator')
const { requestValidator } = require('../middlewares')
const { ProjectController } = require('../controllers')
const TaskRouter = require('./task.router')

router.get('/', ProjectController.index)

router.get('/:id', [
  param('id').isMongoId()
], requestValidator, ProjectController.find)

router.post('/', [
  body('name').isString()
], requestValidator, ProjectController.create)

router.use('/:projectId/tasks', TaskRouter)

module.exports = router
