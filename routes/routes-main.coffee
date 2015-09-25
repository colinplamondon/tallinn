express = require 'express'
request = require 'request'
Promise = require 'bluebird'
tinder = require 'tinderjs'
url = require 'url'
_ = require 'lodash'

router = express.Router()

client = new tinder.TinderClient()
Promise.promisifyAll(client)

router.get('/', (req, res, next) ->
  res.render('index')
)

router.get('/reg', (req, res, next) ->
  res.render('registration')
)

router.get('/like/:xAuthToken', (req, res, next) ->
  { xAuthToken } = req.params
  res.render('like', {xAuthToken})
)

missing = (param) -> not (param?.length > 0)

# To authorize and receive a list of recommendations from Tinder.
showRecommendationsHandler = (req, res, next) ->
  { token, fbid } = req.body
  { xAuthToken } = req.params

  if not xAuthToken?
    if missing token then return res.send "Please enter a valid token."
    if missing fbid then return res.send "Please enter a valid fbid."

    start = client.authorizeAsync token, fbid
  else
    start = Promise.resolve()
    client.setAuthToken xAuthToken


  start
    .then ->
      console.log("Authorization complete.")
      res.cookie 'tat', client.getAuthToken()
      client.getRecommendationsAsync 30
    .then (data) ->
      { results } = data
      console.log data
      console.log "sending #{results.length} recs"
      return res.render 'recommendations', { recommendations: results }
    .catch tinder.AuthError, (error) ->
      return res.send "<strong>Authentication Error!</strong> #{error.message}"
    .catch (error) ->
      console.log("ERROR!")
      console.log(error)
      return res.send error
router.route('/recommendations/:xAuthToken?')
  .get showRecommendationsHandler
  .post showRecommendationsHandler

# To 'like' a single person.
router.get '/heart/:theirId', (req, res, next) ->
  { theirId } = req.params
  if missing theirId then return res.send "invalid theirId"

  client.setAuthToken req.cookies.tat
  client.likeAsync theirId
    .then ({ match, likes_remaining }) ->
      # TODO: handle likes_remaining = 0
      if match
        res.send "Congrats, a match! Remaining likes: #{likes_remaining}"
      else
        res.send "No match yet. Remaining likes: #{likes_remaining}"

router.post '/like/:xAuthToken', (req, res, next) ->
  { amount } = req.body
  { xAuthToken } = req.params

  console.log "/like #{{ xAuthToken, amount }}"

  # TODO: store Job in DB and get ID
  # TODO: use userId, not auth token
  req.connections.qSend({
    id: Math.floor(Math.random()*10000)
    user: xAuthToken
    action: 'massLike'
    iteration: 0
    amount
  })
  res.json({'ok': true})

module.exports = router
