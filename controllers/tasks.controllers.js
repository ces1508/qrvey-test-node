const { Task, Project } = require('../models')
const onPaginate = require('../lib/paginate')
const parseState = require('../lib/taskStateParse')

const _limit = 15

class TaskController {
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

  async index (req, res) {
    try {
      const { params: { projectId }, query: { page = 1 } } = req
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

  async updateStatus (req, res) {
    const { params: { id }, path } = req
    const state = path.split('/')[2]
    const newStatus = parseState(state)
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
