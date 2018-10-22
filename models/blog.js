const mongoose = require('mongoose')
const config = require('../utils/config')

mongoose
  .connect(config.mongoUrl, { useNewUrlParser: true })
  .then(() => {
    console.log('connected to database', config.mongoUrl)
  })
  .catch(err => {
    console.log(err)
  })

const Blog = mongoose.model('Blog', {
  title: String,
  author: String,
  url: String,
  likes: Number
})

module.exports = Blog
