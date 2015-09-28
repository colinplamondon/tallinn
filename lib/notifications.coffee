_ = require 'lodash'
moment = require 'moment'

class NotificationsDispatcher
  constructor: (@messageQueue, @socketHandler) ->

  init: =>
    console.log "Setting up notificaton listener...."
    @messageQueue.listenForNotifications @_notificationHandler

  _notificationHandler: (msg, ackFn) =>
    # TODO: add dispatching and notification types
    { user, key, payload } = msg
    #console.log "Notifying user. Msg: #{JSON.stringify msg}"
    @socketHandler.emit(user, key, payload)
    ackFn()

class Notification
  constructor: (@key) ->
    # Subclasses must set these.
    @fields = {}
    @transformers = {}
    @user ?= null

  toWireform: =>
    { @key, @user, payload: @_makePayload() }
  _makePayload: =>
    payload = {}
    for from, to of @fields
      transform =  @transformers[from] ? _.identity
      payload[to] = transform(this[from])
    return payload

class Recommendation extends Notification
  constructor: (key) ->
    super(key ? 'recommendation')

    @fields = {
      'name'
      'photos'
      'largePhotos': 'large_photos'
      'miles': 'miles_away'
      'pingTime': 'last_online'
      'bio'
      'id'
    }
    @transformers = {
      'pingTime': @_convertTime
    }
  populate: (source) ->
    console.log 'create recommendation'
    console.log source

    @photos = @_extractPhotos(320, source)
    @largePhotos = @_extractPhotos(640, source)
    { @name, distance_mi: @miles, ping_time: @pingTime, @bio, _id: @id } = source

    return @

  _extractPhotos: (size, source) ->
      _.map source.photos, ({processedFiles: p}) -> _.first _.pluck(_.filter(p, {width: size}), 'url')

  _convertTime: (time) ->
    moment(time).fromNow()

  fromRecommendation: (rec) ->
    { @name, @miles, @pingTime, @bio, @id, @photos, @largePhotos, @user } = rec
    return @


class Match extends Recommendation
  constructor: () ->
    super('new-match')
class Unrequited extends Recommendation
  constructor: () ->
    super('new-unrequited')

class MassLikeStatus extends Notification
  constructor: (@jobId, @user, @left) ->
    super('mass-like-status')
    @fields = { 'jobId', 'left' }

module.exports = {
  NotificationsDispatcher
  Recommendation
  Match
  Unrequited
  MassLikeStatus
}
