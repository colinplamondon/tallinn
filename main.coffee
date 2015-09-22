express = require('express')
socket_io = require( "socket.io" )
Promise = require('bluebird')
path = require('path')
favicon = require('serve-favicon')
logger = require('morgan')
cookieParser = require('cookie-parser')
bodyParser = require('body-parser')
nunjucks = require('nunjucks')
routes = require('./routes/routes-main')
utils = require('./utils')

app = express()

# Socket.io
io = socket_io()
app.io = io
require('./routes/mock')(app)

# view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'html')
nunjucks.configure('views', {
  autoescape: true,
  express: app
})
app.locals.utils = utils

# uncomment after placing your favicon in /public
#app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser("4ijf%@pooerf)Fj4$fawfwe)"))
app.use(express.static(path.join(__dirname, 'static')))

app.use('/', routes)

# socket.io events
io.on( "connection", ( socket ) ->
    console.log( "A user connected" )
)


# catch 404 and forward to error handler
app.use( (req, res, next) ->
  err = new Error('404: Route not not Found')
  err.status = 404
  next(err)
)

# error handlers
Promise.onPossiblyUnhandledRejection (error) ->
  console.log 'unhandled rejection!'
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

module.exports = app
