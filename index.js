
var extend = require('xtend')
var sortBy = require('sort-by')
var timeSort = sortBy('-timePerInvocation')

var createNewTimer = module.exports = function (obj) {
  var methods = {}
  var divideBy = 1
  return {
    reset: function () {
      for (var m in methods) {
        var stats = methods[m]
        stats.time = stats.invocations = 0
      }
    },
    // millis: function () {
    //   divideBy = 1e6
    // },
    time: function (method) {
      var orig = obj[method]
      obj[method] = function () {
        methods[method] = methods[method] || {
          time: 0,
          invocations: 0
        }

        var now = process.hrtime()
        var ret = orig.apply(this, arguments)
        if (!isPromise(ret)) {
          accumulate(method, now)
          return ret
        }

        return ret.finally(function () {
          accumulate(method, now)
        })
      }
    },

    getTotals: getTotals,
    getStats: getStats
  }

  function accumulate (method, start) {
    var timePassed = process.hrtime(start)
    var stat = methods[method]
    stat.time += timePassed[0] * 1e9  + timePassed[1]
    // stat.time /= divideBy
    stat.invocations++
  }

  function getTotals() {
    return extend(methods)
  }

  function getStats () {
    return Object.keys(methods)
      .map(function (name) {
        var stat = methods[name]
        return {
          method: name,
          time: stat.time,
          invocations: stat.invocations,
          timePerInvocation: stat.invocations && stat.time / stat.invocations
        }
      })
      .sort(timeSort)
  }

  function nextId (method) {
    if (!(method in methods)) {
      methods[method] = 0
    }

    return method + methods[method]++
  }
}

createNewTimer.timeFunctions = function (obj) {
  var objTimer = createNewTimer(obj)
  Object.keys(obj).forEach(function (k) {
    if (typeof obj[k] === 'function') {
      objTimer.time(k)
    }
  })

  return objTimer
}

function isPromise (val) {
  return val && val.then && val.catch && val.finally && val.done
}
