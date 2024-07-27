const logger = require('./logger')

const errorsUXTexts = {
  '404': () => 'Endpoint not found',
  '401': () => 'Unauthorized',
  '404-up': () => 'Invalid username or password',
  '401-it': () => 'Invalid Token',
  '401-et': () => 'Expired Token',
  'e00000': () => 'Malformed ID',
  'e00010': () => 'Title is required',
  'e00011': error => `Title must be at least ${ error.properties.minlength } characters long`,
  'e00021': error => `Author name must be at least ${ error.properties.minlength } characters long`,
  'e00030': () => 'Url is required',
  'e00031': error => `Url must be at least ${ error.properties.minlength } characters long`,
  'e00032': () => 'Url syntax must follow W3 URI rules https://www.w3.org/Addressing/URL/uri-spec.html',
  'e00040': () => 'Username is required',
  'e00041': error => `Username must be at least ${ error.properties.minlength } characters long`,
  'e00042': error => `Username '${error.value}' already taken`,
  'e00050': () => 'Name is required',
  'e00051': error => `Name must be at least ${ error.properties.minlength } characters long`,
  'e00060': () => 'Password is required',
  'e00061': error => `Password must be at least ${ error.properties.minlength } characters long`,
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
  },
  username: {
    required: 'e00040',
    minlength: 'e00041',
    unique: 'e00042'
  },
  name: {
    required: 'e00050',
    minlength: 'e00051',
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

const wrapValidationErrors = (errorList) => {
  return {
    error: 'ValidationErrors',
    validationErrors: errorList.map(error => error.error)
  }
}

const getErrorFromPath = (path, kind, error) => {
  if ( !errorPaths[path] || !errorPaths[path][kind]) {
    return getError('uncaught', error)
  }
  return getError(errorPaths[path][kind], error)
}

const getValidationErrors = (errors) => {
  logger.info('getErrors', errors)
  const errorList = []
  for (const key of Object.keys(errors.errors)) {
    const error = errors.errors[key]
    errorList.push(getErrorFromPath(error.path, error.kind, error))
  }
  return wrapValidationErrors(errorList)
}

const getMongoServerError = (kind, error) => {
  logger.info('unique error', error)
  const [path, value] = Object.entries(error.keyValue)[0]
  return wrapValidationErrors([getErrorFromPath(path, kind, {
    message: `${path} must be ${kind}`,
    value: value,
    path: path,
    kind: kind
  })])
}

module.exports = {
  getError,
  wrapValidationErrors,
  getValidationErrors,
  getMongoServerError
}