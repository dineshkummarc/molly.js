var molly = function() {

    var events = molly.events
      , exports = {}

    exports.get = function(url, callback) {
        if(!_.isString(url))
          throw new Error('calls to `get` must provide a url string as the first argument')

        if(!_.isFunction(callback))
          throw new Error('calls to `get` must provide a callback function as the second argument')

        url = url.replace(/^\/|\/$/g, '')
        events.on('get/' + url, callback)
    }

    return exports

}
