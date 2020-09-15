const { Project } = require('../models')
const onPaginate = require('../lib/paginate')

class ProjectController {
  async index (req, res) {
    const { page = 1 } = req.query
    const quantity = await Project.countDocuments({ userId: req.user.id })
    const { skip, pages, isLastPage } = onPaginate(quantity, 15, page)
    const projects = await Project.find({ userId: req.user.id }).populate('tasks').populate('totalTasks').skip(skip).limit(15)
    return res.json({ projects, pages, isLastPage, totalRecords: quantity })
  }

  async find (req, res) {
    const { id } = req.params
    const project = await Project.findById(id).populate('tasks').populate('totalTasks')
    res.json({ project })
  }

  async create (req, res) {
    const { name } = req.body
    const { id: userId } = req.user
    await Project.create({ name, userId })
    res.status(201).json({
      status: 'created',
      project: {
        name
      }
    })
  }
}

module.exports = new ProjectController()
