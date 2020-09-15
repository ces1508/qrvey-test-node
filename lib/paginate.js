const paginate = (totalRecords, perpage = 15, currentage) => {
  const pages = Math.ceil(totalRecords / perpage )
  const skip = (currentage - 1) * perpage
  return {
    pages,
    skip,
    isLastPage: pages === currentage
  }
}

module.exports =  paginate
