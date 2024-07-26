const User = require('../models/users')

const deleteAllUsers = async () => {
  await User.deleteMany({})
}

const getAllUsers = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  deleteAllUsers,
  getAllUsers
}