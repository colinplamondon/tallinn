socket_io = require  "socket.io"
_ = require 'lodash'

class SocketRegistry
  socketIdToSocket = {}
  userToSocketId = {}
  constructor: ->
  add: (uid, socket) ->
    def = {}
    def[uid] = []
    _.defaults( userToSocketId, def)

    socketIdToSocket[ socket.id ] = socket
    userToSocketId[uid].push(socket.id)
    #console.log(userToSocketId)

  remove: (uid, socket) ->
    if not uid? then return

    delete socketIdToSocket[socket.id]

    sockets = userToSocketId[ uid ]
    userToSocketId[ uid ] = sockets = _.without(sockets, socket.id)
    if _.isEmpty sockets then delete userToSocketId[ uid ]
    #console.log(userToSocketId)
  emit: (uid, key, msg) ->
    _.map userToSocketId[uid], (sid) -> socketIdToSocket[sid].emit(key, msg)


class SocketsHandler
  io = null
  registry = null

  constructor: (app) ->
    registry = new SocketRegistry()
    io = socket_io()
    app.io = io

    io.on( "connection", ( thisSocket ) =>
      thisUid = null
      thisSocket.on "auth", ({uid}) =>
        console.log "Creating auth socket for #{uid}"
        thisUid = uid
        registry.add(thisUid, thisSocket)

      thisSocket.on 'disconnect', ->
        console.log "user disconnected! #{thisUid}"
        registry.remove(thisUid, thisSocket)
    )
  emit: (uid, key, msg) -> registry.emit(uid, key, msg)
  _setupEvents: ->


handler = null
module.exports = (app) ->
  if handler? then return handler
  return handler = new SocketsHandler(app)
