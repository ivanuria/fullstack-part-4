const userRoutes = require('express').Router()
const User = require('../models/users')
const { addUser } = require('../utils/user_helper')

userRoutes.get('/', async (request, response) => {
  const users = User.find({})
  response.status(200).json(users)
})

userRoutes.post('/', async (request, response) => {
  const result = await addUser(request.body)
  response.status(201).json(result)
})

module.exports = userRoutes