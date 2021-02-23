const parseCookies = () => {
  // console.log(">>>document.cookie", document.cookie)
  const cookies = document.cookie.split(/; */)
  const cookiesMap = cookies.reduce((cookies, cookie) => {
    const [ key, value ] = cookie.split(/=/)
    cookies[key] = value
    return cookies
  }, {})

  // console.log(">>>cookiesMap", cookiesMap)
  return cookiesMap  
}

exports.getExpiresInSeconds = (seconds) => {
  var now = new Date();
  var time = now.getTime() + (seconds * 1000);
  now.setTime(time);
  return now.toUTCString()
}

exports.Cookies = class {
  constructor() {
    this.cookies = parseCookies()
  }

  set(name, value, options={}) {
    if (options.expiresAt) {}
    else if (options.expiresInSeconds) options.expiresAt = exports.getExpiresInSeconds(options.expiresInSeconds)
    else options.expiresAt = exports.getExpiresInSeconds(3600)

    console.log(">>>setting cookie", {name, value, options})
    document.cookie = `${name}=${value}; expires=${options.expiresAt}; domain=.vezzaniphotography.com;`
  }
  
  get(name) {
    const cookies = parseCookies()
    const value = cookies[name]
    // console.log(">>>getting cookie", {name, value})
    return value
  }

  clear(name, options={}) {
    if (options.expiresAt) {}
    else if (options.expiresInSeconds) options.expiresAt = exports.getExpiresInSeconds(options.expiresInSeconds)
    else options.expiresAt = exports.getExpiresInSeconds(0)

    console.log(">>>clearing cookie", {name, options})
    document.cookie = `${name}=; expires=${options.expiresAt}; domain=.vezzaniphotography.com;`
  }
}
