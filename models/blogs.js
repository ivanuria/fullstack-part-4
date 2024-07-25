
const { jsonResponseHandler } = require('../utils/helper')
const { Schema, model } = require('mongoose')

const blogSchema = new Schema({
  title: {
    type: String,
    minLength: 3,
    required: true
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
        return /^([a-zA-Z0-9\-.?,'/\\+~{}&%$#_]*)?(}?)(\/?)$/.test(v)
      }
    },
    required: true
  },
  likes: {
    type: Number,
    default: 0
  }
})

blogSchema.set('toJSON', jsonResponseHandler)

module.exports = model('Blog', blogSchema)