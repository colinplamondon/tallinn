# can we test this that everything is run once at a time without
# hitting the api?
Promise = require 'bluebird'
tinder = require 'tinderjs'
_ = require 'lodash'

{ WorkerQueueClient } = require '../lib/messagequeues'
notifications = require '../lib/notifications'
RateLimiter = require './rateLimiter'

{ Recommendation, Unrequited, Match, MassLikeStatus } = notifications

Promise.longStackTraces()
Promise.onPossiblyUnhandledRejection (error) ->
  console.log 'unhandled rejection!'
  console.log error
  throw error

###
client = new tinder.TinderClient()
Promise.promisifyAll(client)
client.setAuthToken req.cookies.tat
client = new tinder.TinderClient()
###

# TODO: add rate limiting

# Add logging, so we know whats happening at each step.
# Hit once from client and make sure output is correct.

class Cache
  constructor: ->
    @contents = {}
  clear: ->
    @contents = {}
  add: (key, val) -> @contents[key] = val
  get: (key) -> @contents[key]
  size: => _.size @contents
cache = new Cache()
rememberRecommendations = (user, {results: matches}) ->
  for match in matches
    rec = new Recommendation().populate(match)
    rec.user = user
    cache.add rec.id, rec

rateLimiter = new RateLimiter(250, 300)
limit = Promise.promisify(rateLimiter.limit, rateLimiter)

onReceive = (msg, ackFn) ->
  console.log("msg received! #{JSON.stringify msg}")
  handleMassLike(msg, ackFn)

handleMassLike = (msg, ackFn) ->
  { id, user, tinderToken, amount, iteration } = msg

  client = new tinder.TinderClient()
  Promise.promisifyAll(client)
  client.setAuthToken tinderToken

  left = amount
  executeLike = (theirId) ->
    limit()
      .then ->
        client.likeAsync theirId
      .then ({match}) ->
        left--

        recommendation = if match then new Match() else new Unrequited()
        recommendation.fromRecommendation cache.get(theirId)
        queueClient.pushNotification(recommendation)

        status = new MassLikeStatus(id, user, left)
        queueClient.pushNotification(status)

  recommendFetchAmount = Math.min 14, amount
  limit()
    # Fetch recommendations, map to Tinder user Ids.
    .then -> client.getRecommendationsAsync recommendFetchAmount
    # sometimes will return a { message: 'recs timeout' }
    .tap console.log
    .tap rememberRecommendations.bind(null, user)
    .then ({results}) ->
      Promise.resolve( (rec._id for rec in results)[0...amount])
    .tap console.log

    # Tinder-Like each user one-by-one
    .map executeLike , {concurrency: 1}

    # If we have more people to like, enqueue a new job. Handle cleanup.
    .then ->
      left = amount - cache.size()
      cache.clear()

      # Create new job if necessary
      if left > 0
        newMsg = _.defaults {amount: left, iteration: ++iteration}, msg
        queueClient.pushJob newMsg
      else
        console.log "Finished #{id}."

      # Remove current job.
      ackFn()
    .catch (error) ->
      console.log "error!"
      console.log error

      # TODO: Handle these errors, pass to
      # if error.message == 'recs exhausted'
      #   errorMsg = _.defaults {status: "error", "error": "recs-exhausted"}, msg
      # if error.message == 'recs timeout'
      #   errorMsg = _.defaults {status: "error", "error": "recs-timeout"}, msg

      throw error

      # If done, update DB.


queueClient = new WorkerQueueClient()
queueClient.on 'connected', ->
  console.log "Worker connected. Listening for Jobs!"
  queueClient.listenForJobs onReceive


###
  Add messages from Worker back to web for job updates.
  Where should we listen in web?
  Have it show up on site.
  Fix Colins code.
###
