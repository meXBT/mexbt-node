expect = require 'expect.js'
Mexbt = require '../src/mexbt'

describe('meXBT public API', ->
  api = new Mexbt
  it('fetches ticker with default pair', (done) ->
    api.ticker (err, res) ->
      expect(res.isAccepted).to.be(true)
      expect(res.last).to.be.a('number')
      done()
  )
  it('fetches ticker with specific pair', (done) ->
    api.ticker({pair: 'btcusd'}, (err, res) ->
      expect(res.isAccepted).to.be(true)
      expect(res.last).to.be.a('number')
      done()
    )
  )
  it('fetches trades with default params', (done) ->
    api.trades (err, res) ->
      expect(res.isAccepted).to.be(true)
      expect(res.ins).to.be('btcmxn')
      expect(res.count).to.be(20)
      expect(res.trades.length).to.be(20)
      done()
  )
  it('fetches trades with specific params', (done) ->
    api.trades({pair: 'btcusd', count: 1}, (err, res) ->
      expect(res.isAccepted).to.be(true)
      expect(res.ins).to.be('btcusd')
      expect(res.count).to.be(1)
      expect(res.trades.length).to.be(1)
      done()
    )
  )
  it('fetches trades by date with default currency', (done) ->
    api.tradesByDate({startDate: 1416530012, endDate: 1416559390}, (err, res) ->
      expect(res.isAccepted).to.be(true)
      expect(res.ins).to.be('btcmxn')
      expect(res.trades.length).to.be(3)
      done()
    )
  )
  it('fetches trades by date with specific currency', (done) ->
    api.tradesByDate({pair: 'btcusd', startDate: 1416530012, endDate: 1416559390}, (err, res) ->
      expect(res.isAccepted).to.be(true)
      expect(res.ins).to.be('btcusd')
      expect(res.trades.length).to.be(0)
      done()
    )
  )
  it('fetches order book with default pair', (done) ->
    api.orderBook (err, res) ->
      expect(res.isAccepted).to.be(true)
      expect(res.bids[0].qty).to.be.a('number')
      expect(res.asks[0].qty).to.be.a('number')
      done()
  )
  it('fetches order book with specific pair', (done) ->
    api.orderBook({pair: 'btcusd'}, (err, res) ->
      expect(res.isAccepted).to.be(true)
      expect(res.bids[0].qty).to.be.a('number')
      expect(res.asks[0].qty).to.be.a('number')
      done()
    )
  )
  it('fetches product pairs', (done) ->
    api.productPairs (err, res) ->
      expect(res.isAccepted).to.be(true)
      done()
  )
)
