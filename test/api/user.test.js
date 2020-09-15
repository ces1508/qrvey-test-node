const { expect } = require('chai')
const request = require('supertest')
const app = require('../../server')
const { User } = require('../../models')
const { encrypt } = require('../../lib/password')
const { errorCodes: { USER_EXITS, INVALID_DATA } } = require('../../config/constanst')
const db = require('../../lib/db')

const userData = {
  email: 'test@test.com',
  password: '1234567890'
}

describe('API /users', () => {
  before(async () => {
    await db.connect()
    await User.remove({})
    const securePassword = await encrypt(userData.password)
    await User.create({ email: userData.email, password: securePassword })
  })

  it('POST / invalid data', async () => {
    const response = await request(app).post('/users').expect(400).send()
    const { body, statusCode } = response
    expect(statusCode).to.be.equal(400)
    expect(body.errors).to.be.a('array')
    const [email, password] = body.errors
    expect(email).to.be.a('object')
    expect(email).to.have.ownProperty('msg')
    expect(email).to.have.ownProperty('param')
    expect(email).to.have.ownProperty('location')
    expect(password).to.be.a('object')
    expect(password).to.have.ownProperty('msg')
    expect(password).to.have.ownProperty('param')
    expect(password).to.have.ownProperty('location')
    expect(body.code).to.equal(INVALID_DATA)
  })

  it('POST / exits users', async () => {
    const response = await request(app).post('/users').send(userData)
    const { body, statusCode } = response
    expect(statusCode).to.be.equal(400)
    expect(body).to.have.ownProperty('error')
    expect(body).to.have.ownProperty('code')
    expect(body.code).to.be.equal(USER_EXITS)
  })

  it('POST / should create a new user', async () => {
    const newUser = { email: 'example@test.com', password: userData.password }
    const response = await request(app).post('/users').send(newUser)
    const { body, statusCode } = response
    expect(statusCode).to.be.equal(201)
    expect(body).not.to.haveOwnProperty('errors')
    expect(body).not.to.haveOwnProperty('error')
    expect(body).to.have.ownProperty('user')
    expect(body.user).to.have.ownProperty('email')
    expect(body.user).to.have.ownProperty('id')
    expect(body.user.email).to.be.equal(newUser.email)
    expect(body.user).not.to.have.ownProperty('password')
  })
})
