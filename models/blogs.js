
const { jsonResponseHandler } = require('../utils/helper')
const { Schema, model } = require('mongoose')

const blogSchema = new Schema({
  title: {
    type: String,
    minLength: 3,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  author: {
    type: String,
    minLength: 3
  },
  url: {
    type: String,
    minLength: 3,
    validate :{
      validator: (v) => {
        return /^([(http(s)?)://(www.)?a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6})?([-a-zA-Z0-9@:%_+.~#?&//=]*)$/.test(v) // Admits improvement
      }
    },
    required: true
  },
  likes: {
    type: Number,
    default: 0
  }
})

blogSchema.set('toJSON', jsonResponseHandler())

module.exports = model('Blog', blogSchema)