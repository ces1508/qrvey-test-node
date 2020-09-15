const { expect } = require('chai')
const { compare, encrypt } = require('../../lib/password')
const plainPassword = 'normal_password'

describe('lib/password', () => {
  it('generate secure password', async () => {
    const securePassword = await encrypt(plainPassword)
    expect(securePassword).not.equal(plainPassword)
  })

  it('compare bad string', async () => {
    const securePassword = await encrypt(plainPassword)
    const bad = await compare(securePassword, 'bad string')
    expect(bad).to.be.false
  })

  it('compare good string', async () => {
    const securePassword = await encrypt(plainPassword)
    const good = await compare(securePassword, plainPassword)
    expect(good).to.be.true
  })
})
