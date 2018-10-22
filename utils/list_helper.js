const dummy = (blogs) => {
  return 1
}

const dummyBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5
  },
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12
  },
  {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10
  },
  {
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0
  },
  {
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2
  }
]

const totalLikes = (blogs) => {
  return blogs.reduce((acc, cur) => acc + cur.likes, 0)
}

const favouriteBlog = (blogs) => {
  let highestlikes = 0
  let favouriteIndex = 0
  let i = 0
  blogs.forEach((element) => {
    if (element.likes > highestlikes) {
      highestlikes = element.likes
      favouriteIndex = i
    }
    i++
  })

  return {
    author: blogs[favouriteIndex].author,
    likes: blogs[favouriteIndex].likes,
    title: blogs[favouriteIndex].title
  }
}

const mostBlogs = (blogs) => {
  let writers = []
  blogs.forEach((element) => {
    let found = writers.find((writer) => {
      return (writer.author === element.author)
    })
    if (found) {
      found.blogs++
    }
    else {
      writers.push({
        author: element.author,
        blogs: 1
      })
    }
  })

  let highestblogs = 0
  let highestindex = 0
  let i = 0
  writers.forEach((element) => {
    if (element.blogs > highestblogs) {
      highestblogs = element.blogs
      highestindex = i
    }
    i++
  })

  return {
    author: writers[highestindex].author,
    blogs: writers[highestindex].blogs
  }
}

const mostLikes = (blogs) => {
  let writers = []
  blogs.forEach((element) => {
    let found = writers.find((writer) => {
      return (writer.author === element.author)
    })
    if (found) {
      found.likes = found.likes + element.likes
    }
    else {
      writers.push({
        author: element.author,
        likes: element.likes
      })
    }
  })

  let highestlikes = 0
  let highestindex = 0
  let i = 0
  writers.forEach((element) => {
    if (element.likes > highestlikes) {
      highestlikes = element.likes
      highestindex = i
    }
    i++
  })

  return {
    author: writers[highestindex].author,
    likes: writers[highestindex].likes
  }
}

module.exports = {
  dummy,
  dummyBlogs,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
}
