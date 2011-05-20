molly.events = (function() {

    var exports = {}
      , events = {}

    exports.on = function(event, callback) {
        if(!events[event])
          events[event] = []

        events[event].push(callback)
    }

    exports.emit = function(event, args) {
        _.each(events[event], function(callback) {
            callback.apply(this, args)
        })
    }

    return exports

})()
