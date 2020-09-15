const { Task , Project } = require('../models')
const onPaginate = require('../lib/paginate')

const _limit = 15
const _ACTIVE_STATE = 'ACTIVE'
const _PAUSE_STATE = 'PAUSED'
const _FINISHED_STATE = 'FINISHED'

class TaskController {

  _parseState (state) {
    switch(state) {
      case 'active':
        return _ACTIVE_STATE
      case 'pause':
        return _PAUSE_STATE
      case 'finish':
        return _FINISHED_STATE
      default:
        return _ACTIVE_STATE
    }
  }

  async find (req, res) {
    const { id } = req.params
    try {
      const task = await Task.findById(id)
      res.json({ task })
    } catch (e) {
      const error = new Error()
      error.message = e.message
      error.code = 500
      throw error
    }
  }
  async create (req, res) {
    const { projectId } = req.params
    const { title, body, hoursToExpired, minutesToExpired, secondsToExpired } = req.body
    try {
      const task = await Task.create({
        title,
        body,
        hoursToExpired,
        minutesToExpired,
        secondsToExpired,
        project: projectId
      })
      const project = await Project.findById(projectId)
      project.tasks.push(task)
      await project.save()
      res.status(201).json({
        created: true,
        task: {
          id: task.id,
          name: task.title,
          description: task.body
        }
      })
    } catch (e) {
      const error = new Error()
      error.message = e.message
      error.code = 500
      throw error
    }
  }
  async index(req, res) {
    try {
      const { projectId } = req.params
      const { page = 1 } = req.query
      const quantity = await Task.countDocuments({ project: projectId })
      const { pages, skip, isLastPage } = onPaginate(quantity, _limit, page)
      const tasks = await Task.find({ project: projectId }).skip(skip).limit(15)
      res.json({ tasks, pages, isLastPage, totalRecords: quantity })
    } catch (e) {
      const error = new Error()
      error.message = e.message
      error.code = 500
      throw error
    }
  }
  updateStatus = async (req, res) => {
    const { params: { id }, path } = req
    const state = path.split('/')[2]
    const newStatus = this._parseState(state)
    console.log(state)
    try {
      const tasks = await Task.findOneAndUpdate({ _id: id }, { state: newStatus }, { new: true })
      res.json({ tasks })
    } catch (e) {
      const error = new Error()
      error.message = e.message
      error.code = 500
      throw error
    }
  }
}

module.exports = new TaskController()