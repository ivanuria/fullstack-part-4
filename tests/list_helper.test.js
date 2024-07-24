const { describe, test } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('totalLikes', () => {
  test('when list has no blog, equals 0', () => {
    assert.strictEqual(listHelper.totalLikes([]), 0)
  })

  const listWithOneBlog = [
    {
      'title': 'Let me go',
      'author': 'Iván Uría',
      'url': 'let-me-go',
      'likes': 5,
      '_id': '66a0bdd4d34f08f4dc7fe156',
      '__v': 0
    }
  ]

  test('when list has one blog, equals the likes of that', () => {
    assert.strictEqual(listHelper.totalLikes(listWithOneBlog), 5)
  })

  const listWithManyBlogs = [
    {
      'title': 'Let me go',
      'author': 'Iván Uría',
      'url': 'let-me-go',
      'likes': 5,
      '_id': '66a0bdd4d34f08f4dc7fe156',
      '__v': 0
    },
    {
      'title': 'Where is my mind?',
      'author': 'Iván Uría',
      'url': 'whre-is-my-mind',
      'likes': 3,
      '_id': '66a0cbe52634428fd8cdf3c8',
      '__v': 0
    },
    {
      'title': 'Wreaking Ball',
      'author': 'Iván Uría',
      'url': 'wreaking ball',
      'likes': 1,
      '_id': '66a0d07884a5cd6a5c6a64e6',
      '__v': 0
    }
  ]

  test('when list has many blogs, equals the sum of the likes of that', () => {
    assert.strictEqual(listHelper.totalLikes(listWithManyBlogs), 9)
  })
})

describe('favoriteBlog', () => {
  test('when no blog is sent, returns null', () => {
    assert.strictEqual(listHelper.favoriteBlog([]), null)
  })

  const favouriteBlog = {
    'title': 'Let me go',
    'author': 'Iván Uría',
    'url': 'let-me-go',
    'likes': 5,
    '_id': '66a0bdd4d34f08f4dc7fe156',
    '__v': 0
  }

  test('when one blog is sent, returns the same blog', () => {
    assert.strictEqual(listHelper.favoriteBlog([favouriteBlog]), favouriteBlog)
  })

  const listWithManyBlogs = [
    {
      'title': 'Where is my mind?',
      'author': 'Iván Uría',
      'url': 'whre-is-my-mind',
      'likes': 3,
      '_id': '66a0cbe52634428fd8cdf3c8',
      '__v': 0
    },
    {
      'title': 'Let me go',
      'author': 'Iván Uría',
      'url': 'let-me-go',
      'likes': 5,
      '_id': '66a0bdd4d34f08f4dc7fe156',
      '__v': 0
    },
    {
      'title': 'Wreaking Ball',
      'author': 'Iván Uría',
      'url': 'wreaking ball',
      'likes': 1,
      '_id': '66a0d07884a5cd6a5c6a64e6',
      '__v': 0
    }
  ]

  test('when many blogs are sent, returns the favourite blog', () => {
    assert.deepStrictEqual(listHelper.favoriteBlog(listWithManyBlogs), favouriteBlog)
  })
})

describe('mostBlogs', () => {
  test('when no blog in blogs, return null', () => {
    assert.strictEqual(listHelper.mostBlogs([]), null)
  })

  const listWithOneBlog = [
    {
      'title': 'Let me go',
      'author': 'Iván Uría',
      'url': 'let-me-go',
      'likes': 5,
      '_id': '66a0bdd4d34f08f4dc7fe156',
      '__v': 0
    }
  ]

  test('when one blog in blogs, return the only author', () => {
    assert.deepStrictEqual(listHelper.mostBlogs(listWithOneBlog), {
      author: "Iván Uría",
      blogs: 1
    })
  })

  const listWithManyBlogs = [
    {
      'title': 'Where is my mind?',
      'author': 'Iván Uría',
      'url': 'whre-is-my-mind',
      'likes': 3,
      '_id': '66a0cbe52634428fd8cdf3c8',
      '__v': 0
    },
    {
      'title': 'Let me go',
      'author': 'María Haría',
      'url': 'let-me-go',
      'likes': 5,
      '_id': '66a0bdd4d34f08f4dc7fe156',
      '__v': 0
    },
    {
      'title': 'Wreaking Ball',
      'author': 'Iván Uría',
      'url': 'wreaking ball',
      'likes': 1,
      '_id': '66a0d07884a5cd6a5c6a64e6',
      '__v': 0
    }
  ]

  test('when many blog in blogs, return the author with the most of blogs', () => {
    assert.deepStrictEqual(listHelper.mostBlogs(listWithManyBlogs), {
      author: "Iván Uría",
      blogs: 2
    })
  })
})