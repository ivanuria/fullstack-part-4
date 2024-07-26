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

  test('post /api/users', async () => {
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
})