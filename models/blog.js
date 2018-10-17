const mongoose = require('mongoose')

const mongoUrl = process.env.BLOG_DB_URL
mongoose.connect(mongoUrl, { useNewUrlParser: true })

const Blog = mongoose.model('Blog', {
    title: String,
    author: String,
    url: String,
    likes: Number
})

module.exports = Blog
