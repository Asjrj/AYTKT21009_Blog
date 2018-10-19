const Blog = require('../models/blog')
const listHelper = require('../utils/list_helper')
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
        const response = await api
            .get('/api/blogs')
        expect(response.body.length).toBe(listHelper.dummyBlogs.length)
    })
})

describe('API Favourite blog', () => {
    let favourite = {
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        likes: 12
    }
    test('is found', async () => {
        const response = await api
            .get('/api/blogs')
        const result = listHelper.favouriteBlog(response.body)
        expect(result).toEqual(favourite)
    })
})

describe('API Most blogs', () => {
    let expectedResult = {
        author: "Robert C. Martin",
        blogs: 3
    }
    test('is found', async () => {
        const response = await api
            .get('/api/blogs')
        const result = listHelper.mostBlogs(response.body)
        expect(result).toEqual(expectedResult)
    })
})

describe('API Most likes', () => {
    let expectedResult = {
        author: "Edsger W. Dijkstra",
        likes: 17
    }
    test('is found', async () => {
        const response = await api
            .get('/api/blogs')
        const result = listHelper.mostLikes(response.body)
        expect(result).toEqual(expectedResult)
    })
})


afterAll(() => {
    server.close()
})
