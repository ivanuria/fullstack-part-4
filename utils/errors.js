const logger = require('./logger')

const errorsUXTexts = {
  '404': () => 'Endpoint not found',
  '401': () => 'Unauthorized',
  '401-it': () => 'Invalid Token',
  '401-et': () => 'Expired Token',
  'e00000': () => 'Malformed ID',
  'e00001': () => '`username` expected to be unique', // Check twice the error
  'e00010': () => 'Title is required',
  'e00011': error => `Title must be at least ${ error.properties.minlength } characters long`,
  'e00021': error => `Author name must be at least ${ error.properties.minlength } characters long`,
  'e00030': () => 'Url is required',
  'e00031': error => `Url must be at least ${ error.properties.minlength } characters long`,
  'e00032': () => 'Url syntax must follow W3 URI rules https://www.w3.org/Addressing/URL/uri-spec.html'
}

const errorPaths = { // No model is set in every error, so a better coding is to be needed
  title: {
    required: 'e00010',
    minlength: 'e00011'
  },
  author: {
    minlength: 'e00021'
  },
  url: {
    required: 'e00030',
    minlength: 'e00031',
    'user defined': 'e00032'
  }
}

const getError = (id, error) => {
  logger.info('Getting error', id, error)
  if (!errorsUXTexts[id]) {
    return {
      error: {
        code: 'Uncaught Error',
        message: error.message
      }
    }
  }
  return {
    error: {
      code: id,
      message: errorsUXTexts[id](error)
    }
  }
}

const getValidationErrors = (errors) => {
  logger.info('getErrors', errors)
  const errorList = []
  for (const key of Object.keys(errors.errors)) {
    const error = errors.errors[key]
    if ( !errorPaths[error.path] || !errorPaths[error.path][error.kind]) {
      errorList.push(getError('uncaught', error))
    } else {
      errorList.push(getError(errorPaths[error.path][error.kind], error))
    }
  }
  return {
    validationErrors: errorList.map(error => error.error)
  }
}

module.exports = {
  getError,
  getValidationErrors
}