const logger = require('./logger')
const mongoose = require('mongoose')

const mongoBdConnect = async (mongoUrl) => {
  mongoose.set('strictQuery', false)

  try {
    await mongoose.connect(mongoUrl)
    logger.info('Connected to MongoDB', mongoUrl)
  } catch(exception) {
    logger.error('Error connecting to MongoDB', error.message)
  }
}

module.exports = {
  mongoBdConnect
}