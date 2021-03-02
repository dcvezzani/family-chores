var express = require('express');
var request = require('request');
var { users } = require('../cache');
var { localConfig, config } = require('../config');
var router = express.Router();

const isNonProd = ['development', 'local', 'dev'].includes(process.env.NODE_ENV)

const AUTHORIZE_URI = (isNonProd)
  ? `${localConfig.oauth_base_url}?client_id=${config.client_id}&redirect_uri=${config.redirect_uri}&state=xxt&scope=${config.scope}`
  : `${config.oauth_base_url}?client_id=${config.client_id}&redirect_uri=${config.redirect_uri}&state=xxt&scope=${config.scope}`

  
router.get('/authorize', function (req, res) {
  const uri = AUTHORIZE_URI
  // console.log(">>>uri", uri)
  res.redirect(uri)
})
  
router.get('/token', async function(req, res, next) {
  const { code } = req.query
  if (!code) return res.status(400).json({ message: `Missing authorization grant code` })

  const data = await getToken(code)
  .then(data => substituteAccessCode(data))
  .then(data => getUser(data))
  .then(data => registerUser(data))
  .catch(err => console.error(`Unable to get token`, err))

  res.json(data)
})
  
router.get('/profile/:userId', async function(req, res, next) {
  console.log(">>>req.params", req.params)
  const { userId } = req.params
  const payload = await getProfile(userId)
  res.json(payload);
});

router.get('/logout', function(req, res, next) {
  res.json({ title: 'logout' });
});

router.get('/deauthorize/:userId', function(req, res, next) {
  if (!req.params.userId) return res.json({ title: 'deauthorize', deauthorized: false });

  users.clear(req.params.userId)
  res.json({ title: 'deauthorize', deauthorized: !users.get(req.params.userId) });
});

router.get('/deauthorize', function(req, res, next) {
  res.json({ title: 'deauthorize' });
});

router.get('/purgeUserData', function(req, res, next) {
  res.json({ title: 'purgeUserData' });
});


const substituteAccessCode = (data) => {
  console.log(">>>data", data)
  if (!isNonProd) return Promise.resolve(data)

  console.log(">>>substituteAccessCode for non prod", {isNonProd})

  // {
  //   access_token: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxykCSQNIsk9X3ogqxobxTwsDyZBpM6sOItKbMr0Ggba6yBVk3l1DKZBcbZBgWofloYzuhwYjsZBDzGlHQs5hwqSguDEnaHOHA5rzzt7ZBh8NIa6QuCkX9ZAbH9AHlsL7fy5qlYskyaHTC6wkfOAZDZD',
  //   token_type: 'bearer',
  //   expires_in: 5183501,
  //   expires_at: 1614651047607,
  //   expires_at_string: 'Tue, 02 Mar 2021 02:10:47 GMT'
  // }  

  data.access_token = 'EAABiMOZBbkfMBAM9h0K5kOZBUpUYEBeOSEU3jacUSiyHZBqZBGD0fS9vchej4wA8XAZCujb9CtiRgRZCvwDA9vpzJVMD8dkvZAeW47VqczxPzdsiC5hDwpJ1TfyxZBpxbjyVZA6UkxZBXIcV5ThfGNVTRYl2VQEP4s4wmFXncyXSTZBjvo2i9dRMilw5UwZBNhbZAocnhIiPKTwzglzvCug6nF0xognxbY4oZAwmasIPv7nGCVkQZDZD'

  return Promise.resolve(data)
}

const getUser = (payload) => {
// GET https://graph.facebook.com/v9.0/me?fields=id%2Cname%2Cemail&access_token=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxsk9X3ogqxobxTwsDyZBpM6sOItKbMr0Ggba6yBVk3l1DKZBcbZBgWofloYzuhwYjsZBDzGlHQs5hwqSguDEnaHOHA5rzzt7ZBh8NIa6QuCkX9ZAbH9AHlsL7fy5qlYskyaHTC6wkfOAZDZD
 
  const { access_token } = payload
  if (isNonProd) {
    const user = {
      ...localConfig.user,
      token: payload,
    }
    console.log(">>>getUser", user)

    return Promise.resolve(user)
  }

  const options = {
    method: 'get',
    url: `${config.graph_base_url}/me`,
    qs: {
      fields: 'id,name,email',
      access_token,
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
        return reject({message: `Unable to get user profile`, status: response.statusCode, error, body})
      }
    })
  })
}

const getProfile = (userId) => {
  const user = users.get(userId)
  const { access_token } = (user && user.token) || {}
  const { redirect_uri, client_id } = config
  
  // curl -i -X GET \
  // "https://graph.facebook.com/v9.0/me?fields=id%2Cname%2Cemail&access_token=EAABiMOZBbkfMBAL19p7YsPsuZBiXhGVAmKxYqyQ68CcZBcZA6TN399Rlv4jZCBVchN6NyWPcLerTBuciLSEdwy0ZBpsPEdPuP02WvH9L3oAdvgJPjoeiKAKCpwZCWfpZBZCZBJOZCaiLWZBLt2IgMeR8heIsIbO3EZACsMa9oFWLcJPBMLjRx2T8RwzYJ8p7DxhQGrnyjPllaGUnxe3tAdlprhFAqwT8HAEEQIzfvNTHNimcBrAZDZD"
  
  const options = {
    method: 'get',
    url: `${config.graph_base_url}/me`,
    qs: {
      fields: 'id,name,email',
      access_token,
    },
    headers: {
    },
    json: true,
  }

  const url = `https://graph.facebook.com/v9.0/me`
  console.log(">>>getProfile", {options, url})

  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      console.log(">>>body", body)
      if (!error && response.statusCode == 200) {
        return resolve(body)
      } else if (response.statusCode >= 400) {
        return reject({message: `Unable to get user profile info`, status: response.statusCode, error, body})
      }
    })
  })
}

const registerUser = (user) => {
    const { id, name, email } = user
    const expires_at_string = user.token.expires_at_string
    users.set(user.id, user)

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

    // console.log(">>>getToken", token)
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


module.exports = router;

