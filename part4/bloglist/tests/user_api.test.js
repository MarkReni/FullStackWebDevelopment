const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})

  const userObjects = helper.initialUsers
    .map(user => new User(user))
  const promiseArray = userObjects.map(user => user.save())
  await Promise.all(promiseArray)
})

describe('a valid user post request is saved to database', () => {
  test('a valid user post is saved', async () => {
    const newUser =
    {
      'username': 'root2',
      'name': 'Super2',
      'password': 'salainen2'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)

    const usersAtEndResponse = await helper.usersInDb()
    const contents = usersAtEndResponse.map(user => user.username)

    expect(contents.length).toBe(2)
    expect(contents).toContain(newUser.username)
  })
})

describe('user post requests that have invalid username are not saved', () => {
  test('expected status code and error message are returned when user post request with duplicate username is sent', async () => {
    const newUser =
    {
      'username': 'root',
      'name': 'Super',
      'password': 'salainen'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(response.text).toBe('{"error":"User validation failed: username: Error, expected `username` to be unique. Value: `root`"}')
  })

  test('expected status code and error message are returned when user post request with invalid username is sent', async () => {
    const newUser1 =
    {
      'username': 'Ma',
      'name': 'Superuser',
      'password': 'salainen'
    }

    const response = await api
      .post('/api/users')
      .send(newUser1)
      .expect(400)

    expect(response.text).toBe('{"error":"User validation failed: username: Path `username` (`Ma`) is shorter than the minimum allowed length (3)."}')
  })

  test('no new users have been added to the database', async () => {
    const usersAtEndResponse = await helper.usersInDb()
    const contents = usersAtEndResponse.map(user => user.username)

    expect(contents.length).toBe(1)
    expect(contents).toContain(helper.initialUsers[0].username)
  })
})

describe('user post requests that have invalid password are not saved', () => {
  test('expected status code and error message are returned when user post request with missing password is sent', async () => {
    const newUser =
    {
      'username': 'Mark',
      'name': 'Mark',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(response.text).toBe('{"error":"no password provided"}')
  })

  test('expected status code and error message are returned when user post request with invalid password is sent', async () => {
    const newUser =
    {
      'username': 'Mark',
      'name': 'Mark',
      'password': 'sa'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(response.text).toBe('{"error":"password should be at least 3 characters long"}')
  })

  test('no new users have been added to the database', async () => {
    const usersAtEndResponse = await helper.usersInDb()
    const contents = usersAtEndResponse.map(user => user.username)

    expect(contents.length).toBe(1)
    expect(contents).toContain(helper.initialUsers[0].username)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})