const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  try {
    const blogs = await Blog.find({})
    response.json(blogs)
  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'Unexpected error' })
  }
})

blogsRouter.post('/', async (request, response) => {
  try {
    const data = request.body

    if (data.author === undefined || data.title === undefined || data.url === undefined) {
      return response.status(400).send({ error: 'Author, title and url must be specified' })
    }

    if (data.likes === undefined) {
      data.likes = 0
    }

    const blog = new Blog(data)
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)

  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'Unexpected error' })
  }
})

module.exports = blogsRouter
