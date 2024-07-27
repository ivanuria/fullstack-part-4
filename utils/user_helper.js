const bcrypt = require('bcrypt')
const config = require('../utils/config')
const User = require('../models/users')

const deleteAllUsers = async () => {
  await User.deleteMany({})
}

const getAllUsers = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const getUserByUsername = async (username, raw=false) => {
  const user = await User.findOne({ username })
  if (raw) {
    return user
  }
  return user.toJSON()
}

const updateUser = async (id, newData) => {
  await User.findByIdAndUpdate(id, newData)
}

const rootUser = {
  username: 'root',
  password: 'iamroot',
  name: 'I am ROOT'
}

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
  verifyToken,
  deleteAllUsers,
  getAllUsers,
  getUserByUsername,
  updateUser,
  rootUser
}