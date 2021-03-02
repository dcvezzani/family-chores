const { Cookies, getExpiresInSeconds } = require('./cookies')
const { handlePromiseError } = require('../errors')

const deauthorizeUser = async () => {
  let user = localStorage.getItem('user');
  if (user) user = JSON.parse(user)
  localStorage.removeItem('user');
  console.log(">>>user", user, user.id)
  
  const url = `${process.env.VUE_APP_API_BASE}/auth/deauthorize/${user.id}`
  console.log(">>>url", url)
  const results = await fetch(url)
    .then(response => response.json())
    .then(payload => payload)
    .catch(handlePromiseError(`Unable to deauthorize user`))
  console.log(">>>results", results)
}

exports.logout = () => { 
  deauthorizeUser()

  const cookies = new Cookies()
  cookies.clear('chores_app_loggedin')
  
  Event.$emit('onLoginLogoutEvent')
}

exports.getUser = () => {
  const userString = localStorage.getItem('user');
  return (userString) ? JSON.parse(userString) : null
}

exports.login = (user) => {
  console.log(">>>user", user)
  localStorage.setItem('user', JSON.stringify(user));
  
  const cookies = new Cookies()
  // const expires_at_string = getExpiresInSeconds(10)
  cookies.set('chores_app_loggedin', 'true', {expiresAt: user.expires_at_string})
  Event.$emit('onLoginLogoutEvent')
}

// not called in dev
exports.authorize = async (options={}) => { 
  const { force, to } = options

  const cookies = new Cookies()
  if (force != true && cookies.get('chores_app_loggedin') === 'true') {
    Event.$emit('onLoginLogoutEvent')
    return true
  }

  if (to) localStorage.setItem('redirectPath', to.fullPath);

  const uri = process.env.VUE_APP_API_AUTHORIZE
  window.location = uri
  return false
}


