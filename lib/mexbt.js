// Generated by CoffeeScript 1.9.0
(function() {
  var EventEmitter, Mexbt, RobustWebSocket, crypto, request,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __hasProp = {}.hasOwnProperty,
    __slice = [].slice;

  request = require('request');

  crypto = require('crypto');

  RobustWebSocket = require('./robust_web_socket');

  EventEmitter = require('events').EventEmitter;

  Mexbt = (function(_super) {
    var tick2UnixTimestamp;

    __extends(Mexbt, _super);

    Mexbt.prototype.publicEndpoint = "https://public-api.mexbt.com";

    Mexbt.prototype.privateEndpoint = null;

    function Mexbt(_at_key, _at_secret, _at_userId, options) {
      this.key = _at_key;
      this.secret = _at_secret;
      this.userId = _at_userId;
      if (options == null) {
        options = {};
      }
      this.privateEndpoint = "https://private-api" + ((options != null ? options.sandbox : void 0) != null ? '-sandbox' : '') + ".mexbt.com";
    }

    Mexbt.prototype.subscribeToStream = function(pair) {
      if (pair == null) {
        pair = 'btcmxn';
      }
      return this.socket = new RobustWebSocket('wss://api.mexbt.com:8401/v1/GetL2AndTrades/', (function(_this) {
        return function(socket) {
          return socket.send(JSON.stringify({
            ins: pair
          }));
        };
      })(this), (function(_this) {
        return function(data) {
          var json, tradeOrOrder, _i, _len, _results;
          json = JSON.parse(data);
          _results = [];
          for (_i = 0, _len = json.length; _i < _len; _i++) {
            tradeOrOrder = json[_i];
            _results.push(_this.parseStreamApiMessage(tradeOrOrder));
          }
          return _results;
        };
      })(this));
    };

    Mexbt.prototype.ticker = function() {
      var args, callback, params, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _ref = this._parseArgs(args), params = _ref[0], callback = _ref[1];
      params = this._mergeDefaultsAndRewrite(params, {
        pair: 'btcmxn'
      }, {
        pair: 'productPair'
      });
      return this._public('ticker', params, callback);
    };

    Mexbt.prototype.trades = function() {
      var args, callback, params, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _ref = this._parseArgs(args), params = _ref[0], callback = _ref[1];
      params = this._mergeDefaultsAndRewrite(params, {
        pair: 'btcmxn',
        startIndex: -1,
        count: 20
      }, {
        pair: 'ins'
      });
      return this._public('trades', params, callback);
    };

    Mexbt.prototype.tradesByDate = function(params, callback) {
      params = this._mergeDefaultsAndRewrite(params, {
        pair: 'btcmxn'
      }, {
        pair: 'ins'
      });
      return this._public('trades-by-date', params, callback);
    };

    Mexbt.prototype.orderBook = function() {
      var args, callback, params, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _ref = this._parseArgs(args), params = _ref[0], callback = _ref[1];
      params = this._mergeDefaultsAndRewrite(params, {
        pair: 'btcmxn'
      }, {
        pair: 'productPair'
      });
      return this._public('order-book', params, callback);
    };

    Mexbt.prototype.productPairs = function(callback) {
      return this._public('product-pairs', {}, callback);
    };

    Mexbt.prototype.accountInfo = function(callback) {
      return this._private('me', {}, callback);
    };

    Mexbt.prototype.accountBalance = function(callback) {
      return this._private('balance', {}, callback);
    };

    Mexbt.prototype.accountTrades = function() {
      var args, callback, params, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _ref = this._parseArgs(args), params = _ref[0], callback = _ref[1];
      params = this._mergeDefaultsAndRewrite(params, {
        pair: 'btcmxn',
        startIndex: -1,
        count: 20
      }, {
        pair: 'ins'
      });
      return this._private('trades', params, callback);
    };

    Mexbt.prototype.accountTradingFee = function() {
      var args, callback, params, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _ref = this._parseArgs(args), params = _ref[0], callback = _ref[1];
      params = this._mergeDefaultsAndRewrite(params, {
        pair: 'btcmxn',
        type: 'market',
        side: 'buy',
        price: null
      }, {
        amount: 'qty',
        price: 'px',
        pair: 'ins',
        type: 'orderType'
      });
      if (params.orderType === 'market') {
        params.orderType = 1;
      } else {
        params.orderType = 0;
      }
      return this._private('trading-fee', params, callback);
    };

    Mexbt.prototype.accountOrders = function(callback) {
      return this._private('orders', {}, callback);
    };

    Mexbt.prototype.accountDepositAddresses = function(callback) {
      return this._private('deposit-addresses', {}, callback);
    };

    Mexbt.prototype.withdraw = function(params, callback) {
      params = this._mergeDefaultsAndRewrite(params, {
        currency: 'btc'
      }, {
        currency: 'ins'
      });
      return this._private('withdraw', params, callback);
    };

    Mexbt.prototype.createOrder = function(params, callback) {
      params = this._mergeDefaultsAndRewrite(params, {
        pair: 'btcmxn',
        side: 'buy',
        type: 'market'
      }, {
        pair: 'ins',
        amount: 'qty',
        price: 'px',
        type: 'orderType'
      });
      if (params.orderType === 'market') {
        params.orderType = 1;
      } else {
        params.orderType = 0;
      }
      return this._private('orders/create', params, callback);
    };

    Mexbt.prototype.modifyOrder = function(params, callback) {
      params = this._mergeDefaultsAndRewrite(params, {
        pair: 'btcmxn'
      }, {
        id: 'serverOrderId',
        pair: 'ins',
        action: 'modifyAction'
      });
      switch (params.modifyAction) {
        case 'move_to_top':
          params.modifyAction = 0;
          break;
        case 'execute_now':
          params.modifyAction = 1;
          break;
        default:
          throw "You must specify an action parameter with either 'move_to_top' or 'execute_now'";
      }
      return this._private('orders/modify', params, callback);
    };

    Mexbt.prototype.cancelOrder = function(params, callback) {
      params = this._mergeDefaultsAndRewrite(params, {
        pair: 'btcmxn'
      }, {
        id: 'serverOrderId',
        pair: 'ins'
      });
      return this._private('orders/cancel', params, callback);
    };

    Mexbt.prototype.cancelAllOrders = function() {
      var args, callback, params, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _ref = this._parseArgs(args), params = _ref[0], callback = _ref[1];
      params = this._mergeDefaultsAndRewrite(params, {
        pair: 'btcmxn'
      }, {
        pair: 'ins'
      });
      return this._private('orders/cancel-all', params, callback);
    };

    Mexbt.prototype.parseStreamApiMessage = function(tradeOrOrder) {
      var action, date, id, obj, price, quantity, side, sideString, tick;
      id = tradeOrOrder[0], tick = tradeOrOrder[1], price = tradeOrOrder[2], quantity = tradeOrOrder[3], action = tradeOrOrder[4], side = tradeOrOrder[5];
      date = tick2UnixTimestamp(tick);
      sideString = side === 0 ? 'buy' : 'sell';
      obj = {
        id: id,
        date: date,
        price: price,
        quantity: quantity,
        side: sideString
      };
      if (action === 0) {
        if (quantity === 0) {
          return this.emit('order-removed', obj);
        } else {
          return this.emit('order', obj);
        }
      } else {
        return this.emit('trade', obj);
      }
    };

    tick2UnixTimestamp = function(tick) {
      return parseInt((tick - 621355968000000000) / 10000000);
    };

    Mexbt.prototype._private = function(path, params, callback) {
      var message, nonce, signature;
      nonce = (new Date()).getTime();
      message = "" + nonce + this.userId + this.key;
      signature = crypto.createHmac("sha256", this.secret).update(message).digest('hex').toUpperCase();
      params.apiKey = this.key;
      params.apiNonce = nonce;
      params.apiSig = signature;
      return this._call(this._url(this.privateEndpoint, path), params, callback);
    };

    Mexbt.prototype._public = function(path, params, callback) {
      return this._call(this._url(this.publicEndpoint, path), params, callback);
    };

    Mexbt.prototype._url = function(endpoint, path) {
      return endpoint + "/v1/" + path;
    };

    Mexbt.prototype._call = function(url, params, callback) {
      return request.post({
        url: url,
        json: true,
        body: params
      }, function(err, res, body) {
        if (err || !(body != null ? body.isAccepted : void 0)) {
          return callback(err || ("API Error: " + body.rejectReason));
        } else {
          return callback(null, body);
        }
      });
    };

    Mexbt.prototype._mergeDefaultsAndRewrite = function(params, defaults, rewriteInfo) {
      var key, value;
      if (rewriteInfo == null) {
        rewriteInfo = {};
      }
      for (key in defaults) {
        value = defaults[key];
        if (!params[key]) {
          params[key] = value;
        }
      }
      for (key in rewriteInfo) {
        value = rewriteInfo[key];
        params[value] = params[key];
        delete params[key];
      }
      return params;
    };

    Mexbt.prototype._parseArgs = function(args) {
      if (args[1]) {
        return args;
      } else {
        return [{}, args[0]];
      }
    };

    return Mexbt;

  })(EventEmitter);

  module.exports = Mexbt;

}).call(this);
