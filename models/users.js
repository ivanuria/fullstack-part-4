const { jsonResponseHandler } = require('../utils/helper')
const { Schema, model } = require('mongoose')

const userSchema = new Schema({
  username: {
    type: String,
    minLength: 3,
    required: true,
    unique: true
  },
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  passwordHash: {
    type: String
  },
  creationDate: {
    type: Date,
    default: Date.now
  },
  currentHash: {
    type: String
  },
  expiresAt: {
    type: Date
  },
  blogs: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ]
})

userSchema.set('toJSON', jsonResponseHandler(['passwordHash', 'currentHash']))

module.exports = model('User', userSchema)