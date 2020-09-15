const { Schema, model, SchemaTypes } = require('mongoose')

const projectSchema = new Schema({
  name: {
    type: SchemaTypes.String,
    required: true
  },
  userId: {
    type: SchemaTypes.ObjectId,
    ref: 'User'
  },
  tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }]
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } })

projectSchema.virtual('totalTasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'project',
  count: true
})
projectSchema.virtual('totalTime').get(function () {
  return this.tasks.map(el => {
    const hoursInMinutes = el.hoursToExpired * 60
    const secondsToMinutes = Math.ceil(el.secondsToExpired / 60)
    return hoursInMinutes + el.minutesToExpired + secondsToMinutes
  }).reduce((prev, current) => prev + current, 0)
})
module.exports = model('Project', projectSchema)
