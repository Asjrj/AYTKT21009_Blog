const Blog = require('../models/blog')
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
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
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
    author: "Robert C. Martin",
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
    author: "Edsger W. Dijkstra",
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
    const blogsBefore = await testHelper.blogsInDb()
    const newBlog = {
      title: "2ality – JavaScript and more",
      author: "Dr. Axel Rauschmayer",
      url: "http://2ality.com/",
      likes: 2
    }
    const response = await api
      .post('/api/blogs')
      .send(newBlog)
    const blogsAfter = await testHelper.blogsInDb()
    expect(response.body.title).toEqual(newBlog.title)
    expect(blogsAfter.length).toBe(blogsBefore.length + 1)
  })

  test('blog with insufficient data is not added', async () => {
    const blogsBefore = await testHelper.blogsInDb()
    const badBlog = {
      author: "Dr. Axel Rauschmayer",
      url: "http://2ality.com/"
    }
    await api
      .post('/api/blogs')
      .send(badBlog)
      .expect(400)
    const blogsAfter = await testHelper.blogsInDb()
    expect(blogsBefore.length).toBe(blogsAfter.length)
  })

  test('blog with no likes is initialized with likes = zero', async () => {
    const blogsBefore = await testHelper.blogsInDb()
    const zeroLikesBlog = {
      title: "David Walsh Blog",
      author: "David Walsh",
      url: "https://davidwalsh.name/"
    }
    const response = await api
      .post('/api/blogs')
      .send(zeroLikesBlog)
      .expect(201)
    const blogsAfter = await testHelper.blogsInDb()
    expect(blogsAfter.length).toBe(blogsBefore.length + 1)
    expect(response.body.likes).toBe(0)
  })
})

afterAll(() => {
  server.close()
})

