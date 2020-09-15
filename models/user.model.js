const { Schema, model } = require('mongoose')

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    indexes: true
  },
  password: {
    type: String,
    required: String
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  age: {
    type: String
  }
})

module.exports = model('User', UserSchema)
