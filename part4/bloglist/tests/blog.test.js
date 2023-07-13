const listHelper = require('../utils/list_helper')
const helper = require('./test_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('totalLikes function', () => {
  test('total sum of likes of all blogs is correct', () => {
    const result = listHelper.totalLikes(helper.initialBlogs)
    expect(result).toBe(36)
  })
  test('likes of the first blog is correct', () => {
    const result = listHelper.totalLikes([helper.initialBlogs[0]])
    expect(result).toBe(7)
  })

  test('likes are zero when there are no blogs', () => {
    const result = listHelper.totalLikes([])
    expect(result).toBe(0)
  })
})

describe('favoriteBLog function', () => {
  test('blog with the most likes is returned', () => {
    const result = listHelper.favoriteBlog(helper.initialBlogs)
    expect(result).toEqual({
      'author': 'Edsger W. Dijkstra',
      'likes': 12,
      'title': 'Canonical string reduction',
    })
  })
  test('the first blog is returned', () => {
    const result = listHelper.favoriteBlog([helper.initialBlogs[0]])
    expect(result).toEqual({
      'title': 'React patterns',
      'author': 'Michael Chan',
      'likes': 7
    })
  })
  test('the first blog data does not match', () => {
    const result = listHelper.favoriteBlog([helper.initialBlogs[0]])
    expect(result).not.toEqual({
      'title': 'React patterns',
      'author': 'Michael Chan',
      'likes': 8
    })
  })
  test('empty blog', () => {
    const result = listHelper.favoriteBlog([])
    expect(result).toEqual({
      'title': undefined,
      'author': undefined,
      'likes': undefined
    })
  })
})

describe('mostBlogs function', () => {
  test('author with most blogs is returned', () => {
    const result = listHelper.mostBlogs(helper.initialBlogs)
    expect(result).toEqual({
      'author': 'Robert C. Martin',
      'blogs': 3
    })
  })
  test('the first author is returned correctly', () => {
    const result = listHelper.mostBlogs([helper.initialBlogs[0]])
    expect(result).toEqual({
      'author': 'Michael Chan',
      'blogs': 1
    })
  })
  test('empty blog returns an empty object', () => {
    const result = listHelper.mostBlogs([])
    expect(result).toEqual({ })
  })
})

describe('mostLikes function', () => {
  test('author with most likes is returned', () => {
    const result = listHelper.mostLikes(helper.initialBlogs)
    expect(result).toEqual({
      'author': 'Edsger W. Dijkstra',
      'likes': 17
    })
  })
  test('the first author is returned correctly', () => {
    const result = listHelper.mostLikes([helper.initialBlogs[0]])
    expect(result).toEqual({
      'author': 'Michael Chan',
      'likes': 7
    })
  })
  test.only('empty blog returns an empty object', () => {
    const result = listHelper.mostLikes([])
    expect(result).toEqual({ })
  })
})