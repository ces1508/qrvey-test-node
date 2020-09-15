const { expect } = require('chai')
const request = require('supertest')
const app = require('../../server')
const { User, Project, Task } = require('../../models')
const db = require('../../lib/db')
const { generate: generateToken } = require('../../lib/token')
const { errorCodes: { INVALID_TOKEN } } = require('../../config/constanst')

let _token = null
let _user = null
describe('/projects', () => {

  before(async () => {
    await db.connect()
    await User.remove({})
    await Project.remove({})
    await Task.remove({})
    _user = await User.create({ email: 'user-projects@test.com', password: '1231313' })
    _token = await generateToken({ email: _user.email, userId: _user.id })
  })

  it ('GET / without token', async () => {
    const { body, statusCode } = await request(app).get('/projects')
    expect(statusCode).to.be.equal(401)
    expect(body).to.haveOwnProperty('code')
    expect(body.code).to.be.equal(INVALID_TOKEN)
  })

  it ('GET /', async () => {
    const { statusCode, body } = await request(app).get('/projects').set('Authorization', `bearer ${_token}`)
    expect(statusCode).to.be.equal(200)
    expect(body).to.haveOwnProperty('projects')
    expect(body.projects).to.be.a('array')
    expect(body).to.haveOwnProperty('isLastPage')
    expect(body).to.haveOwnProperty('totalRecords')
    expect(body.totalRecords).to.be.a('number')
    expect(body.totalRecords).to.be.equal(0)
    expect(body.isLastPage).to.be.equal(true)
  })

  it ('GET /', async () => {
    let projects = []
    for (let i = 0; i < 35; i++) {
      projects.push({ name: `project ${i}`, userId: _user.id })
    }
    await Project.create(projects)
    const { statusCode, body } = await request(app).get('/projects').set('Authorization', `bearer ${_token}`)
    expect(statusCode).to.be.equal(200)
    expect(body).to.haveOwnProperty('projects')
    expect(body.projects).to.be.a('array')
    expect(body).to.haveOwnProperty('isLastPage')
    expect(body).to.haveOwnProperty('totalRecords')
    expect(body.totalRecords).to.be.a('number')
    expect(body.pages).to.be.equal(3)
    expect(body.totalRecords).to.be.equal(35)
    expect(body.isLastPage).to.be.equal(false)
    const project = body.projects[0]
    expect(project).to.haveOwnProperty('tasks')
    expect(project.tasks).to.be.a('array')
    expect(project).to.haveOwnProperty('_id')
    expect(project).to.haveOwnProperty('name')
    expect(project).to.haveOwnProperty('totalTasks')
    expect(project).to.haveOwnProperty('totalTime')
    expect(project.totalTasks).to.be.a('number')
    expect(project.totalTime).to.be.a('number')
  })

  after(async () => {
    await Project.remove({})
  })
})
