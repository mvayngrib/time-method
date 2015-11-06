# time-method

[![NPM](https://nodei.co/npm/time-method.png)](https://nodei.co/npm/time-method/)

Monkeypatch an object's methods to measure how long they take. Supports sync methods and methods that return promises

## Usage

```js
var Q = require('q')
var MethodTimer = require('time-method')
function Bob () {}

Bob.prototype.doNothing = function () {}
Bob.prototype.waitThenDoNothing = function () {
  return Q.Promise(function (resolve) {
    setTimeout(resolve, 100)
  })
}

var bob = new Bob()
var timer = MethodTimer.timerFor(bob)
// or use MethodTimer.timerFor(Bob.prototype) to time functions
// across all instances of Bob
timer.time('doNothing')
timer.time('waitThenDoNothing')
// alternately, to time all functions of an object, use:
// MethodTimer.timeFunctions(bob)
bob.doNothing()
bob.waitThenDoNothing()
  .done(function () {
    var stats = timer.getStats()
    console.log(stats)
  })

// logs (time units are nanonseconds):
// [ 
//   { 
//     method: 'async',
//     time: 107598145,
//     invocations: 1,
//     timePerInvocation: 107598145 
//   },
//   { 
//     method: 'sync',
//     time: 82592,
//     invocations: 1,
//     timePerInvocation: 82592 
//   } 
// ]
```
