express = require('express')
mongoose = require 'mongoose'
Promise = require('bluebird')
path = require('path')
favicon = require('serve-favicon')
logger = require('morgan')
cookieParser = require('cookie-parser')
cookieSession = require('cookie-session')
bodyParser = require('body-parser')
nunjucks = require('nunjucks')

{ WebQueueClient } = require './lib/messagequeues'
{ NotificationsDispatcher} = require './lib/notifications'
routes = require('./routes/routes-main')
sockets = require('./lib/sockets')
utils = require('./lib/utils')

app = express()

socketHandler = sockets(app)



require('./routes/mock')(app)

# view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'html')
nunjucks.configure('views', {
  autoescape: true,
  express: app
})
app.locals.utils = utils

app.use  (req, res, next) ->
  req.queueClient = app.queueClient
  req.io = app.io
  next()

# uncomment after placing your favicon in /public
#app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser("4ijf%@pooerf)Fj4$fawfwe)"))
app.use(express.static(path.join(__dirname, 'static')))
app.use(cookieSession({
  name: 'session'
  keys: ["ex0ees5Sae7Chai6ooj)aime", "euY#az<ainaichaeNae3oocu"]
  maxAge: (365 * 24 * 60 * 60 * 1000)
  signed: true
}))
app.use( (req, res, next) ->
  # TODO: fetch and store user object from DB
  if req.session?.userId?
    req.user = { xAuthToken: req.session.userId }
  next()
)

app.use('/', routes)
app.use (err, req, res, next) ->
  { status } = err
  if status is 401
    res.redirect '/reg'
    next()
  else
    next(err)

# catch 404 and forward to error handler
app.use( (req, res, next) ->
  err = new Error('404: Route not not Found')
  err.status = 404
  next(err)
)

# error handlers
Promise.onPossiblyUnhandledRejection (error) ->
  console.log 'unhandled rejection!'
  console.log error
  throw error

#

# development error handler
# will print stacktrace
###
if app.get('env') == 'development'
  app.use( (err, req, res, next) ->
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  )

# production error handler
# no stacktraces leaked to user
app.use( (err, req, res, next) ->
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
)
###

queueClient = new WebQueueClient()
dispatcher = new NotificationsDispatcher(queueClient, socketHandler)
waitingDependency = 2
ready = ->
  if --waitingDependency is 0
    dispatcher.init()
    app.emit('ready')

queueClient.on('connected', ready)
db = mongoose.connect 'mongodb://localhost/wingman'
db.connection
  .once 'open', ->
    console.log 'Mongo DB connected'
    ready()
  .on 'error', ->
    console.log 'mongo error!'
    console.log arguments
  .on 'disconnected', ->
    console.log 'mongo disconnected!'
    console.log arguments

module.exports = app
