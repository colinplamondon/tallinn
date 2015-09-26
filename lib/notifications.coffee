class NotificationsDispatcher
  constructor: (@messageQueue, @socketHandler) ->

  init: =>
    console.log "Setting up notificaton listener...."
    @messageQueue.listenForNotifications @_massLikeStatusHandler

  _massLikeStatusHandler: (msg, ackFn) =>
    # TODO: add dispatching and notification types
    { id, user, left } = msg
    #console.log "Notifying user: #{id}, #{user}, #{left}"
    @socketHandler.emit(user, 'mass-like-status', msg)
    ackFn()

module.exports = { NotificationsDispatcher }
