const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  try {
    const users = await User.find({})
    response.json(users.map(User.format))
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
