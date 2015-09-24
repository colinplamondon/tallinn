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

module.exports = RateLimiter
