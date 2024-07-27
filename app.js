require('express-async-errors')
const express = require('express')
const middleware = require('./utils/middleware')
const blogsRoutes = require('./controllers/blogs')
const usersRoutes = require('./controllers/users')
const loginRoutes = require('./controllers/login')
const cors = require('cors')
const { mongoDBConnect } = require('./utils/mongodb')
const logger = require('./utils/logger')

const mongod = mongoDBConnect()
logger.info(mongod)
const app = express()

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/blogs', blogsRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/login', loginRoutes)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = {
  app,
  mongod
}