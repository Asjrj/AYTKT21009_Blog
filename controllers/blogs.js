const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  try {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, adult: 1 })
    response.json(blogs.map(Blog.format))
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

    const token = request.token
    const decodedToken = jwt.verify(token, process.env.BLOG_SECRET)
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)
    data.user = user._id
    const blog = new Blog(data)
    const savedBlog = await blog.save()
    if (user.blogs === undefined) { user.blogs = [] }
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)

  } catch (exception) {
    if (exception.name === 'JsonWebTokenError') {
      response.status(401).json({ error: exception.message })
    } else {
      console.log(exception)
      response.status(500).json({ error: 'Unexpected error' })
    }
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  try {
    const token = request.token
    const decodedToken = jwt.verify(token, process.env.BLOG_SECRET)
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)
    const blog = await Blog.findById(request.params.id)
    if (blog.user.toString() === user.id) {
      await Blog.findByIdAndDelete(request.params.id)
      response.status(204).end()
    }
    else {
      return response.status(400).json({ error: 'Blog can be deleted only by user, who creted it' })
    }
  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'Unexpected error' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  try {
    const data = request.body
    if (data.author === undefined || data.title === undefined || data.url === undefined) {
      return response.status(400).send({ error: 'Author, title and url must be specified' })
    }
    if (data.likes === undefined) {
      data.likes = 0
    }
    const newBlog = {
      title: data.title,
      author: data.author,
      url: data.url,
      likes: data.likes
    }
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newBlog, { new: true })
    response.status(201).json(updatedBlog)
  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'Unexpected error' })
  }
})

module.exports = blogsRouter
