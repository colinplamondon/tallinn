express = require 'express'
request = require 'request'
Promise = require 'bluebird'
tinder = require 'tinderjs'
moment = require 'moment'
url = require 'url'
_ = require 'lodash'

{ User } = require '../lib/models'

router = express.Router()

client = new tinder.TinderClient()
Promise.promisifyAll(client)
Promise.promisifyAll(User)

router.get '/', (req, res, next) ->
  if not req.user?
    return res.redirect '/reg'
  { tinderToken } = req.user
  console.log "set token #{tinderToken}"
  client.setAuthToken tinderToken
  client.getProfileAsync()
    .then (profile) ->
      console.log profile
      _id = profile._id
      console.log(profile.photos[0].processedFiles)
      profile_pic = profile.photos[0].processedFiles[2].url
      location = {
        'lat': profile.pos.lat,
        'lon': profile.pos.lon
      }

      console.log 'get profile async'
      res.render('like', {
        tinderId: _id,
        userId: req.user.id,
        location: location,
        photo: profile_pic
      })
    .error next

router.get('/login', (req, res, next) ->
  res.render('login')
)

router.get('/marketing', (req, res,next) ->
  res.render('marketing')
)

# Login / Register
# Register:
#  - Get Auth token
# Login:
# - does Authing the token work?
router.get('/reg', (req, res, next) ->
  res.render('registration')
)

router.post('/reg', (req, res, next) ->
  { fbToken, fbId } = req.body
  # TODO: we should be doing a server side Facebook Auth. Anyone can pass
  # any facebook token.
  console.log "Find facebookId: #{fbId}"
  if not fbId?
    return res.json({error: "No fbId"})
  User.find({facebookId: fbId}).exec().then ([user]) ->
    console.log "user"
    console.log user
    if user?
      req.session.userId = user._id
      return res.json({ok: true})

    user = new User({
      facebookId: fbId
    })
    # TODO: how to promisify?
    .save (error, user) ->
      console.log ('NEW user')
      console.log (arguments)
      req.session.userId = user._id
      res.json({ok: true})
    .error (error) ->
      res.json({error})
)

router.get('/reauth', (req, res, next) ->
  res.render('reauth')
)
router.get '/complete-reg', (req, res, next) ->
  res.render('complete-reg')

router.post '/complete-reg', (req, res, next) ->
  { token, email } = req.body
  if not req.user? then return res.json({'error': 'no user'})

  user = req.user
  user.setTinderFbookToken token

  # TODO: handle authorization failure (fbook token is wrong or expired)
  # AuthError: Failed to authenticate: Access Denied
  client.authorizeAsync token, token.tinderFbookToken
    .then ->
      user.tinderToken = client.getAuthToken()
      console.log 'token authorized, saving...'
      # RETURNING 400 for some reaosn??

      # TODO how to promisify
      user.save (error, user) ->
        if error then return res.json({'error': 'cannot save user'})
        res.json({ok: true})
    .error next

router.get('/like/:xAuthToken', (req, res, next) ->
  { xAuthToken } = req.params

  # TODO: how to clean up 'connection' on disconnect??
  console.log "### setting channel on '/#{xAuthToken}'"


  res.render('like', {xAuthToken})
)

router.post '/change-location', (req, res, next) ->
  client.setAuthToken( req.user.tinderToken )

  newLon = parseFloat(req.body.new_lon)
  newLat = parseFloat(req.body.new_lat)

  client.updatePosition(newLon, newLat, (feedback) ->
    error = ''
    if arguments['1'].hasOwnProperty('error')
      error = arguments['1']['error']

    if error
      res.json({"ok": false, "error": error })
    else
      res.json({"ok": true})
  )

router.get('/intros', (req, res, next) ->
  if req.user?
    { xAuthToken } = req.user
    console.log xAuthToken
    returnLocation( xAuthToken, (location) ->

      getCurrentCityMatches( xAuthToken, (matches, message_lookup) ->

        unmessaged = returnUnmessagedMatches(matches, message_lookup)
        res.render('intros', {
          "userId": xAuthToken,
          "location": location,
          "matches": matches,
          "match_num": matches.length,
          "unmessaged": unmessaged,
          "unmessaged_num": unmessaged.length
        })
      )
    )
  else
    res.render('login')
)

returnUnmessagedMatches = (matches, message_lookup) ->
  unmessaged = []

  count = 0
  console.log("Have " + matches.length)

  have_messaged = (match) ->
    messages_exist = message_lookup[match._id]?
    if messages_exist && message_lookup[match._id].length > 0
      return true
    return false

  for m in matches
    if !have_messaged(m)
      unmessaged.push(JSON.stringify(m._id))

  return unmessaged



getCurrentCityMatches = (xAuthToken, callback) ->
  client.setAuthToken( xAuthToken )

  city_matches = []

  # GET MATCHES
  # For each match, get the profile

  # 2015-08-27T00:00:00+0000

  client.getHistory( '2015-09-26T00:00:00+0000', (error, data) ->

    message_lookup = {}
    length = data['matches'].length
    count = 1

    match_list = []

    getMatchArray(xAuthToken, (matches) ->

      for m in matches when m.person?._id?
        match_list.push(m.person._id)
        message_lookup[m.person._id] = m.messages

      filterMatchesForCity(match_list, xAuthToken, (city_matches) ->
        callback(city_matches, message_lookup)
      )
    )

  )

filterMatchesForCity = (matches, xAuthToken, callback) ->
  match_data = []

  target_profiles = matches.length
  count = 1

  filter_data = (all_matches, cb) ->
    city_matches = []
    for m in all_matches
      if m.distance_mi < 20
        city_matches.push(m)
    cb(city_matches)

  for m in matches
    client.setAuthToken( xAuthToken )
    client.getUser(m, (error, data) ->
      if !data
        target_profiles--

      if data
        count++
        match_data.push(data['results'])

      if count == target_profiles
        filter_data(match_data, callback)
    )

getMatchArray = (xAuthToken, callback) ->
  client.setAuthToken( xAuthToken )
  client.getHistory( '2015-09-25T00:00:00+0000', (error, data) ->
    callback (data['matches'])
  )

missing = (param) -> not (param?.length > 0)

returnLocation = (xAuthToken, callback) ->
  client.setAuthToken( xAuthToken )

  client.getProfile( (error, data) ->
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
  { id, tinderToken } = req.user

  console.log "/masslike #{{ id, amount }}"

  # TODO: store Job in DB and get ID
  # TODO: use userId, not auth token
  req.queueClient.pushJob({
    id: Math.floor(Math.random()*10000)
    user: id
    tinderToken: tinderToken
    action: 'massLike'
    iteration: 0
    amount
  })
  res.json({'ok': true})

router.get '/logout', (req, res, next) ->
  req.session.userId = null
  res.redirect '/'

# #########
# CHAT CODE

router.get '/chat', (req, res, next) ->
  if not req.user?
    return res.redirect '/reg'
  { tinderToken } = req.user

  client.setAuthToken tinderToken
  console.log tinderToken

  now = moment()

  client.getProfileAsync()
    .then (profile) ->
      _id = profile._id
      profile_pic = profile.photos[0].processedFiles[2].url
      location = {
        'lat': profile.pos.lat,
        'lon': profile.pos.lon
      }

      console.log 'get profile async'
      res.render('chat', {
        tinderId: _id,
        userId: req.user.id,
        location: location,
        photo: profile_pic
      })
    .error next

router.post '/get_history', (req, res, next) ->
  client.setAuthToken( req.user.tinderToken )

  if req.body.days_ago?
    days_ago = parseInt(req.body.days_ago)
    timeframe = moment().subtract(days_ago, 'days').format()
  if req.body.timestamp?
    timeframe = moment(req.body.timestamp).format()

  return_recent_messages(timeframe, (history) ->
    if history?
      res.json({"ok": true, "results": history,"timestamp": timeframe})
    else
      res.json({"ok": false})
  )


return_recent_messages = (timeframe, callback) ->
  client.getHistory(timeframe, (error, history) ->
    if error?
      console.log("Got error: ")
      console.log error
      callback([])

    console.log(history['matches']?)
    final_matches = []
    if history['matches']?
      for m in history['matches'] when m.person?.photos?[0]?
        final_matches.push(m)
      callback(final_matches)
    else
      callback([])
  )

module.exports = router