var express = require('express');
var request = require('request');
var router = express.Router();

const getUser = (token) => {
// GET https://graph.facebook.com/v9.0/me?fields=id%2Cname%2Cemail&access_token=EAABiMOZBbkfMBACxT2wNSMzpzMVykCSQNIsk9X3ogqxobxTwsDyZBpM6sOItKbMr0Ggba6yBVk3l1DKZBcbZBgWofloYzuhwYjsZBDzGlHQs5hwqSguDEnaHOHA5rzzt7ZBh8NIa6QuCkX9ZAbH9AHlsL7fy5qlYskyaHTC6wkfOAZDZD
  
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

const getToken = (code) => {
  const options = {
    method: 'get',
    url: 'https://graph.facebook.com/v9.0/oauth/access_token',
    qs: {
      client_id: '107962317902323',
      redirect_uri: 'https://chores.vezzaniphotography.com/login',
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

router.get('/authorize', function (req, res) {
  var uri = `https://www.facebook.com/v9.0/dialog/oauth?client_id=107962317902323&redirect_uri=https://chores.vezzaniphotography.com/login&state=xxt&scope=email`
  console.log(">>>uri", uri)
  res.redirect(uri)
})
  
router.get('/token', async function(req, res, next) {
  const { code } = req.query
  if (!code) return res.status(400).json({ message: `Missing authorization grant code` })

  const data = await getToken(code)
  .then(data => getUser(data.access_token))
  .catch(err => console.error(`Unable to get token`, err))

  res.json({ data })
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
