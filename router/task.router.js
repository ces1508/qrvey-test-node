const router = require('express').Router({ mergeParams: true })
const { body, param } = require('express-validator')
const { requestValidator } = require('../middlewares')
const { TaskController } = require('../controllers')

router.post('/', [
  param('projectId').isMongoId(),
  body('title').isString().optional(),
  body('body').isString()
],requestValidator, TaskController.create)
router.get('/', TaskController.index)
router.get('/:id', TaskController.find)
router.put('/:id/active', TaskController.updateStatus)
router.put('/:id/pause', TaskController.updateStatus)
router.put('/:id/finish', TaskController.updateStatus)

module.exports = router