var Q = require('q')
var test = require('tape')
var MethodTimer = require('../')

test('basic test', function (t) {
  var obj = {
    sync: function () {},
    async: function () {
      return Q.Promise(function (resolve) {
        setTimeout(resolve, 100)
      })
    }
  }

  var timer = MethodTimer.timerFor(obj)
  timer.time('sync')
  timer.time('async')
  obj.sync()
  obj.async()
    .done(function () {
      var stats = timer.getStats()
      t.equal(stats[0].method, 'async')
      t.equal(typeof stats[0].time, 'number')
      t.equal(stats[1].method, 'sync')
      t.equal(typeof stats[1].time, 'number')
      t.ok(stats[0].time > stats[1].time)
      t.ok(stats[0].time > 50)
      t.end()
    })
})

test('time all functions', function (t) {
  var obj = {
    sync: function () {},
    async: function () {
      return Q.Promise(function (resolve) {
        setTimeout(resolve, 100)
      })
    }
  }

  var timer = MethodTimer.timeFunctions(obj)
  obj.sync()
  obj.async()
    .done(function () {
      var stats = timer.getStats()
      t.equal(stats[0].method, 'async')
      t.equal(typeof stats[0].time, 'number')
      t.equal(stats[1].method, 'sync')
      t.equal(typeof stats[1].time, 'number')
      t.ok(stats[0].time > stats[1].time)
      t.ok(stats[0].time > 50)
      t.end()
    })
})
