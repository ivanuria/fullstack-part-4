const errors = {
  '404': () => 'Endpoint not found',
  'e00000': () => 'Malformed ID'
}

const getError = (id, error) => {
  if (!errors[id]) {
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
      message: errors[id](error)
    }
  }
}

module.exports = {
  getError
}