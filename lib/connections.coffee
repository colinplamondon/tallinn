logger = require('logfmt')
jackrabbit = require 'jackrabbit'
EventEmitter = require('events').EventEmitter


###
this.db = mongoose.createConnection(mongoUrl)
    .on 'connected', ->
      logger.log({ type: 'info', msg: 'connected', service: 'mongodb' })
      ready()
    .on('error', ->
      logger.log({ type: 'error', msg: err, service: 'mongodb' })
    .on 'close', _>
      logger.log({ type: 'error', msg: 'closed', service: 'mongodb' })
    .on 'disconnected', ->
      logger.log({ type: 'error', msg: 'disconnected', service: 'mongodb' });
      lost()
###


# Rabbit MQ Queue to notify the worker of async jobs.
class MessageQueueClient extends EventEmitter
  jobsKey: 'jobs'
  notificationsKey: 'notifications'

  constructor: ->
    rabbitUrl = 'amqp://localhost'
    @rabbit = jackrabbit(rabbitUrl)
      .on 'connected', =>
        logger.log({ type: 'info', msg: 'connected', service: 'rabbitmq' })
        @channel = @rabbit.default()
        @emit('connected')
      .on 'error', (err) =>
        logger.log({ type: 'error', msg: err, service: 'rabbitmq' })
        @emit 'error'
      .on 'disconnected', =>
        logger.log({ type: 'error', msg: 'disconnected', service: 'rabbitmq' });
        @emit 'disconnected'

  _push: (key, msg) =>
    @channel.publish(msg, {key})
  _listen: (name, listener) =>
    @channel
      .queue { name }
      .consume( listener )

  pushJob: (msg) =>
    @_push(@jobsKey, msg)

class WorkerQueueClient extends MessageQueueClient
  listenForJobs: (listener) =>
    @_listen @jobsKey, listener
  pushNotification: (notification) =>
    msg = notification.toWireform()
    console.log "pushing notification: #{msg.user} #{msg.key} #{msg}"
    @_push @notificationsKey, msg

class WebQueueClient extends MessageQueueClient
  listenForNotifications: (cb) =>
    @_listen @notificationsKey, cb


module.exports = { WorkerQueueClient, WebQueueClient }

# Consume:
###

exchange = rabbit.default();
hello = exchange.queue({ name: 'hello' });
hello.consume(onMessage, { noAck: true });
onMessage = (data) -> console.log('received:', data);

# Publish:

rabbit = jackrabbit(process.env.RABBIT_URL);
exchange = rabbit.default();
hello = exchange.queue({ name: 'hello' });

exchange.publish('Hello World!', { key: 'hello' })
exchange.on('drain', process.exit)
###
