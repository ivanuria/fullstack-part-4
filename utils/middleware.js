const logger = require('./logger')
const errors = require('./errors')

const errorHandler = (error, request, response, next) => { // Not Tested Yet
  logger.error('Error', error.message)
  if (error.name === 'CastError') {
    return response.status(400).json(errors.getError('e00000', error))
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json(errors.getValidationErrors(error))
  }

  if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json(errors.getError('e00001', error))
  }

  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json(errors.getError('401-it', error))
  }

  if (error.name === 'TokenExpiredError') {
    return response.status(401).json(errors.getError('401-et', error))
  }

  return next(error)
}

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')

  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).json(errors.getError('404'))
}

module.exports = {
  errorHandler,
  requestLogger,
  unknownEndpoint
}