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

const saveBlog = async(blog) => {
  const toSaveBlog = Blog(blog)
  return await toSaveBlog.save()
}

const saveBlogs = async (blogs) => {
  for (let initialBlog of blogs) {
    await saveBlog(initialBlog)
  }
}

const clearBlogs = async () => {
  await Blog.deleteMany({})
}

module.exports = {
  initialBlogs,
  saveBlog,
  saveBlogs,
  clearBlogs
}