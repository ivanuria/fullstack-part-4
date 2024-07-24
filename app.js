const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const { jsonResponseHandler } = require('./utils/helper')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

blogSchema.set('toJSON', jsonResponseHandler)

const Blog = mongoose.model('Blog', blogSchema)

const mongoUrl = config.MONGODB_URI
mongoose
  .connect(mongoUrl)
  .then(() => {
    logger.info('Connected to MongoDB')
  })
  .catch(error => {
    logger.error('Error connecting to MongoDB', error.message)
  })

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app