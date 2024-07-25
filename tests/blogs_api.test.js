const { describe, test, before, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const { app, mongod } = require('../app')
const supertest = require('supertest')
const { mongoDBDisconnect } = require('../utils/mongodb')
const helper = require('./blogs_list_helper')
const lodash = require('lodash')

const api = supertest(app)

describe('blogs list api', async () => {
  after(async () => {
    await mongoDBDisconnect(await mongod)
  })

  beforeEach(async () => {
    await helper.clearBlogs()
    await helper.saveBlogs(helper.initialBlogs)
  })


  test('get /api/blogs returns the correct amount of blogs', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('get /api/blogs returns the correct id for objects under >>id<< instead of >>_id<<', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual('__v' in response.body[0], false)
    assert.strictEqual('_id' in response.body[0], false)
    assert('id' in response.body[0])
  })

  test('post /api/blogs creates new blog', async () => {
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
})