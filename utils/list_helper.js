const dummy = (blogs) => {
    return 1
}

const dummyBlogs = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    },
    {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
    },
    {
        _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
        __v: 0
    },
    {
        _id: "5a422ba71b54a676234d17fb",
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
        __v: 0
    },
    {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
        __v: 0
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
    });

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
    });

    let highestblogs = 0
    let highestindex = 0
    let i = 0
    writers.forEach((element) => {
        if (element.blogs > highestblogs) {
            highestblogs = element.blogs
            highestindex = i
        }
        i++
    });

    return {
        author: writers[highestindex].author,
        blogs: writers[highestindex].blogs
    }
}

module.exports = {
    dummy,
    dummyBlogs,
    totalLikes,
    favouriteBlog,
    mostBlogs
}
