const blogsRoutes = require('express').Router()
const Blog = require('../models/blogs')
const { getAllUsers, updateUser } = require('../utils/user_helper')
const middleware = require('../utils/middleware')

blogsRoutes.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user',
      {
        username: 1,
        name: 1
      }
    )

  response.json(blogs)
})

blogsRoutes.post('/', middleware.verifyLogin ,async (request, response) => {
  const user = request.user

  const postToUpload = {
    ...request.body,
    user: user.id
  }

  const blog = new Blog(postToUpload)

  const result = await blog.save()

  updateUser(user.id, {
    blogs: user.blogs.concat(result._id.toString())
  })

  response.status(201).json(result)
})

blogsRoutes.get('/:id', async (request, response) => {
  const blogPost = await Blog
    .findById(request.params.id)
    .populate('user',
      {
        username: 1,
        name: 1
      }
    )
  if (!blogPost) {
    return response
      .status(404)
      .json({
        error: {
          code: '404',
          message: 'Unfound blogpost'
        }
      })
  }
  response.status(200).json(blogPost)
})

blogsRoutes.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)

  response.status(204).end()
})

blogsRoutes.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body
  const newBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { title, author, url, likes },
    { new: true, runValidators: true, context: 'query' }
  )

  response.status(200).json(newBlog)
})

module.exports = blogsRoutes