_ = require 'lodash'
moment = require 'moment'

###
A notification is a message send from the Worker to the Client
over the notifications message queue.
###

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
    # Subclasses must set these members.

    # Map of (property of the notification) to (property of the payload)
    @fields = {}
    @transformers = {}

    @user ?= null
    @key ?= null

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
      'age'
      'largePhotos': 'large_photos'
      'miles': 'miles_away'
      'pingTime': 'last_online'
      'bio'
      'id'
    }
    @transformers = {
      'pingTime': @_convertTime
      'age': @_convertAge
    }

  # Populate from a Tinder JSON source
  populate: (source) ->
    @photos = @_extractPhotos(320, source)
    @largePhotos = @_extractPhotos(640, source)
    {
      @name
      distance_mi: @miles
      ping_time: @pingTime
      @bio
      _id: @id,
      birth_date: @age
    } = source

    return @

  _extractPhotos: (size, source) ->
      _.map source.photos, ({processedFiles: p}) -> _.first _.pluck(_.filter(p, {width: size}), 'url')

  _convertTime: (time) ->
    moment(time).fromNow()
  _convertAge: (time) ->
    moment().diff(time, 'years')

  fromRecommendation: (rec) ->
    # Copy user but not key (since superclass overrides key).
    for field of _.extend {'user'}, @fields
      @[field] = rec[field]
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
