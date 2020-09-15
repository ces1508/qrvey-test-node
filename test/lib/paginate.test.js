const { expect } = require('chai')
const paginate = require('../../lib/paginate')

const perPage = 15

describe('lib/paginate', () => {
  it('should be return a object', () => {
    const pagination = paginate(150, perPage)
    expect(pagination).to.be.a('object')
    expect(pagination).to.be.haveOwnProperty('pages')
    expect(pagination).to.be.haveOwnProperty('isLastPage')
    expect(pagination).to.be.haveOwnProperty('skip')
  })

  it('validate skip', () => {
    const { skip } = paginate(150, perPage)
    expect(skip).to.be.a('number')
    expect(skip >= 0).to.be.true
    expect(skip).to.be.equal(0)

    const page = 3
    const { skip: newSkip } = paginate(150, perPage, page)
    expect(newSkip > skip).to.be.true
    expect(newSkip).to.be.equal((page - 1) * perPage)
  })

  it('validate lastPage', () => {
    const { isLastPage } = paginate(0, perPage)

    expect(isLastPage).to.be.a('boolean')
    expect(isLastPage).to.be.true

    const { isLastPage: newLastPage } = paginate(140, perPage, 2)
    expect(newLastPage).to.be.false
  })

  it('validate pages', () => {
    const { pages } = paginate(150, perPage, 3)

    expect(pages).to.be.a('number')
    expect(pages).to.be.equal(10)

    const { pages: newPages } = paginate(33, perPage)
    expect(newPages).to.be.equal(3)
  })
})
