const { describe, test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const { app, mongod } = require('../app')
const supertest = require('supertest')
const { mongoDBDisconnect } = require('../utils/mongodb')
const helper = require('./blogs_list_helper')

const api = supertest(app)

describe('blogs list api', async () => {
  after(async () => {
    await mongoDBDisconnect(await mongod)
  })

  beforeEach(async () => {
    await helper.clearBlogs()
    await helper.saveBlogs(helper.initialBlogs)
  })

  describe('get /api/blogs', async () => {
    test('returns the correct amount of blogs', async () => {
      const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.length, helper.initialBlogs.length)
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
        .send(newPost)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.title, newPost.title)
      assert.strictEqual(response.body.author, newPost.author)
      assert.strictEqual(response.body.url, newPost.url)
      assert.strictEqual(response.body.likes, newPost.likes)
    })

    test('without likes creates new blog with 0 likes', async () => {
      const newPost = {
        title: 'Ardo por dentro',
        author: 'Víctor García',
        url: 'ardo-por-dentro'
      }
      const response = await api
        .post('/api/blogs')
        .send(newPost)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.title, newPost.title)
      assert.strictEqual(response.body.author, newPost.author)
      assert.strictEqual(response.body.url, newPost.url)
      assert.strictEqual(response.body.likes, 0)
    })

    test('with no title raises error', async () => {
      const newPost = {
        author: 'Víctor García',
        url: 'ardo-por-dentro',
        likes: 999
      }
      const response = await api
        .post('/api/blogs')
        .send(newPost)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.title, undefined)
      assert.strictEqual(response.body.author, undefined)
      assert.strictEqual(response.body.url, undefined)
      assert.strictEqual(response.body.likes, undefined)

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
        .send(newPost)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.title, undefined)
      assert.strictEqual(response.body.author, undefined)
      assert.strictEqual(response.body.url, undefined)
      assert.strictEqual(response.body.likes, undefined)

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
        .send(newPost)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.title, undefined)
      assert.strictEqual(response.body.author, undefined)
      assert.strictEqual(response.body.url, undefined)
      assert.strictEqual(response.body.likes, undefined)

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
        .send(newPost)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.title, undefined)
      assert.strictEqual(response.body.author, undefined)
      assert.strictEqual(response.body.url, undefined)
      assert.strictEqual(response.body.likes, undefined)

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
      const savedBlog = await helper.saveBlog(newPost)

      const requestedBlog = await api
        .get(`/api/blogs/${savedBlog._id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(requestedBlog.body, {...newPost, id:savedBlog._id.toString()})
    })
  })
})