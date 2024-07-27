const { describe, test, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const { app, mongod } = require('../app')
const supertest = require('supertest')
const { mongoDBDisconnect } = require('../utils/mongodb')
const { rootUser, deleteAllUsers, getAllUsers, addUser } = require('../utils/user_helper')

const api = supertest(app)

describe('user administration', async () => {
  beforeEach(async () => {
    await deleteAllUsers()
    await addUser(rootUser)
  })

  after(async() => {
    await mongoDBDisconnect(await mongod)
  })

  describe('get /api/users', async () => {
    test('returns correct amount of users and no sensible data', async() => {
      const users = await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(users.body.length, 1)
      assert.strictEqual(users.body[0].username, rootUser.username)
      assert.strictEqual(users.body[0].name, rootUser.name)
      assert(users.body[0].blogs)
      assert(!(users.body[0].password))
      assert(!(users.body[0].passwordHash))
      assert(!(users.body[0].currentHash))
    })
  })

  describe('post /api/users', async () => {
    test('adding a correct brand-new user', async () => {
      const dataToAdd = {
        username: 'username',
        name: 'name',
        password : 'password'
      }

      const usersStartAt = await getAllUsers()

      await api
        .post('/api/users')
        .send(dataToAdd)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await getAllUsers()
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

      const usersAtStart = await getAllUsers()

      const result = await api
        .post('/api/users')
        .send(dataToAdd)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const errorcodes = result.body.validationErrors.map(error => error.code)
      assert(errorcodes.includes('e00040'))
      assert(errorcodes.includes('e00050'))

      const usersAtEnd = await getAllUsers()
      assert.strictEqual(usersAtStart.length, usersAtEnd.length)
    })
    test('short username or short name raises error', async () => {
      const dataToAdd = {
        username: 'me',
        name: 'me',
        password : 'password'
      }

      const usersAtStart = await getAllUsers()

      const result = await api
        .post('/api/users')
        .send(dataToAdd)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const errorcodes = result.body.validationErrors.map(error => error.code)
      assert(errorcodes.includes('e00041'))
      assert(errorcodes.includes('e00051'))

      const usersAtEnd = await getAllUsers()
      assert.strictEqual(usersAtStart.length, usersAtEnd.length)
    })

    test('duplicated username raises error', async () => {
      const dataToAdd = {
        username: 'root',
        name: 'mename',
        password : 'password'
      }

      const usersAtStart = await getAllUsers()

      const result = await api
        .post('/api/users')
        .send(dataToAdd)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const errorcodes = result.body.validationErrors.map(error => error.code)
      assert(errorcodes.includes('e00042'))

      const usersAtEnd = await getAllUsers()
      assert.strictEqual(usersAtStart.length, usersAtEnd.length)
    })

    test('no password raises error', async () => {
      const dataToAdd = {
        username: 'username',
        name: 'name',
        password : ''
      }

      const usersAtStart = await getAllUsers()

      const result = await api
        .post('/api/users')
        .send(dataToAdd)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const errorcodes = result.body.validationErrors.map(error => error.code)
      assert(errorcodes.includes('e00060'))

      const usersAtEnd = await getAllUsers()
      assert.strictEqual(usersAtStart.length, usersAtEnd.length)
    })

    test('password  of less than 3 characters raises error', async () => {
      const dataToAdd = {
        username: 'username',
        name: 'name',
        password : 'me'
      }

      const usersAtStart = await getAllUsers()

      const result = await api
        .post('/api/users')
        .send(dataToAdd)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const errorcodes = result.body.validationErrors.map(error => error.code)
      assert(errorcodes.includes('e00061'))

      const usersAtEnd = await getAllUsers()
      assert.strictEqual(usersAtStart.length, usersAtEnd.length)
    })
  })

  describe('post /api/login', async () => {
    test('correct login', async () => {
      const result = await api
        .post('/api/login')
        .send({
          username: rootUser.username,
          password: rootUser.password
        })
        .expect(200)
        .expect('Content-type', /application\/json/)

      console.log(result.body)
    })
  })
})