const logger = require('./logger')
const mongoose = require('mongoose')
const config = require('./config')

const doConnection = async (mongoUrl) => {
  mongoose.set('strictQuery', false)

  try {
    await mongoose.connect(mongoUrl)
    logger.info('Connected to MongoDB', mongoUrl)
  } catch(exception) {
    logger.error('Error connecting to MongoDB', error.message)
  }
}

const mongoBdConnect = async () => {
  if (config.NODE_ENV !== config.NODE_ENVS.TEST) {
    doConnection(config.MONGODB_URI)
  }

  if (config.NODE_ENV === config.NODE_ENVS.TEST) {
    const connectTest = async () => {
      const { MongoMemoryServer } = require('mongodb-memory-server')
      const mongod = new MongoMemoryServer()
      await mongod.start()
      doConnection(mongod.getUri())
    }
    connectTest()
  }
}

module.exports = {
  mongoBdConnect
}