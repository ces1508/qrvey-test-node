const DATABASE_NAME = process.env.DB_NAME
const PORT = process.env.PORT || 3000
const DATABASE_USER = process.env.USER_DATABASE
const DATABASE_USER_PASSWORD = process.env.PASSWORD_DATABASE
const JWT_SECRET =  process.env.JWT_SECRET
const DATABASE_HOST = 'mongo'

module.exports = {
  DATABASE_NAME,
  PORT,
  DATABASE_USER,
  DATABASE_USER_PASSWORD,
  DATABASE_HOST,
  JWT_SECRET
}
