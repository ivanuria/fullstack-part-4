const { describe, test, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const { app, mongod } = require('../app')
const supertest = require('supertest')
const { mongoDBDisconnect } = require('../utils/mongodb')
const helper = require('./users_helper')
const { addUser } = require('../utils/user_helper')

const api = supertest(app)

const rootUser = {
  username: 'root',
  password: 'iamroot',
  name: 'I am ROOT'
}

describe('user administration', async () => {
  beforeEach(async () => {
    await helper.deleteAllUsers()
    await addUser(rootUser)
  })

  after(async() => {
    await mongoDBDisconnect(await mongod)
  })

  describe('post /api/users', async () => {
    test('adding a correct brand-new user', async () => {
      const dataToAdd = {
        username: 'username',
        name: 'name',
        password : 'password'
      }

      const usersStartAt = await helper.getAllUsers()

      await api
        .post('/api/users')
        .send(dataToAdd)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.getAllUsers()
      assert.strictEqual(usersAtEnd.length, usersStartAt.length + 1)

      const usernames = usersAtEnd.map(user => user.username)
      assert(usernames.includes(dataToAdd.username))
    })

    test('no username nor name raises error', async () => {
      const dataToAdd = {
        username: '',
        name: '',
        password : 'password'
      }

      const usersAtStart = await helper.getAllUsers()

      const result = await api
        .post('/api/users')
        .send(dataToAdd)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const errorcodes = result.body.validationErrors.map(error => error.code)
      assert(errorcodes.includes('e00040'))
      assert(errorcodes.includes('e00050'))

      const usersAtEnd = await helper.getAllUsers()
      assert.strictEqual(usersAtStart.length, usersAtEnd.length)
    })
    test('short username or short name raises error', async () => {
      const dataToAdd = {
        username: 'me',
        name: 'me',
        password : 'password'
      }

      const usersAtStart = await helper.getAllUsers()

      const result = await api
        .post('/api/users')
        .send(dataToAdd)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const errorcodes = result.body.validationErrors.map(error => error.code)
      assert(errorcodes.includes('e00041'))
      assert(errorcodes.includes('e00051'))

      const usersAtEnd = await helper.getAllUsers()
      assert.strictEqual(usersAtStart.length, usersAtEnd.length)
    })

    test('duplicated username raises error', async () => {
      const dataToAdd = {
        username: 'root',
        name: 'mename',
        password : 'password'
      }

      const usersAtStart = await helper.getAllUsers()

      const result = await api
        .post('/api/users')
        .send(dataToAdd)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const errorcodes = result.body.validationErrors.map(error => error.code)
      assert(errorcodes.includes('e00042'))

      const usersAtEnd = await helper.getAllUsers()
      assert.strictEqual(usersAtStart.length, usersAtEnd.length)
    })

    test('no password raises error', async () => {
      const dataToAdd = {
        username: 'username',
        name: 'name',
        password : ''
      }

      const usersAtStart = await helper.getAllUsers()

      const result = await api
        .post('/api/users')
        .send(dataToAdd)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const errorcodes = result.body.validationErrors.map(error => error.code)
      assert(errorcodes.includes('e00060'))

      const usersAtEnd = await helper.getAllUsers()
      assert.strictEqual(usersAtStart.length, usersAtEnd.length)
    })

    test('password  of less than 3 characters raises error', async () => {
      const dataToAdd = {
        username: 'username',
        name: 'name',
        password : 'me'
      }

      const usersAtStart = await helper.getAllUsers()

      const result = await api
        .post('/api/users')
        .send(dataToAdd)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const errorcodes = result.body.validationErrors.map(error => error.code)
      assert(errorcodes.includes('e00061'))

      const usersAtEnd = await helper.getAllUsers()
      assert.strictEqual(usersAtStart.length, usersAtEnd.length)
    })
  })
})