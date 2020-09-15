const request = require('supertest')
const { expect } = require('chai')
const mongoose = require('mongoose')
const { User } = require('../../models')
const { encrypt } = require('../../lib/password')
const app = require('../../server')
const {
  DATABASE_HOST,
  DATABASE_USER,
  DATABASE_USER_PASSWORD,
  DATABASE_NAME
} = require('../../config/secrets')

describe('API /session', () => {
  before((done) => {
    mongoose.connect(`mongodb://${DATABASE_HOST}`, {
      user: DATABASE_USER,
      pass: DATABASE_USER_PASSWORD,
      db: DATABASE_NAME,
      useFindAndModify: false,
      useNewUrlParser: true
    }).then(async () => {
      await User.remove({})
      done()
    }).catch(err => {
      console.log('error connecting to database', err.message)
    })
  })

  it('should be fail if user does not exits', (done) => {
    request(app)
      .post('/session')
      .send({ email: 'test@test.com', password: '123456789' })
      .expect(400)
      .end((err, response) => {
        const { body } = response
        expect(body).to.have.property('error')
        expect(body).to.have.property('code')
        expect(body.code).to.be.equal('INVALID_CREDENTIALS')
        done()
      })
  })

  it('should be fail if dont send email or password', (done) => {
    request(app)
      .post('/session')
      .expect(201)
      .send({})
      .end((err, response) => {
        const { body } = response
        expect(body).to.have.property('errors')
        expect(body.errors).to.be.a('array')
        expect(body.errors).to.length(2)

        const [errorEmail, errorPassword] = body.errors
        expect(errorEmail).to.be.a('object')
        expect(errorEmail).to.have.property('msg')
        expect(errorEmail).to.have.property('param')
        expect(errorEmail).to.have.property('location')

        expect(errorPassword).to.be.a('object')
        expect(errorPassword).to.have.property('msg')
        expect(errorPassword).to.have.property('param')
        expect(errorPassword).to.have.property('location')
        done()
      })
  })

  it('should be generate a valid jwt token', async () => {
    const userData = {
      email: 'newuser@test.com',
      password: 'asda_123a3'
    }

    const securePassword = await encrypt(userData.password)
    const user = await User.create({ email: userData.email, password: securePassword })
    const response = await request(app).post('/session').send(userData)

    const { body, statusCode } = response
    expect(statusCode).to.be.equal(201)
    expect(body).to.be.a('object')
    expect(body).haveOwnProperty('token')
    expect(body.token).to.be.string
    expect(body).haveOwnProperty('success')
    expect(body.success).to.be.true
  })
})
