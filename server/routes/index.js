var express = require('express');
var request = require('request');
var { users } = require('../cache');
var router = express.Router();

const isNonProd = () => (['development', 'local', 'dev'].includes(process.env.NODE_ENV))

const AUTHORIZE_URI = (isNonProd)
  ? `https://chores-local.vezzaniphotography.com/token?client_id=107962317902323&redirect_uri=https://chores.vezzaniphotography.com/token&state=xxt&scope=email`
  : `https://www.facebook.com/v9.0/dialog/oauth?client_id=107962317902323&redirect_uri=https://chores.vezzaniphotography.com/token&state=xxt&scope=email`

  // var uri = `https://www.facebook.com/v9.0/dialog/oauth?client_id=107962317902323&redirect_uri=https://chores.vezzaniphotography.com/token&state=xxt&scope=email`

const getUser = (token) => {
// GET https://graph.facebook.com/v9.0/me?fields=id%2Cname%2Cemail&access_token=EAABiMOZBbkfMBACxT2wNSMzpzMVykCSQNIsk9X3ogqxobxTwsDyZBpM6sOItKbMr0Ggba6yBVk3l1DKZBcbZBgWofloYzuhwYjsZBDzGlHQs5hwqSguDEnaHOHA5rzzt7ZBh8NIa6QuCkX9ZAbH9AHlsL7fy5qlYskyaHTC6wkfOAZDZD
 
  if (isNonProd) {
    const user = {
      "id": "10225108674728397",
      "name": "David Curtis Vezzani",
      "email": "dcvezzani@gmail.com",
      token,
    }
  console.log(">>>getUser", user)

    return Promise.resolve(user)
  }

  const options = {
    method: 'get',
    url: 'https://graph.facebook.com/v9.0/me',
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
    // const jwt = require('njwt')
    // const claims = { iss: 'fun-with-jwts', sub: 'AzureDiamond' }
    // const token = jwt.create(claims, 'top-secret-phrase')
    // token.setExpiration(new Date().getTime() + 60*1000)
    
    const expires_in = 5183501
    const expires_at = Math.round((new Date()).getTime()) + expires_in

    const token = {
        "access_token": "xAABiMOZBbkfMBACxT2wNSMzpzMVykCSQNIsk9X3ogqxobxTwsDyZBpM6sOItKbMr0Ggba6yBVk3l1DKZBcbZBgWofloYzuhwYjsZBDzGlHQs5hwqSguDEnaHOHA5rzzt7ZBh8NIa6QuCkX9ZAbH9AHlsL7fy5qlYskyaHTC6wkfOAZDZD",
        "token_type": "bearer",
        expires_in, 
        expires_at,
        "expires_at_string": new Date(expires_at).toUTCString(),
    }

    console.log(">>>getToken", token)
    return Promise.resolve(token)
  }
  
  const options = {
    method: 'get',
    url: 'https://graph.facebook.com/v9.0/oauth/access_token',
    qs: {
      client_id: '107962317902323',
      redirect_uri: 'https://chores.vezzaniphotography.com/token',
      client_secret: 'ffc294287fbe2192815f50cc76943871',
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

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ title: 'Express' });
});

module.exports = router;
