const lodash = require('lodash')
const logger = require('./logger')

const dummy = () => {
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
  if (blogs.length === 0) return null
  const authors = lodash.countBy(blogs, 'author')
  logger.info('Authors Most Blogs', authors)
  const author = Object.keys(authors)
    .reduce((prev, next) => authors[next] > authors[prev] ? next : prev)
  return {
    author,
    blogs: authors[author]
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null
  const authors = lodash.reduce(blogs, (result, blog) => {
    if (!result[blog.author]) {
      result[blog.author] = 0
    }
    result[blog.author] += blog.likes
    return result
  }, {})
  logger.info('Authors Most Likes', authors)
  const author = Object.keys(authors)
    .reduce((prev, next) => authors[next] > authors[prev] ? next : prev)
  return {
    author,
    likes: authors[author]
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}