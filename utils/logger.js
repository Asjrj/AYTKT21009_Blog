
const logger = (request, response, next) => {
  if (process.env.NODE_ENV === 'test') {
    return next()
  }
  console.log('*** Method:', request.method)
  console.log('*** Path:  ', request.path)
  console.log('*** Body:  ', request.body)
  next()
}

module.exports = logger
