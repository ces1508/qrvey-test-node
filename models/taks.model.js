const  { Schema, model, SchemaTypes } = require('mongoose')

const taskSchema = new Schema({
  title: SchemaTypes.String,
  body: SchemaTypes.String,
  state: {
    type: SchemaTypes.String,
    default: 'ACTIVE'
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    index: true
  },
  hoursToExpired: {
    type: SchemaTypes.Number,
    default: 0
  },
  minutesToExpired: {
    type: SchemaTypes.Number,
    default: 0
  },
  secondsToExpired: {
    type: SchemaTypes.Number,
    default: 0
  },
  createdAt: {
    type: SchemaTypes.Date,
    default: new Date()
  },
  updatedAt: {
    type: SchemaTypes.Date,
    default: new Date()
  }
}, {
  autoIndex: true
 })

module.exports = model('Task', taskSchema)
