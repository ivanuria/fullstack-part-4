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

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'willremovethissoon',
    url: 'willremovethissoon'
  })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const allBlogs = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs,
  saveBlog,
  saveBlogs,
  clearBlogs,
  nonExistingId,
  allBlogs
}