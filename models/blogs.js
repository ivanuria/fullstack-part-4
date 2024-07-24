
const { jsonResponseHandler } = require('../utils/helper')
const { Schema, model } = require('mongoose')

const blogSchema = new Schema({
  title: {
    type: String,
    minLength: 3
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
    }
  },
  likes: Number
})

blogSchema.set('toJSON', jsonResponseHandler)

module.exports = model('Blog', blogSchema)