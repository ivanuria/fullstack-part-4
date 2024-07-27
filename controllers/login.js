const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const helper = require('../utils/user_helper')
const { getError } = require('../utils/errors')
const config = require('../utils/config')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const now = Date.now()
  const hash = now.toString(36)
  const expire = new Date(now + config.TOKEN_TIMEOUT)

  const user = await helper.getUserByUsername(username, true)

  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json(getError('401-up'))
  }

  const userForToken = {
    username: user.username,
    id: user._id,
    hash: hash
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  await helper.updateUser(user.id, {
    hash: hash,
    expiresAt: expire
  })

  response
    .status(200)
    .send({
      token,
      username: user.username,
      name: user.name,
      expiresAt: expire
    })
})

module.exports = loginRouter