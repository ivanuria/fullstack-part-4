const lodash = require('lodash')
const logger = require('./logger')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => {
    return blog.likes + sum
  }, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null
  return blogs.reduce((favorite, blog) => blog.likes > favorite.likes ? blog : favorite)
}

const mostBlogs = (blogs) => {
  if (blogs.length == 0) return null
  const authors = lodash.countBy(blogs, 'author')
  logger.info('Authors', authors)
  const author = Object.keys(authors)
    .reduce((prev, next) => authors[next] > authors[prev] ? next : prev)
  return {
    author,
    blogs: authors[author]
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}