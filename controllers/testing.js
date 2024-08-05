const router = require('express').Router()
const User = require('../models/users')
const Blogs = require('../models/blogs')

router.post('/reset', async (request, response) => {
  await User.deleteMany({})
  await Blogs.deleteMany({})

  response.status(204).end()
})

module.exports = router