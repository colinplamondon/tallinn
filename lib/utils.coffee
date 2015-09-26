# take a recommendations json and return a 320x320 image url

exports.recommendationImage = (rec, size=320) ->
  {url} = rec.photos[0]
  pieces = url.split('/')
  lastIndex = pieces.length - 1
  last = pieces[ lastIndex ]
  pieces[ lastIndex ] = "#{size}x#{size}_#{last}"
  pieces.join('/')
