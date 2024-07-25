const config = require('./config')

const info = (...params) => {
  if (config.NODE_ENV !== config.NODE_ENVS.TEST) {
    console.log(...params)
  }
}

const error = (...params) => {
  if (config.NODE_ENV !== config.NODE_ENVS.TEST) {
    console.error(...params)
  }
}

module.exports = {
  info,
  error
}