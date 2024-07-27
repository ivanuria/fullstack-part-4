const { describe, test, after, beforeEach, before } = require('node:test')
const assert = require('node:assert')
const { app, mongod } = require('../app')
const supertest = require('supertest')
const { mongoDBDisconnect } = require('../utils/mongodb')
const helper = require('./blogs_list_helper')
const { rootUser, deleteAllUsers, getAllUsers, addUser } = require('../utils/user_helper')

const api = supertest(app)

var user
var token

describe('blogs list api', async () => {
  after(async () => {
    await mongoDBDisconnect(await mongod)
  })

  before(async () => {
    await deleteAllUsers()
    await addUser(rootUser)
    user = (await getAllUsers())[0].id
    const login = await api
        .post('/api/login')
        .send({
          username: rootUser.username,
          password: rootUser.password
        })
    token = login.body.token
  })

  beforeEach(async () => {
    await helper.clearBlogs()
    await helper.saveBlogs(helper.initialBlogs.map(blog => { return { ...blog, user } }))
  })

  describe('get /api/blogs', async () => {
    test('returns the correct amount of blogs', async () => {
      const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.length, helper.initialBlogs.length)

      assert(response.body.map(blog => blog.user.username).every(username => username === rootUser.username))
    })

    test('returns the correct id for objects under >>id<< instead of >>_id<<', async () => {
      const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual('__v' in response.body[0], false)
      assert.strictEqual('_id' in response.body[0], false)
      assert('id' in response.body[0])
    })
  })

  describe('post /api/blogs', async () => {
    test('creates new blog', async () => {
      const newPost = {
        title: 'Ardo por dentro',
        author: 'Víctor García',
        url: 'ardo-por-dentro',
        likes: 999
      }
      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newPost)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(response.body, { ...newPost, id:response.body.id, user })

      const savedPosts = await helper.allBlogs()
      assert.strictEqual(savedPosts.length, helper.initialBlogs.length + 1)

      const titles = savedPosts.map(post => post.title)
      assert(titles.includes(newPost.title))
    })

    test('without likes creates new blog with 0 likes', async () => {
      const newPost = {
        title: 'Ardo por dentro',
        author: 'Víctor García',
        url: 'ardo-por-dentro'
      }
      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newPost)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(response.body, { ...newPost, id:response.body.id, likes:0, user })

      const savedPosts = await helper.allBlogs()
      assert.strictEqual(savedPosts.length, helper.initialBlogs.length + 1)

      const titles = savedPosts.map(post => post.title)
      assert(titles.includes(newPost.title))
    })

    test('with no title raises error', async () => {
      const newPost = {
        author: 'Víctor García',
        url: 'ardo-por-dentro',
        likes: 999
      }
      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newPost)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.title, undefined)
      assert.strictEqual(response.body.author, undefined)
      assert.strictEqual(response.body.url, undefined)
      assert.strictEqual(response.body.likes, undefined)

      const savedPosts = await helper.allBlogs()
      assert.strictEqual(savedPosts.length, helper.initialBlogs.length)

      const errors = response.body.validationErrors.map(error => error.code)
      assert(errors.includes('e00010'))

    })

    test('with no url raises error', async () => {
      const newPost = {
        title: 'Ardo por dentro',
        author: 'Víctor García',
        likes: 999
      }
      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newPost)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.title, undefined)
      assert.strictEqual(response.body.author, undefined)
      assert.strictEqual(response.body.url, undefined)
      assert.strictEqual(response.body.likes, undefined)

      const savedPosts = await helper.allBlogs()
      assert.strictEqual(savedPosts.length, helper.initialBlogs.length)

      const errors = response.body.validationErrors.map(error => error.code)
      assert(errors.includes('e00030'))
    })

    test('with short texts raises errors', async () => {
      const newPost = {
        title: 'No',
        author: 'Yo',
        url: 'no',
        likes: 999
      }
      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newPost)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.title, undefined)
      assert.strictEqual(response.body.author, undefined)
      assert.strictEqual(response.body.url, undefined)
      assert.strictEqual(response.body.likes, undefined)

      const savedPosts = await helper.allBlogs()
      assert.strictEqual(savedPosts.length, helper.initialBlogs.length)

      const errors = response.body.validationErrors.map(error => error.code)
      assert(errors.includes('e00011'))
      assert(errors.includes('e00021'))
      assert(errors.includes('e00031'))
    })

    test('with malformed url raises errors', async () => {
      const newPost = {
        title: 'Ardo por dentro',
        author: 'Víctor García',
        url: 'Ardo por dentro',
        likes: 999
      }
      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newPost)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.title, undefined)
      assert.strictEqual(response.body.author, undefined)
      assert.strictEqual(response.body.url, undefined)
      assert.strictEqual(response.body.likes, undefined)

      const savedPosts = await helper.allBlogs()
      assert.strictEqual(savedPosts.length, helper.initialBlogs.length)

      const errors = response.body.validationErrors.map(error => error.code)
      assert(errors.includes('e00032'))
    })
  })

  describe('get /api/blogs/:id', async () => {
    test('correct request', async () => {
      const newPost = {
        title: 'Ardo por dentro',
        author: 'Víctor García',
        url: 'ardo-por-dentro',
        likes: 999
      }
      const savedBlog = (await helper.saveBlog(newPost)).toJSON()

      const requestedBlog = await api
        .get(`/api/blogs/${savedBlog.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(requestedBlog.body, { ...newPost, id:savedBlog.id })
    })

    test('malformed id must raise error', async () => {
      const malformedID = 'malformedID'

      const requestBlog = await api
        .get(`/api/blogs/${malformedID}`)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(requestBlog.body.error.code, 'e00000')
    })

    test('correct id not in db must raise error', async () => {
      const id = await helper.nonExistingId()

      const requestBlog = await api
        .get(`/api/blogs/${id}`)
        .expect(404)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(requestBlog.body.error.code, '404')
    })
  })

  describe('delete /api/blogs/:id', async () => {
    test('deletes correctly an item', async () => {
      const savedPosts = await helper.allBlogs()
      assert.strictEqual(savedPosts.length, helper.initialBlogs.length)

      const idToDelete = savedPosts[0].id

      await api
        .delete(`/api/blogs/${idToDelete}`)
        .expect(204)

      const currentPosts = await helper.allBlogs()
      assert.strictEqual(currentPosts.length, helper.initialBlogs.length - 1)
    })
  })

  describe('put /api/blogs/:id', async () => {
    test('updates correctly an item', async () => {
      const savedPosts = await helper.allBlogs()
      assert.strictEqual(savedPosts.length, helper.initialBlogs.length)

      const idToUpdate = savedPosts[0].id

      const updatePost = {
        title: 'Sit down in sympathy',
        author: 'Ben Weihill',
        url: 'sit-down-in-sympathy',
        likes: 69
      }

      const updatedPost = await api
        .put(`/api/blogs/${idToUpdate}`)
        .send(updatePost)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(updatedPost.body, { ...updatePost, id:idToUpdate, user })

      const currentPosts = await helper.allBlogs()
      assert.strictEqual(currentPosts.length, helper.initialBlogs.length)

      const titles = currentPosts.map(post => post.title)
      assert(titles.includes(updatePost.title))

      const authors = currentPosts.map(post => post.author)
      assert(authors.includes(updatePost.author))

      const slugs = currentPosts.map(post => post.url)
      assert(slugs.includes(updatePost.url))

      const likes = currentPosts.map(post => post.likes)
      assert(likes.includes(updatePost.likes))
    })

    test('updates only title', async () => {
      const savedPosts = await helper.allBlogs()
      assert.strictEqual(savedPosts.length, helper.initialBlogs.length)

      const idToUpdate = savedPosts[0].id

      const postToUpdate = savedPosts[0]

      const updatePost = {
        title: 'Sit down in sympathy',
      }

      const updatedPost = await api
        .put(`/api/blogs/${idToUpdate}`)
        .send(updatePost)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(updatedPost.body, { ...postToUpdate, ...updatePost, user })

      const currentPosts = await helper.allBlogs()
      assert.strictEqual(currentPosts.length, helper.initialBlogs.length)

      const titles = currentPosts.map(post => post.title)
      assert(titles.includes(updatePost.title))

      const authors = currentPosts.map(post => post.author)
      assert(authors.includes(postToUpdate.author))

      const slugs = currentPosts.map(post => post.url)
      assert(slugs.includes(postToUpdate.url))

      const likes = currentPosts.map(post => post.likes)
      assert(likes.includes(postToUpdate.likes))
    })

    test('updates only url', async () => {
      const savedPosts = await helper.allBlogs()
      assert.strictEqual(savedPosts.length, helper.initialBlogs.length)

      const idToUpdate = savedPosts[0].id

      const postToUpdate = savedPosts[0]

      const updatePost = {
        url: 'sit-down-in-sympathy',
      }

      const updatedPost = await api
        .put(`/api/blogs/${idToUpdate}`)
        .send(updatePost)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(updatedPost.body, { ...postToUpdate, ...updatePost, user })

      const currentPosts = await helper.allBlogs()
      assert.strictEqual(currentPosts.length, helper.initialBlogs.length)

      const titles = currentPosts.map(post => post.title)
      assert(titles.includes(postToUpdate.title))

      const authors = currentPosts.map(post => post.author)
      assert(authors.includes(postToUpdate.author))

      const slugs = currentPosts.map(post => post.url)
      assert(slugs.includes(updatePost.url))

      const likes = currentPosts.map(post => post.likes)
      assert(likes.includes(postToUpdate.likes))
    })

    test('with short texts raises errors', async () => {
      const savedPosts = await helper.allBlogs()
      assert.strictEqual(savedPosts.length, helper.initialBlogs.length)

      const idToUpdate = savedPosts[0].id

      const postToUpdate = savedPosts[0]

      const updatePost = {
        title: 'No',
        author: 'Yo',
        url: 'no',
        likes: 999
      }

      const updatedPost = await api
        .put(`/api/blogs/${idToUpdate}`)
        .send(updatePost)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const currentPosts = await helper.allBlogs()
      assert.strictEqual(currentPosts.length, helper.initialBlogs.length)

      const titles = currentPosts.map(post => post.title)
      assert(titles.includes(postToUpdate.title))

      const authors = currentPosts.map(post => post.author)
      assert(authors.includes(postToUpdate.author))

      const slugs = currentPosts.map(post => post.url)
      assert(slugs.includes(postToUpdate.url))

      const likes = currentPosts.map(post => post.likes)
      assert(likes.includes(postToUpdate.likes))

      const errors = updatedPost.body.validationErrors.map(error => error.code)
      assert(errors.includes('e00011'))
      assert(errors.includes('e00021'))
      assert(errors.includes('e00031'))
    })

    test('with malformed url raises errors', async () => {
      const savedPosts = await helper.allBlogs()
      assert.strictEqual(savedPosts.length, helper.initialBlogs.length)

      const idToUpdate = savedPosts[0].id

      const postToUpdate = savedPosts[0]

      const updatePost = {
        url: 'this is not going to be saved'
      }

      const updatedPost = await api
        .put(`/api/blogs/${idToUpdate}`)
        .send(updatePost)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const currentPosts = await helper.allBlogs()
      assert.strictEqual(currentPosts.length, helper.initialBlogs.length)

      const titles = currentPosts.map(post => post.title)
      assert(titles.includes(postToUpdate.title))

      const authors = currentPosts.map(post => post.author)
      assert(authors.includes(postToUpdate.author))

      const slugs = currentPosts.map(post => post.url)
      assert(slugs.includes(postToUpdate.url))

      const likes = currentPosts.map(post => post.likes)
      assert(likes.includes(postToUpdate.likes))

      const errors = updatedPost.body.validationErrors.map(error => error.code)
      assert(errors.includes('e00032'))
    })
  })
})