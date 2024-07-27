require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS)
const TOKEN_TIMEOUT = Number(process.env.TOKEN_TIMEOUT)
const SECRET = process.env.SECRET
const NODE_ENV = process.env.NODE_ENV
const NODE_ENVS = {
  TEST: 'test',
  DEVELOPMENT: 'development',
  PRODUCTION: 'productiom'
}

module.exports = {
  PORT,
  MONGODB_URI,
  SALT_ROUNDS,
  TOKEN_TIMEOUT,
  SECRET,
  NODE_ENV,
  NODE_ENVS
}