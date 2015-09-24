###
Get matches:
  - when a user signs up, fetch all their matches.
  - Record last activity date.
  - Use this when fetching updates.
  - if we match with someone when liking them, do we still get that activity returned? I think so.
  - maybe hit every ~5 secs

Jobs:
  Like 500 users
    Ping rec
    For each returned, like the following
  Message 10 users with this msg: "yoyo"
    Get matches. (how???)
    For the top 10 matches, like them

  Like 500 users, 100 messaged so far,  messaging: "yoyo"
    Ping rec,
    For each returned, like the following
    Check for updates
    If updates, message each.
###

# can we test this that everything is run once at a time without
# hitting the api?
Promise = require 'bluebird'
Connections = require './connections'

###
client = new tinder.TinderClient()
Promise.promisifyAll(client)
client.setAuthToken req.cookies.tat
client = new tinder.TinderClient()
###

# TODO: add rate limiting

i = 0

# TODO: make these delays configurable.
class RateLimiter
  _msPerMsg = null
  _randomDelayMaxMs = null
  _lastRun = 0
  _interval = 0

  RAND_BUMP_THRESHOLD_PCT = 0.05
  RAND_BUMP_FACTOR_MS = 3000
  RAND_BUMP_MIN_MS = 750

  constructor: (msPerMsg = 1000, randomDelayMaxMs = 0) ->
    _msPerMsg = msPerMsg
    _randomDelayMaxMs = randomDelayMaxMs

  limit: (cb) ->
    interval = Date.now() - _lastRun
    delay = @_calculateDelay()
    setTimeout( ->
        #console.log("HIT #{Date.now() - _lastRun}, delay: #{delay}")
        _lastRun = Date.now()
        cb(null)
      , Math.max( (_msPerMsg - interval) + 50, 0) + delay)

  _calculateDelay: ->
    ###
    We want to add sporadic delays to make the requests look less
    programmatic. The two factors are:
      1) a linear delay selected between 0 and randomDelayMaxMs
      2) a rare longer bump
    ###
    if _randomDelayMaxMs is 0 then return 0

    linearFactor = Math.ceil(_randomDelayMaxMs * Math.random())

    # In rare instances, add a "bump" so there is a delay.
    bump = if Math.random() > 1 - RAND_BUMP_THRESHOLD_PCT
      Math.ceil(Math.random() * RAND_BUMP_FACTOR_MS) + RAND_BUMP_MIN_MS
    else
      0

    return linearFactor + bump

rateLimiter = new RateLimiter(1000, 600)
limit = Promise.promisify(rateLimiter.limit, rateLimiter)

client = {
  getRecommendationsAsync: (id) ->
    limit().then ->
      results = ({_id: x} for x in [0..14])
      console.log "results:"
      console.log results
      return Promise.resolve({results})
  likeAsync: (id) ->
    limit().then ->
      p = new Promise( (resolve, reject) ->
        setTimeout( (-> resolve(true)), Math.random() * 500)
      )
      return p
}

sendLoop = (i = 0)->
  console.log("send loop #{i}")
  if i > 500 then return
  setTimeout( (->
    msg = "msg #{Math.random()}"
    console.log "sending #{msg}!"
    connections.qSend({"message": msg, "id":2})
    sendLoop(++i)
  ), 100)

connections = new Connections()
connections.on 'connected', ->
  console.log 'connected! here'
  sendLoop()
  connections.qReceive (msg) ->
    console.log("msg received!")
    console.log(msg)

connections.rabbitConnect()

###
start = Date.now()
likeFn = (theirId) ->
  # TODO: rate limiting
  t = Date.now()
  console.log "#{t - start}: likeAsync #{theirId} ..."
  start = t
  client.likeAsync theirId

client.getRecommendationsAsync 14
  .then ({results: recommendations }) ->
    Promise
      .resolve(rec._id for rec in recommendations)
      .map(likeFn, {concurrency: 1})
###
