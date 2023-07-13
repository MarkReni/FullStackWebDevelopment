const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
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
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body[0].id).toBeDefined()
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
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const contents = response.body.map(blog => blog.title)

    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
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
      .expect(201)

    const response = await api.get('/api/blogs')
    const blogsLength = response.body.length
    const addedBlog = response.body[blogsLength - 1]

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
      .expect(400)
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
      .expect(400)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStartResponse = await api.get('/api/blogs')
    const blogToDelete = blogsAtStartResponse.body[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEndResponse = await api.get('/api/blogs')

    expect(blogsAtEndResponse.body).toHaveLength(
      helper.initialBlogs.length - 1
    )

    const contents = blogsAtEndResponse.body.map(blog => blog.title)

    expect(contents).not.toContain(blogToDelete.content)
  })
})

describe('updating a blog', () => {
  test.only('succeeds with status code 200 when a blog is updated', async () => {
    const updatedBlog = { ...helper.initialBlogs[0], likes: 70 }

    await api
      .put(`/api/blogs/${updatedBlog._id}`)
      .send(updatedBlog)
      .expect(200)

    const blogsAtEndResponse = await api.get('/api/blogs')
    const likes = blogsAtEndResponse.body[0].likes

    expect(likes).toBe(70)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})


//********************************************************//
