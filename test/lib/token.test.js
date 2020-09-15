const { expect } = require('chai')
const { generate, validate } = require('../../lib/token')

const payload = {
  userId: 1,
  email: 'test@test.com'
}

const genericJwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

describe('lib/token', () => {
  it('should genreate a new jwt token', async () => {
    const token = await generate(payload)
    expect(token).not.to.be.equal(payload)
    const parts = token.split('.')
    expect(parts.length).to.be.equal(3)
  })

  it('should validate a token', async () => {
    const token = await generate(payload)
    const decode = await validate(token)
    expect(decode).to.be.a('object')
    expect(decode).to.have.property('userId')
    expect(decode).to.have.property('email')
    expect(decode).to.have.property('iat')
    expect(decode).to.have.property('exp')
    expect(decode.email).to.be.equal(payload.email)
    expect(decode.userId).to.be.equal(payload.userId)
  })
  it('should faild validating token', async () => {
    const decode = await validate(genericJwtToken)
    expect(decode).to.be.undefined
  })
})
