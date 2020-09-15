const { Project } = require('../models')
const onPaginate = require('../lib/paginate')

class ProjectController {
  async index (req, res) {
    try {
      const { page = 1 } = req.query
      const quantity = await Project.countDocuments({ userId: req.user.id })
      const { skip, pages, isLastPage } =  onPaginate(quantity, 15, page)
      let projects = await Project.find({ userId: req.user.id }).populate('tasks').populate('totalTasks').skip(skip).limit(15)
      return res.json({ projects, pages, isLastPage, totalRecords: quantity })
    } catch (e) {
      throw e
    }
  }

  async find(req, res) {
    try {
      const { id } = req.params
      const project = await Project.findById(id).populate('tasks').populate('totalTasks')
      res.json({ project })
    } catch (e) {
      throw e
    }
  }

  async create (req, res) {
    try {
      const { name } = req.body
      const { id: userId } = req.user
      await Project.create({ name, userId })
      res.status(201).json({
        status: 'created',
        project: {
          name
        }
      })
    } catch (e) {
      throw e
    }
  }
}

module.exports = new ProjectController()
