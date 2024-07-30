const logger = require('./logger')
const errors = require('./errors')
const jwt = require('jsonwebtoken')
const config = require('./config')
const { getUser } = require('./user_helper')

const errorHandler = (error, request, response, next) => {
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

const extractUser = async (request, response, next) => {
  console.log('extractUser')
  if (request.token) {
    const decodedToken = jwt.verify(request.token, config.SECRET)
    const user = await getUser(decodedToken.id, true)
    request._decodedToken = decodedToken
    request._user = user
    request.user = user.toJSON()
  }
  next()
}

const restricted = async (request, response, next) => {
  console.log('restricted')
  const decodedToken = request._decodedToken
  const user = request._user

  if (!(request.token && user && decodedToken)) {
    return response.status(401).json(errors.getError('401'))
  }

  if (!(decodedToken.id && decodedToken.hash)) {
    return response.status(401).json(errors.getError('401'))
  }

  if (user.hash !== decodedToken.hash) {
    return response.status(401).json(errors.getError('401'))
  }

  if (user.expireAt < new Date()) {
    return response.status(401).json(errors.getError('401'))
  }

  next()
}

module.exports = {
  errorHandler,
  requestLogger,
  unknownEndpoint,
  tokenExtractor,
  extractUser,
  restricted
}