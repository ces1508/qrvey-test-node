const express = require('express')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const pretty = require('express-prettify')
const { PORT } = require('./config/secrets')
const db = require('./lib/db')

require('express-async-errors')

const { validateToken } = require('./middlewares')
const { UserRouter, ProjectRouter, SessionRouter } = require('./router')
const app = express()

// middlewares
app.use(helmet())
app.use(bodyParser.json())
app.use(pretty({ query: 'pretty' }))

// database
db.connect()
  .then(() => {
    console.log('database connected')
  })
  .catch(err => {
    console.log('error connecting to database', err.message)
  })

// routes
app.use('/users', UserRouter)
app.use('/session', SessionRouter)
app.use('/projects', validateToken, ProjectRouter)

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

module.exports = app
