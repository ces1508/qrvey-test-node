const mongoose = require('mongoose')
const {
  DATABASE_HOST,
  DATABASE_USER,
  DATABASE_USER_PASSWORD,
  DATABASE_NAME
} = require('../config/secrets')

const connect = () => {
  return new Promise((resolve, reject) => {
    mongoose.connect(`mongodb://${DATABASE_HOST}`, {
      user: DATABASE_USER,
      pass: DATABASE_USER_PASSWORD,
      dbName: DATABASE_NAME,
      useFindAndModify: true,
      useNewUrlParser: true
    }).then(() => resolve({ connected: true }))
      .catch(err => resolve(err))
  })
}

module.exports = {
  connect
}
