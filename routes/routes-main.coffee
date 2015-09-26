express = require 'express'
request = require 'request'
Promise = require 'bluebird'
tinder = require 'tinderjs'
url = require 'url'
_ = require 'lodash'

router = express.Router()

client = new tinder.TinderClient()
Promise.promisifyAll(client)

router.get '/', (req, res, next) ->
  if req.user?
    { xAuthToken } = req.user

    returnLocation( xAuthToken, (location) ->
      res.render('like', { userId: xAuthToken, location: location })
    )
  else
    res.render('login')

router.get('/login', (req, res, next) ->
  res.render('login')
)

router.get('/reg', (req, res, next) ->
  res.render('registration')
)

router.get('/complete-reg', (req, res, next) ->
  res.render('complete-reg')
)

router.post '/change-location', (req, res, next) ->
  client.setAuthToken( req.body.xAuthToken )

  newLon = parseFloat(req.body.coord_lon)
  newLat = parseFloat(req.body.coord_lat)
  console.log(req.body)

  client.updatePosition(newLon, newLat, (feedback) ->
    console.log arguments
    console.log feedback

    error = ''
    if arguments['1'].hasOwnProperty('error')
      error = arguments['1']['error']

    if error
      res.json({"ok": false, "error": error })
    else
      res.json({"ok": true})
  )

router.post '/login', (req, res, next) ->
  { token, fbid } = req.body
  { xAuthToken } = req.params

  if missing token then return res.send "Please enter a valid token."
  if missing fbid then return res.send "Please enter a valid fbid."

  # TODO: handle authorization failure (fbook token is wrong or expired)
  # AuthError: Failed to authenticate: Access Denied
  client.authorizeAsync token, fbid
    .then ->
      console.log("Authorization complete.")

      # TODO: confirm user with DB here.
      req.session.userId = client.getAuthToken()
      res.redirect '/'

router.get('/poop', (req, res, next) ->
  res.send 'yo'
)


router.get('/like/:xAuthToken', (req, res, next) ->
  { xAuthToken } = req.params

  # TODO: how to clean up 'connection' on disconnect??
  console.log "### setting channel on '/#{xAuthToken}'"


  res.render('like', {xAuthToken})
)

missing = (param) -> not (param?.length > 0)

returnLocation = (xAuthToken, callback) ->
  client.setAuthToken( xAuthToken )

  client.getProfile( (error, data) ->
    console.log data
    callback({
      lat: data.pos.lat,
      lon: data.pos.lon
    })
  )

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

# Mass-like X number of recommendations
router.post '/masslike', (req, res, next) ->
  if not req.user? then return res.redirect '/'

  { amount } = req.body
  { xAuthToken } = req.user

  console.log "/masslike #{{ xAuthToken, amount }}"

  # TODO: store Job in DB and get ID
  # TODO: use userId, not auth token
  req.queueClient.pushJob({
    id: Math.floor(Math.random()*10000)
    user: xAuthToken
    action: 'massLike'
    iteration: 0
    amount
  })
  res.json({'ok': true})

router.get '/logout', (req, res, next) ->
  req.session.userId = null
  res.redirect '/'

module.exports = router
