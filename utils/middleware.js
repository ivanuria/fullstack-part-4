const logger = require('./logger')
const errors = require('./errors')
const jwt = require('jsonwebtoken')
const config = require('./config')
const { getUser } = require('./user_helper')

const errorHandler = (error, request, response, next) => { // Not Tested Yet
  logger.error('Error', error.message)
  if (error.name === 'CastError') {
    return response.status(400).json(errors.getError('e00000', error))
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json(errors.getValidationErrors(error))
  }

  if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json(errors.getMongoServerError('unique', error))
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

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  }
  next()
}

const verifyLogin = async (request, response, next) => {
  if (!request.token) {
    return response.status(401).json(errors.getError('401-it'))
  }
  const decodedToken = jwt.verify(request.token, config.SECRET)
  if (!(decodedToken.id && decodedToken.hash)) {
    return response.status(401).json(errors.getError('401-it'))
  }

  const user = await getUser(decodedToken.id, true)

  if (user.hash != decodedToken.hash) {
    return response.status(401).json(errors.getError('401-it'))
  }
  if (user.expireAt < new Date()) {
    return response.status(401).json(errors.getError('401-it'))
  }

  request.user = user.toJSON()

  next()
}

module.exports = {
  errorHandler,
  requestLogger,
  unknownEndpoint,
  tokenExtractor,
  verifyLogin
}