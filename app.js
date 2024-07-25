const config = require('./utils/config')
const middleware = require('./utils/middleware')
const blogsRoutes = require('./controllers/blogs')
const express = require('express')
const app = express()
const cors = require('cors')
const { mongoBdConnect } = require('./utils/mongodb')

const mongoUrl = config.MONGODB_URI

mongoBdConnect(mongoUrl)

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/blogs', blogsRoutes)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app