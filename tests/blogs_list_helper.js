const Blog = require('../models/blogs')

const initialBlogs = [
  {
    'title': 'Let me go',
    'author': 'Iván Uría',
    'url': 'let-me-go',
    'likes': 5
  },
  {
    'title': 'Where is my mind?',
    'author': 'Iván Uría',
    'url': 'whre-is-my-mind',
    'likes': 3
  },
  {
    'title': 'Wreaking Ball',
    'author': 'Iván Uría',
    'url': 'wreaking-ball',
    'likes': 1
  }
]

const saveBlogs = async (blogs) => {
  for (let initialBlog of blogs) {
    const blog = Blog(initialBlog)
    await blog.save()
  }
}

const clearBlogs = async () => {
  await Blog.deleteMany({})
}

module.exports = {
  initialBlogs,
  saveBlogs,
  clearBlogs
}