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
tinder = require 'tinderjs'
_ = require 'lodash'

{ WorkerQueueClient } = require '../lib/connections'
RateLimiter = require './rateLimiter'

Promise.longStackTraces()
Promise.onPossiblyUnhandledRejection (error) ->
  console.log 'unhandled rejection!'
  console.log error.error
  throw error

###
client = new tinder.TinderClient()
Promise.promisifyAll(client)
client.setAuthToken req.cookies.tat
client = new tinder.TinderClient()
###

# TODO: add rate limiting

i = 0

# Add logging, so we know whats happening at each step.
# Hit once from client and make sure output is correct.

rateLimiter = new RateLimiter(500, 600)
limit = Promise.promisify(rateLimiter.limit, rateLimiter)

onReceive = (msg, ackFn) ->
  console.log("msg received! #{JSON.stringify msg}")
  handleMassLike(msg, ackFn)

handleMassLike = (msg, ackFn) ->
  { id, user, amount, iteration } = msg

  client = new tinder.TinderClient()
  Promise.promisifyAll(client)
  client.setAuthToken user

  left = amount
  executeLike = (theirId) ->
    console.log 'executelike!'
    limit()
      .then ->
        console.log "YO!"
        client.likeAsync theirId
      .then ->
        console.log "DONE"
        left--
        queueClient.pushNotification({ id, user, left: left })

  recommendFetchAmount = Math.min 14, amount
  limit()
    # Fetch recommendations, map to Tinder user Ids.
    .then -> client.getRecommendationsAsync recommendFetchAmount
    # sometimes will return a { message: 'recs timeout' }
    .tap console.log
    .then ({results}) ->
      Promise.resolve( (rec._id for rec in results)[0...amount])
    .tap console.log

    # Tinder-Like each user one-by-one
    .map executeLike , {concurrency: 1}

    # If we have more people to like, enqueue a new job. Handle cleanup.
    .then ->
      # Create new job if necessary
      left = amount - recommendFetchAmount
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

      # TODO: Handle these errors, pass to client.
      # if error.message == 'recs exhausted'
      #   errorMsg = _.defaults {status: "error", "error": "recs-exhausted"}, msg
      # if error.message == 'recs timeout'
      #   errorMsg = _.defaults {status: "error", "error": "recs-timeout"}, msg

      throw error

      # If done, update DB.


queueClient = new WorkerQueueClient()
queueClient.on 'connected', ->
  console.log 'connected! here'
  queueClient.listenForJobs onReceive


###
  Add messages from Worker back to web for job updates.
  Where should we listen in web?
  Have it show up on site.
  Fix Colins code.
###
