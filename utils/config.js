require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI
const NODE_ENV = process.env.NODE_ENV
const NODE_ENVS = {
  TEST: 'test',
  DEVELOPMENT: 'development',
  PRODUCTION: 'productiom'
}

module.exports = {
  PORT,
  MONGODB_URI,
  NODE_ENV,
  NODE_ENVS
}