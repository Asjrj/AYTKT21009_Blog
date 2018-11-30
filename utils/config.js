let port = process.env.BLOG_PORT || 5000
let mongoUrl = process.env.BLOG_DB_URL

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
  mongoUrl = process.env.BLOG_TEST_DB_URL
  port = 3003
}

module.exports = { port, mongoUrl }