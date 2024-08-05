require('express-async-errors')
const express = require('express')
const middleware = require('./utils/middleware')
const blogsRoutes = require('./controllers/blogs')
const usersRoutes = require('./controllers/users')
const loginRoutes = require('./controllers/login')
const cors = require('cors')
const { mongoDBConnect } = require('./utils/mongodb')
const logger = require('./utils/logger')
const config = require('./utils/config')

const mongod = mongoDBConnect()
logger.info(mongod)
const app = express()

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/blogs', middleware.extractUser, blogsRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/login', loginRoutes)
if (config.NODE_ENV == config.NODE_ENVS.TEST) {
  const testingRoutes = require('./controllers/testing')
  app.use('/api/testing', testingRoutes)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = {
  app,
  mongod
}