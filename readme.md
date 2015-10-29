# time-method

[![NPM](https://nodei.co/npm/time-method.png)](https://nodei.co/npm/time-method/)

Monkeypatch an object's methods to measure how long they take. Supports sync methods and methods that return promises

## Usage

```js
var Q = require('q')
var newTimer = require('time-method')
var obj = {
  sync: function () {},
  async: function () {
    return Q.Promise(function (resolve) {
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
    console.log(stats)
  })

// logs (time units are nanonseconds):
// [ { method: 'async', time: 107156037 },
//  { method: 'sync', time: 53189 } ]
```
