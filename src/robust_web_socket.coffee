WebSocket = require('ws')

#
#  A client side web socket that always needs to be running.
#
#  If connection is closed or errors out, it will try and reconnect after waiting 1 minute.
#
#

class RobustWebSocket
  socket: null
  pingTimer: null
  pingInterval: 60000

  constructor: (@endpoint, @onOpen, @onMessage) ->
    @start()

  start: ->
    @socket = new WebSocket(@endpoint)
    @socket.on('open', =>
      @onOpen(@socket)
      @pingTimer = setInterval( =>
        @socket.ping()
      , @pingInterval)
    )
    @socket.on('message', (data) =>
      @onMessage(data)
    )
    @socket.on('close', @onCloseOrError)
    @socket.on('error', @onCloseOrError)
    setTimeout(=>
      @ensureOpen()
    , 60000)

  ensureOpen: =>
    unless @socket.readyState is WebSocket.OPEN
      @onCloseOrError("Did not manage to open after 60s")

  onCloseOrError: (error) =>
    clearInterval(@pingTimer)
    console.log("Socket closed or error encountered with #{@endpoint} at #{new Date} (#{error})")
    console.log("Will restart socket in 60s...")
    setTimeout(=>
      @restart()
    , 60000)

  restart: =>
    delete @pingTimer
    delete @socket
    @start()

module.exports = RobustWebSocket
