const express = require('express')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const pretty = require('express-prettify')
const mongoose = require('mongoose')
const {
  PORT,
  DATABASE_HOST,
  DATABASE_USER,
  DATABASE_USER_PASSWORD,
  DATABASE_NAME
} = require('./config/secrets')

require('express-async-errors')

const { validateToken } = require('./middlewares')
const { UserRouter, TaskRouter, ProjectRouter, SessionRouter } = require('./router')
const app = express()

// middlewares
app.use(helmet())
app.use(bodyParser.json())
app.use(pretty({ query: 'pretty' }))

// routes

console.log('DATABASE_USER', DATABASE_USER)
console.log('DATABASE_USER_PASSWORD', DATABASE_USER_PASSWORD)
console.log('DATABASE_NAME', DATABASE_NAME)

mongoose.connect(`mongodb://${DATABASE_HOST}`, {
  user: DATABASE_USER,
  pass: DATABASE_USER_PASSWORD,
  db: DATABASE_NAME,
  useFindAndModify: false,
  useNewUrlParser: true
})
.then(() => {
  console.log('database connected')
})
.catch(err => {
  console.log('error connecting to database', err.message)
})

// database

app.use('/users', UserRouter)
app.use('/session', SessionRouter)
app.use('/projects', validateToken, ProjectRouter)
app.use('/tasks', validateToken, TaskRouter)

app.use((err, req, res, next) => {
  res.json({
    error: err.message || 'internal server error',
    code: err.code || 500
  })
})
app.listen(PORT, err => {
  if (err) {
    return process.exit(0)
  }

  console.log(`server running on port ${PORT}`)
})
