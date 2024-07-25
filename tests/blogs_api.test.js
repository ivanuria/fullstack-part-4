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

  test('get /api/blogs returns json object', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('get /api/blogs returns the correct amount of blogs', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('get /api/blogs returns the cids fo objects under >>id<< instead of >>_id<<', async () => {
    const response = await api.get('/api/blogs')
    console.log(response.body[0])
    assert.strictEqual('__v' in response.body[0], false)
    assert.strictEqual('_id' in response.body[0], false)
    assert('id' in response.body[0])
  })
})