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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}