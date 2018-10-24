const Blog = require('../models/blog')
const User = require('../models/user')
const listHelper = require('../utils/list_helper')
const testHelper = require('../utils/test_helper')
const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)

beforeAll(async () => {
  await Blog.remove({})
  const blogList = listHelper.dummyBlogs.map(b => new Blog(b))
  const promiseArray = blogList.map(b => b.save())
  await Promise.all(promiseArray)
  await User.remove({})
  const newUser = {
    username: 'superuser',
    password: 'salainen',
    name: 'Pekka Pääkäyttäjä'
  }
  await api
    .post('/api/users')
    .send(newUser)
})

describe('API tests', () => {

  test('Blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const blogsFound = await testHelper.blogsInDb()
    expect(blogsFound.length).toBe(listHelper.dummyBlogs.length)
  })
})

describe('API Favourite blog', () => {
  let favourite = {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    likes: 12
  }
  test('is found', async () => {
    const blogsFound = await testHelper.blogsInDb()
    const result = listHelper.favouriteBlog(blogsFound)
    expect(result).toEqual(favourite)
  })
})

describe('API Most blogs', () => {
  let expectedResult = {
    author: 'Robert C. Martin',
    blogs: 3
  }
  test('is found', async () => {
    const blogsFound = await testHelper.blogsInDb()
    const result = listHelper.mostBlogs(blogsFound)
    expect(result).toEqual(expectedResult)
  })
})

describe('API Most likes', () => {
  let expectedResult = {
    author: 'Edsger W. Dijkstra',
    likes: 17
  }
  test('is found', async () => {
    const blogsFound = await testHelper.blogsInDb()
    const result = listHelper.mostLikes(blogsFound)
    expect(result).toEqual(expectedResult)
  })
})

describe('API POST', () => {
  test('a new blog added succesfully', async () => {
    const newUser = {
      username: 'superuser',
      password: 'salainen',
      name: 'Pekka Pääkäyttäjä'
    }
    const userLogin = await api
      .post('/api/login')
      .send(newUser)

    const blogsBefore = await testHelper.blogsInDb()
    const newBlog = {
      title: '2ality – JavaScript and more',
      author: 'Dr. Axel Rauschmayer',
      url: 'http://2ality.com/',
      likes: 2
    }
    const response = await api
      .post('/api/blogs')
      .set('Authorization', 'bearer ' + userLogin.body.token)
      .send(newBlog)
      .expect(201)
    const blogsAfter = await testHelper.blogsInDb()
    expect(response.body.title).toEqual(newBlog.title)
    expect(blogsAfter.length).toBe(blogsBefore.length + 1)
  })

  test('blog with insufficient data is not added', async () => {
    const blogsBefore = await testHelper.blogsInDb()
    const badBlog = {
      author: 'Dr. Axel Rauschmayer',
      url: 'http://2ality.com/'
    }
    await api
      .post('/api/blogs')
      .send(badBlog)
      .expect(400)
    const blogsAfter = await testHelper.blogsInDb()
    expect(blogsBefore.length).toBe(blogsAfter.length)
  })

  test('blog with no likes is initialized with likes = zero', async () => {
    const newUser = {
      username: 'superuser',
      password: 'salainen',
      name: 'Pekka Pääkäyttäjä'
    }
    const userLogin = await api
      .post('/api/login')
      .send(newUser)
    const blogsBefore = await testHelper.blogsInDb()
    const zeroLikesBlog = {
      title: 'David Walsh Blog',
      author: 'David Walsh',
      url: 'https://davidwalsh.name/'
    }
    const response = await api
      .post('/api/blogs')
      .set('Authorization', 'bearer ' + userLogin.body.token)
      .send(zeroLikesBlog)
      .expect(201)
    const blogsAfter = await testHelper.blogsInDb()
    expect(blogsAfter.length).toBe(blogsBefore.length + 1)
    expect(response.body.likes).toBe(0)
  })
})

describe('API DELETE and PUT', () => {
  test('a blog deleted succesfully', async () => {
    const newUser = {
      username: 'superuser',
      password: 'salainen',
      name: 'Pekka Pääkäyttäjä'
    }
    const userLogin = await api
      .post('/api/login')
      .send(newUser)
    const blog = await Blog.findOne({ title: '2ality – JavaScript and more' })
    const blogsBefore = await testHelper.blogsInDb()
    await api
      .delete('/api/blogs/' + blog._id)
      .set('Authorization', 'bearer ' + userLogin.body.token)
      .expect(204)
    const blogsAfter = await testHelper.blogsInDb()
    expect(blogsAfter.length).toBe(blogsBefore.length - 1)
  })

  test('a blog updated succesfully', async () => {
    const result = await api.get('/api/blogs')
    const firstBlog = result.body[0]
    firstBlog.title = 'Title changed'
    await api.
      put('/api/blogs/' + firstBlog.id)
      .send(firstBlog)
      .expect(201)
  })
})

describe('USER API', () => {
  test('a user is created succesfully', async () => {
    const usersBefore = await testHelper.usersInDb()
    const newUser = {
      username: 'koeKayttaja',
      password: 'salasana1',
      name: 'Kalle Käyttäjä'
    }
    const response = await api
      .post('/api/users')
      .send(newUser)
    const usersAfter = await testHelper.usersInDb()

    expect(response.body.username).toEqual(newUser.username)
    expect(response.body.adult).toBeTruthy()
    expect(usersAfter.length).toBe(usersBefore.length + 1)
  })

  test('an existing username is not accepted', async () => {
    const usersBefore = await testHelper.usersInDb()
    const newUser = {
      username: 'koeKayttaja',
      password: 'salasana1',
      name: 'Kalle Käyttäjä'
    }
    const response = await api
      .post('/api/users')
      .send(newUser)
    const usersAfter = await testHelper.usersInDb()

    expect(response.status).toBe(400)
    expect(response.body.error).toEqual('Username already exists')
    expect(usersAfter.length).toBe(usersBefore.length)
  })

  test('a password less than 3 characters long is not accepted', async () => {
    const usersBefore = await testHelper.usersInDb()
    const newUser = {
      username: 'ToinenKayttaja',
      password: 'sa',
      name: 'Toinen Käyttäjä'
    }
    const response = await api
      .post('/api/users')
      .send(newUser)
    const usersAfter = await testHelper.usersInDb()

    expect(response.status).toBe(400)
    expect(response.body.error).toEqual('Password must be at least 3 characters long')
    expect(usersAfter.length).toBe(usersBefore.length)
  })
})

describe('Blog not deleted', () => {
  test('by wrong user', async () => {
    const newUser = {
      username: 'koeKayttaja',
      password: 'salasana1',
      name: 'Kalle Käyttäjä'
    }
    const userLogin = await api
      .post('/api/login')
      .send(newUser)
    const blog = await Blog.findOne({ title: 'David Walsh Blog' })
    const blogsBefore = await testHelper.blogsInDb()
    await api
      .delete('/api/blogs/' + blog._id)
      .set('Authorization', 'bearer ' + userLogin.body.token)
      .expect(400)
    const blogsAfter = await testHelper.blogsInDb()
    expect(blogsAfter.length).toBe(blogsBefore.length)
  })
})


afterAll(async () => {
  await server.close()
})
