const Blog = require('../models/blog')

const formatBlog = (blog) => {
  return {
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes
  }
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(formatBlog)
}

module.exports = {
  formatBlog,
  blogsInDb
}