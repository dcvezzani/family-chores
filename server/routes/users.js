var express = require('express');
var router = express.Router();
var { users } = require('../cache');

router.get('/isAuthorized/:userId', function (req, res) {
    const { userId } = req.params
    const user = users.get(userId)
    return res.json({isAuthorized: true})
})
  
router.get('/', function (req, res) {
    return res.json(users.all)
})

module.exports = router;
