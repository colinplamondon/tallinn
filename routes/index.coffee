express = require('express')
router = express.Router()

router.get('/', (req, res, next) ->
  res.render('index', { title: 'TINDER-FOR-EVERYONE!' })
)

router.get('/like', (req, res, next) ->
	res.render('like')
)

module.exports = router
