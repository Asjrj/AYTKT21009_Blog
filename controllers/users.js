const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  try {
    const users = await User.find({})
    response.status(200).json(users.map(User.format))
  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'Unexpected error' })
  }
})

usersRouter.post('/', async (request, response) => {
  try {
    const data = request.body
    if (data.username === undefined || data.password === undefined || data.name === undefined) {
      return response.status(400).send({ error: 'Username, password and name must be specified' })
    }
    if (data.password.length < 3) {
      return response.status(400).send({ error: 'Password must be at least 3 characters long' })
    }
    let result = await User.find({ username: data.username })
    if (result.length > 0) {
      return response.status(400).send({ error: 'Username already exists' })
    }
    if (data.adult === undefined) {
      data.adult = true
    }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(data.password, saltRounds)
    const user = new User({
      username: data.username,
      name: data.name,
      adult: data.adult,
      password: passwordHash
    })
    const savedUser = await user.save()
    response.status(201).json(User.format(savedUser))

  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'Unexpected error' })
  }
})

module.exports = usersRouter
