const userRoutes = require('express').Router()
const User = require('../models/users')
const { addUser } = require('../utils/user_helper')
const errors = require('../utils/errors')

userRoutes.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('blogs', {
      title: 1,
      author: 1,
      url: 1
    })
  response.status(200).json(users)
})

userRoutes.post('/', async (request, response) => {
  if (!request.body.password) {
    response.status(400).json(errors.wrapValidationErrors([errors.getError('e00060')]))
  }
  if (request.body.password.length < 3) {
    response.status(400).json(errors.wrapValidationErrors([errors.getError('e00061', {
      properties: { minlength: 3 }
    })]))
  }
  const result = await addUser(request.body)
  response.status(201).json(result)
})

module.exports = userRoutes