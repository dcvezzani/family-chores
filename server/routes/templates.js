var express = require('express');
var fs = require('fs');
var router = express.Router();

router.get('/', function(req, res, next) {
  const path = `./contract-examples`
  try {
    const files = fs.readdirSync(path).filter(file => file.endsWith(`.json`));
    res.json({files});

  } catch(err) {
    console.error(err)
    res.status(404).json({path, message: 'File not found'})
  }
});

router.get('/:templateName/:userId', function(req, res, next) {
  const path = `./contract-examples/chore-sheet-${req.params.templateName}.json`
  // if (!fs.existsSync(path)) return res.status(404).json({path, message: 'File not found'})

  try {
    const content = fs.readFileSync(path)
    res.json(JSON.parse(content));

  } catch(err) {
    console.error(err)
    res.status(404).json({path, message: 'File not found'})
  }
});

module.exports = router;
