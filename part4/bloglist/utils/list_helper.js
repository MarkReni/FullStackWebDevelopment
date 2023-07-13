var _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => sum + item

  return blogs.map(blog => blog.likes).reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const reducer = (prev, current) => (prev.likes > current.likes) ? prev: current
  const { title, author, likes } = blogs.reduce(reducer, 0)
  return { title, author, likes }
}

const mostBlogs = (blogs) => {
  if(blogs.length === 0) return {}
  const mostBlogs = _.maxBy(_.entries(_.countBy(blogs, (blog) => { return blog.author })), _.last)
  return Object.assign({ 'author': mostBlogs[0], 'blogs': mostBlogs[1] })
}

const mostLikes = (blogs) => {
  if(blogs.length === 0) return {}
  const onlyLikes = blogs.map(blog => Object.assign({ 'author':blog.author, 'likes':blog.likes }))
  const mostLikes = _.maxBy(_.map(_.groupBy(onlyLikes, (blog) => blog.author), (value, author) => ({
    'author': author,
    'likes': _.sumBy(value, 'likes')
  })), 'likes')

  return mostLikes
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}