express = require 'express'
request = require 'request'
Promise = require 'bluebird'
tinder = require 'tinderjs'
url = require 'url'
_ = require 'underscore'

router = express.Router()

client = new tinder.TinderClient()
Promise.promisifyAll(client)

router.get('/', (req, res, next) ->
  res.render('index', { title: 'TINDER-FOR-EVERYONE!' })
)

router.get('/like', (req, res, next) ->
	res.render('like')
)
router.post '/login', (req, res, next) ->
  { token, fbid } = req.body
  token = token?.trim()
  fbid = fbid?.trim()

  if not (token?.length > 0)
    return res.send "Please enter a valid token."
  if not (fbid?.length > 0)
    return res.send "Please enter a valid fbid."

  # Nodeify this stuff
  client.authorizeAsync token, fbid
    .then ->
      console.log("Authorization complete.")
      client.getRecommendationsAsync 30
    .then (data) ->
      { results } = data
      console.log data
      console.log "sending #{results.length} recs"
      return res.render 'recommendations', { recommendations: results }
    .catch (error) ->
      console.log("ERROR!")
      console.log(error)
      return res.send error

router.get '/authorize', (req, res, next) ->

router.get '/matches', (req, res, next) ->

module.exports = router


