const listHelper = require('../utils/list_helper')

describe('DUMMY', () => {

  test('dummy is called', () => {
    const blogs = []
    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
  })

})

describe('Total likes', () => {

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])
    expect(result).toBe(0)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(listHelper.dummyBlogs)
    expect(result).toBe(36)
  })


})
