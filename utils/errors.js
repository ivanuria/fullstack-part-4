const logger = require('./logger')

const errorsUXTexts = {
  '404': () => 'Endpoint not found',
  'e00000': () => 'Malformed ID',
  'e00001': () => 'getValidationErrors used out of a mongoose schema validation',
  'e00011': error => `Title must be at least ${ error.properties.minlength } characters long`,
  'e00021': error => `Author name must be at least ${ error.properties.minlength } characters long`,
  'e00031': error => `Url must be at least ${ error.properties.minlength } characters long`,
  'e00032': () => `Url syntax must follow W3 URI rules https://www.w3.org/Addressing/URL/uri-spec.html`
}

const errorPaths = {
  Blog : {
    title: {
      minlength: 'e00011'
    },
    author: {
      minlength: 'e00021'
    },
    url: {
      minlength: 'e00031',
      'user defined': 'e00032'
    }
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
  const modelName = errors.message.match(/^([a-zA-Z0-9\-_]*) validation failed/)
  if (!modelName) {
    return getError('e00001')
  }
  logger.info("Model name:", modelName[1])
  const errorList = []
  for (const key of Object.keys(errors.errors)) {
    const error = errors.errors[key]
    if (!errorPaths[modelName[1]] || !errorPaths[modelName[1]][error.path] || !errorPaths[modelName[1]][error.path][error.kind]) {
      errorList.push(getError("uncaught", error))
    } else {
      errorList.push(getError(errorPaths[modelName[1]][error.path][error.kind], error))
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