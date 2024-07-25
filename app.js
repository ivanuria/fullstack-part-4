const config = require('./utils/config')
const middleware = require('./utils/middleware')
const blogsRoutes = require('./controllers/blogs')
const express = require('express')
const app = express()
const cors = require('cors')
const { mongoBdConnect } = require('./utils/mongodb')

if (config.NODE_ENV !== config.NODE_ENVS.TEST) {
  mongoBdConnect(config.MONGODB_URI)
}

if (config.NODE_ENV === config.NODE_ENVS.TEST) {
  const connectTest = async () => {
    const { MongoMemoryServer } = require('mongodb-memory-server')
    const mongod = new MongoMemoryServer()
    await mongod.start()
    mongoBdConnect(mongod.getUri())
  }
  connectTest()
}

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/blogs', blogsRoutes)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app