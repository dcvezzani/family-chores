const fs = require('fs')

const _users = JSON.parse(fs.readFileSync('./cache.json'))

exports.users = {
  all: _users,
  get: (id) => { return _users[id] },
  set: (id, user) => { 
    _users[id] = user
    fs.writeFileSync('./cache.json', JSON.stringify(_users))
  },
}

