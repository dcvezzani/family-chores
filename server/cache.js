const fs = require('fs')

const CACHE_PATH = `./cache/cache.json`

const _users = JSON.parse(fs.readFileSync(CACHE_PATH))

exports.users = {
  all: _users,
  get: (id) => { return _users[id] },
  set: (id, user) => { 
    _users[id] = user
    fs.writeFileSync(CACHE_PATH, JSON.stringify(_users))
  },
  clear: (id) => { 
    delete _users[id]
    fs.writeFileSync(CACHE_PATH, JSON.stringify(_users))
  },
}

