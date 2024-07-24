const logger = require('./logger')
const errors = require('./errors')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info("---")

  next()
}

const errorHandler = (request, response, error) => { // Not Tested Yet
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).json(errors.getError('e00000', error))
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json(errors.getError('', error))
  }
}

const unknownEndpoint = (request, response) => {
  response.status(404).json(errors.getError('404'))
}

module.exports = {
  requestLogger,
  errorHandler,
  unknownEndpoint
}