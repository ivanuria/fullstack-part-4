const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')
const Blog = require('./models/blogs')
const express = require('express')
const app = express()
const cors = require('cors')

const mongoUrl = config.MONGODB_URI

mongoose.set('strictQuery', false)

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

app.get('/api/blogs', (request, response, next) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
    .catch(error => next(error))
})

app.post('/api/blogs', (request, response, next) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
    .catch(error => next(error))
})

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app