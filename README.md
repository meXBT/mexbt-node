# meXBT Exchange API Node.js client

A lightweight Node.js client for the [meXBT](https://mexbt.com)  public and private exchange APIs.

## Installing

```
npm install mexbt
```

## Using

All examples in CoffeeScript. Apologies if this is upsetting.

### Public API functions

```coffeescript
Mexbt = require 'mexbt'
api = new Mexbt
api.ticker (err, res) ->
  console.log(res)
api.ticker({pair: 'btcusd'}, (err, res) ->
  console.log(res)
)
api.trades({startIndex: 0, count: 1}, (err, res) ->
  console.log(res)
)
api.tradesByDate({startDate: 0, endDate: 12345678}, (err, res) ->
  console.log(res)
)
api.orderBook (err, res) ->
  console.log(res)
api.productPairs (err, res) ->
  console.log(res)
```

### Private API functions

```coffeescript
Mexbt = require 'mexbt'
api = new Mexbt('key', 'secret', 'test@test.com')
api.accountInfo (err, res) ->
  console.log(res)
api.accountBalance (err, res) ->
  console.log(res)  
api.accountTrades({startIndex: -1, count: 5}, (err, res) ->
  console.log(res)
)
api.accountOrders (err, res) ->
  console.log(res)
api.accountDepositAddresses (err, res) ->
  console.log(res)
api.withdraw({currency: 'btc', amount: 0.1, sendToAddress: '1xxxx'}, (err, res) ->
  console.log(res)
)

api.createOrder({amount: 0.1}, (err, res) ->
  console.log(res)
)
api.createOrder({amount: 0.1, side: 'sell', pair: 'btcusd'}, (err, res) ->
  console.log(res)
)
api.createOrder({amount: 0.1, price: 100, side: 'sell', pair: 'btcusd', type: 'limit'}, (err, res) ->
  console.log(res)
)
api.modifyOrder({id: 12345, action: 'move_to_top'}, (err, res) ->
  console.log(res)
)
api.cancelOrder({id: 12345}, (err, res) ->
  console.log(res)
)
api.cancelAllOrders (err, res) ->
  console.log(res)
```

### Listening to trade, order and order-removed events

If you want to listen to events and react to them, it's pretty simple. Just tell the api what currency pair you want to listen
for and setup your listeners. If you want to listen to multiple currency pairs just use multiple Mexbt instances.

```coffeescript
Mexbt = require 'mexbt'

api = new Mexbt
api.subscribeToStream('btcmxn') # btcmxn is also the default pair

api.on("trade", (t) ->
  console.log("#{t.quantity} BTC #{t.side} @ #{t.price} MXN")
)

api.on('order', (o) ->
  console.log("#{o.side.toUpperCase()} order added for #{o.quantity} BTC @ #{o.price} MXN")
)

api.on('order-removed', (o) ->
  console.log("#{o.side.toUpperCase()} order #{o.id} removed")
)
```

Unfortunately the order book is pretty "chatty", there are constantly orders being adjusted so keep that in mind, as they will be removed and then added again. 
