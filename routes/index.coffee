express = require('express')
router = express.Router()

router.get('/', (req, res, next) ->
  res.render('index', { title: 'TINDER-FOR-EVERYONE!' })
)

module.exports = router
