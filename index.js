
var extend = require('xtend')
var sortBy = require('sort-by')
var timeSort = sortBy('-time')

module.exports = function timer (obj) {
  var methods = {}
  return {
    time: function (method) {
      var orig = obj[method]
      obj[method] = function () {
        methods[method] = methods[method] || 0
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
    methods[method] += timePassed[0] * 1e9  + timePassed[1]
  }


  function getTotals() {
    return extend(methods)
  }

  function getStats () {
    return Object.keys(methods)
      .map(function (name) {
        return {
          method: name,
          time: methods[name]
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

function isPromise (val) {
  return val && val.then && val.catch && val.finally && val.done
}
