class ApplicationError extends Error {
  constructor(message, ...args) {
      super(...args)
      this.name = 'ApplicationError'
      this.message = message
      this.customError = true
  }

  toJSON() {
    return {
      error: {
        name: this.name,
        message: this.message,
        stacktrace: this.stack
      }
    }
  }
}

exports.AccessNotAuthorized = class extends ApplicationError {
  constructor(...args) {
      if (args.length === 0) args[0] = `User is not authorized to access requested resource`
    
      super(...args)
      this.name = 'AccessNotAuthorized'
  }
}

exports.FailedToFetchStateUuid = class extends ApplicationError {
  constructor(...args) {
      if (args.length === 0) args[0] = `Application failed to fetch state uuid from server`
    
      super(...args)
      this.name = 'FailedToFetchStateUuid'
      this.status = 500
  }
}

exports.handlePromiseError = (message, defaultValue=null) => (err) => {
  console.error(message, err)
  Promise.resolve(defaultValue)
}
