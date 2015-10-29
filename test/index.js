var Q = require('q')
var test = require('tape')
var newTimer = require('../')

test('basic test', function (t) {
  var obj = {
    sync: function () {
    },
    async: function () {
      return Q(function (resolve) {
        setTimeout(resolve, 100)
      })
    }
  }

  var timer = newTimer(obj)
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
      t.end()
    })
})
