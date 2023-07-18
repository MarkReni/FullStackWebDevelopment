const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const Blog = require('../models/blog')
const User = require('../models/user')
let token = null

beforeAll(async () => {
  await User.deleteMany({})

  const user =
    {
      username: helper.initialUsers[0].username,
      name: helper.initialUsers[0].name,
      passwordHash: await bcrypt.hash(helper.initialUsers[0].password, 10)
    }

  const userObject = new User(user)

  await userObject.save()

  const loginUser =
    {
      username: 'root',
      password: 'salainen'
    }

  const loginResponse = await api
    .post('/api/login')
    .set({ 'Content-Type': 'application/json' })
    .send(loginUser)

  token = loginResponse.body.token
})

beforeEach(async () => {
  await Blog.deleteMany({})
  const response = await api
    .get('/api/users')
  const user = response.body[0]
  const blogObjects = helper.initialBlogs
    .map(blog => new Blog({ ...blog, user: user.id }))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await helper.blogsInDb()

    expect(response).toHaveLength(helper.initialBlogs.length)
  })

  test('unique identifier property of the blog posts is named id', async () => {
    const response = await helper.blogsInDb()

    expect(response[0].id).toBeDefined()
  })
})

describe('addition of a new blog', () => {
  test('a valid blog can be added', async () => {
    const newBlog =
      {
        title: 'Python programming',
        author: 'Guido van Rossum',
        url: 'https://pythonprogramming.com/',
        likes: 20,
      }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ 'authorization': `Bearer ${token}` })
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await helper.blogsInDb()
    const contents = response.map(blog => blog.title)

    expect(response).toHaveLength(helper.initialBlogs.length + 1)
    expect(contents).toContain(
      'Python programming'
    )
  })

  test('blog post without "likes" property is defaulted to zero', async () => {
    const newBlog =
      {
        title: 'Scala programming',
        author: 'Martin Odersky',
        url: 'https://scalaprogramming.com/',
      }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ 'authorization': `Bearer ${token}` })
      .expect(201)

    const response = await helper.blogsInDb()
    const blogsLength = response.length
    const addedBlog = response[blogsLength - 1]

    expect(addedBlog.likes).toBe(0)
    expect(addedBlog.title).toContain(
      'Scala programming'
    )
  })

  test('blog post without "title" property is not added', async () => {
    const newBlog =
      {
        author: 'Yukihiro Matsumoto',
        url: 'https://rubyprogramming.com/',
        likes: 50
      }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ 'authorization': `Bearer ${token}` })
      .expect(400)

    const response = await helper.blogsInDb()

    expect(response).toHaveLength(helper.initialBlogs.length)
  })

  test('blog post without "url" property is not added', async () => {
    const newBlog =
      {
        title: 'Ruby programming',
        author: 'Yukihiro Matsumoto',
        likes: 50
      }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ 'authorization': `Bearer ${token}` })
      .expect(400)

    const response = await helper.blogsInDb()

    expect(response).toHaveLength(helper.initialBlogs.length)
  })

  test('a blog fails with status code 401 Unauthorized if a token is not provided', async () => {
    const newBlog =
      {
        title: 'Pascal programming',
        author: 'Niklaus Wirth',
        likes: 100
      }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ 'authorization': 'Bearer' })  // token is not provided
      .expect(401)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStartResponse = await helper.blogsInDb()
    const blogToDelete = blogsAtStartResponse[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set({ 'authorization': `Bearer ${token}` })
      .expect(204)

    const blogsAtEndResponse = await helper.blogsInDb()

    expect(blogsAtEndResponse).toHaveLength(
      helper.initialBlogs.length - 1
    )

    const contents = blogsAtEndResponse.map(blog => blog.title)

    expect(contents).not.toContain(blogToDelete.content)
  })

  test('does not succeed with status code 400 if id is invalid', async () => {
    await api
      .delete(`/api/blogs/${'0000'}`)
      .set({ 'authorization': `Bearer ${token}` })
      .expect(400)

    const response = await helper.blogsInDb()

    expect(response).toHaveLength(helper.initialBlogs.length)
  })

  test('does not succeed with status code 401 if token is not provided', async () => {
    const blogsAtStartResponse = await helper.blogsInDb()
    const blogToDelete = blogsAtStartResponse[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set({ 'authorization': 'Bearer' })  // token is not provided
      .expect(401)

    const response = await helper.blogsInDb()

    expect(response).toHaveLength(helper.initialBlogs.length)
  })
})

describe('updating a blog', () => {
  test('succeeds with status code 200 when a blog is updated', async () => {
    const updatedBlog = { ...helper.initialBlogs[0], likes: 70 }

    await api
      .put(`/api/blogs/${updatedBlog._id}`)
      .send(updatedBlog)
      .expect(200)

    const blogsAtEndResponse = await helper.blogsInDb()
    const likes = blogsAtEndResponse.map(blog => blog.likes)

    expect(likes).toContain(70)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
