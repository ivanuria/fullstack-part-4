const blogsRoutes = require('express').Router()
const Blog = require('../models/blogs')

blogsRoutes.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRoutes.post('/', async (request, response) => {
  const blog = new Blog(request.body)

  const result = await blog.save()
  response.status(201).json(result)
})

blogsRoutes.get('/:id', async (request, response) => {
  const blogPost = await Blog.findById(request.params.id)
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

module.exports = blogsRoutes