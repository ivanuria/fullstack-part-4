const bcrypt = require('bcrypt')
const config = require('../utils/config')
const User = require('../models/users')

const addUser = async (user) => {
  const { username, name, password } = user
  const passwordHash = await bcrypt.hash(password, config.SALT_ROUNDS) // Repeated
  const newUser = new User({
    username,
    name,
    passwordHash
  })
  return await newUser.save()
}

const verifyToken = (token) => {

}

module.exports = {
  addUser,
  verifyToken
}