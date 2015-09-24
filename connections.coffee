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
class Connections extends EventEmitter
  constructor: ->

  rabbitConnect: ->
    rabbitUrl = 'amqp://localhost'
    @db = jackrabbit(rabbitUrl)
      .on 'connected', =>
        logger.log({ type: 'info', msg: 'connected', service: 'rabbitmq' })
        @channel = @db.default()
        @emit('connected')
      .on 'error', (err) =>
        logger.log({ type: 'error', msg: err, service: 'rabbitmq' })
        @emit 'error'
      .on 'disconnected', =>
        logger.log({ type: 'error', msg: 'disconnected', service: 'rabbitmq' });
        @emit 'disconnected'

  qSend: (msg) ->
    @channel
      .publish(msg, { key: 'work' })

  qReceive: (cb)->
    @channel
      .queue({ name: 'work' })
      .consume( cb, { noAck: true })

module.exports = Connections

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
