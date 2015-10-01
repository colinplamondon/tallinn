data = require './tinderjs-stub-data'
_ = require 'lodash'

class TinderStub
  authToken: null
  setAuthToken: (@authToken) ->
  like: (userId, cb) ->
    label = if @_rollIsUnexpected 0.95 then 'match' else 'unrequited'
    @cbWithDelay cb, _.clone data.LIKE[label], true
  getRecommendations: (limit, cb) ->
    { status, results } = _.clone data.RECOMMENDATIONS, true
    results =_.shuffle(results)[0...limit]
    @cbWithDelay cb, { status, results }
  cbWithDelay: (cb, results) ->
    setTimeout( (-> cb(null, results)), 1500 * Math.random() )
  _rollIsUnexpected: (weight = 0.95) ->
    Math.random() > weight
  _recsExausted: ->

module.exports = { TinderClient: TinderStub }
