const { describe, test, before, after, beforeEach } = require('node:test')
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

  test('get /api/blogs returns the correct amount of blogs', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })
})