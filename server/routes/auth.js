var express = require('express');
var request = require('request');
var { users } = require('../cache');
var { localConfig, config } = require('../config');
var router = express.Router();

const isNonProd = () => (['development', 'local', 'dev'].includes(process.env.NODE_ENV))

const AUTHORIZE_URI = (isNonProd())
  ? `${localConfig.oauth_base_url}?client_id=${config.client_id}&redirect_uri=${config.redirect_uri}&state=xxt&scope=${config.scope}`
  : `${config.oauth_base_url}?client_id=${config.client_id}&redirect_uri=${config.redirect_uri}&state=xxt&scope=${config.scope}`

const getUser = (token) => {
// GET https://graph.facebook.com/v9.0/me?fields=id%2Cname%2Cemail&access_token=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxsk9X3ogqxobxTwsDyZBpM6sOItKbMr0Ggba6yBVk3l1DKZBcbZBgWofloYzuhwYjsZBDzGlHQs5hwqSguDEnaHOHA5rzzt7ZBh8NIa6QuCkX9ZAbH9AHlsL7fy5qlYskyaHTC6wkfOAZDZD
 
  if (isNonProd) {
    const user = {
      ...localConfig.user,
      token,
    }
    console.log(">>>getUser", user)

    return Promise.resolve(user)
  }

  const options = {
    method: 'get',
    url: `${config.graph_base_url}/me`,
    qs: {
      fields: 'id,name,email',
      access_token: token,
    },
    json: true,
  }
  console.log(">>>options", options)

  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      // console.log(">>>body", body)
      if (!error && response.statusCode == 200) {
        return resolve(body)
      } else if (response.statusCode >= 400) {
        return reject({message: `Unable to get token`, status: response.statusCode, error, body})
      }
    })
  })
  
}

const registerUser = (user) => {
    const { id, name, email } = user
    const expires_at_string = user.token.expires_at_string
    users.set(user.id, user)
    // const search = Object.keys(user).reduce((params, attr) => {
    //   const value = user[attr]
    //   params.push(`${attr}=${value}`)
    //   return params
    // }, [])
    // const uri = `https://chores-local.vezzaniphotography.com?${search.join("&")}`
    // res.redirect(uri)

    return Promise.resolve({ id, name, email, expires_at_string })
}

const getToken = (code) => {
  if (isNonProd) {
    const expires_at = Math.round((new Date()).getTime()) + localConfig.token.expires_in
    const token = {
      ...localConfig.token,
      expires_at,
      "expires_at_string": new Date(expires_at).toUTCString(),
    }

    console.log(">>>getToken", token)
    return Promise.resolve(token)
  }
  
  const { client_id, redirect_uri, client_secret } = config
  const options = {
    method: 'get',
    url: `${config.graph_base_url}/oauth/access_token`,
    qs: {
      client_id, redirect_uri, client_secret,
      code,
    },
    headers: {
    },
    json: true,
  }
  console.log(">>>options", options)

  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      // console.log(">>>body", body)
      if (!error && response.statusCode == 200) {
        return resolve(body)
      } else if (response.statusCode >= 400) {
        return reject({message: `Unable to get token`, status: response.statusCode, error, body})
      }
    })
  })
}

router.get('/userIsAuthorized', function (req, res) {
    const { userId } = req.query
    const user = users.get(userId)
    return res.json({isAuthoried: true})
})
  
router.get('/users', function (req, res) {
    return res.json(users.all)
})
  
router.get('/authorize', function (req, res) {
  const uri = AUTHORIZE_URI

  console.log(">>>uri", uri)
  res.redirect(uri)
})
  
router.get('/token', async function(req, res, next) {
  const { code } = req.query
  if (!code) return res.status(400).json({ message: `Missing authorization grant code` })

  const data = await getToken(code)
  .then(data => getUser(data))
  .then(data => registerUser(data))
  .catch(err => console.error(`Unable to get token`, err))

  res.json(data)
})
  
// router.get('/logi
router.get('/logout', function(req, res, next) {
  res.json({ title: 'logout' });
});

router.get('/deauthorize', function(req, res, next) {
  res.json({ title: 'deauthorize' });
});

router.get('/purgeUserData', function(req, res, next) {
  res.json({ title: 'purgeUserData' });
});

module.exports = router;
