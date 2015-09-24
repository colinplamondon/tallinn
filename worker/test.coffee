# Test code for worker, rate limiter, etc.

###
client = {
  getRecommendationsAsync: (id) ->
    limit().then ->
      results = ({_id: x} for x in [0..14])
      console.log "results:"
      console.log results
      return Promise.resolve({results})
  likeAsync: (id) ->
    limit().then ->
      p = new Promise( (resolve, reject) ->
        setTimeout( (-> resolve(true)), Math.random() * 500)
      )
      return p
}

sendLoop = (i = 0)->
  console.log("send loop #{i}")
  if i > 500 then return
  setTimeout( (->
    msg = "msg #{Math.random()}"
    console.log "sending #{msg}!"
    connections.qSend({"message": msg, "id":2})
    sendLoop(++i)
  ), 100)

start = Date.now()
likeFn = (theirId) ->
  # TODO: rate limiting
  t = Date.now()
  console.log "#{t - start}: likeAsync #{theirId} ..."
  start = t
  client.likeAsync theirId

client.getRecommendationsAsync 14
  .then ({results: recommendations }) ->
    Promise
      .resolve(rec._id for rec in recommendations)
      .map(likeFn, {concurrency: 1})

connections = new Connections()
connections.on 'connected', ->
  console.log 'connected! here'
  sendLoop()
  connections.qReceive (msg) ->
    console.log("msg received!")
    console.log(msg)

connections.rabbitConnect()
###
