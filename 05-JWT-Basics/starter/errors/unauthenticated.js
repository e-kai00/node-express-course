const {StatusCodes} = require('http-status-codes')
const CustomAPIError = require('./custom-error')

class UnathenticatedError extends CustomAPIError {
    constructor(message) {
      super(message)
      this.statusCode = StatusCodes.UNAUTHORIZED
    }
  }
  
  module.exports = UnathenticatedError
  