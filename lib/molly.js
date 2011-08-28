var molly = function() {

    var events = molly.events()
      , routes = molly.routes(events.emit)
      , exports = {}

    
    var validate_url = function(url) {
        if(!_.isString(url))
            throw new Error('calls to `get` must provide a url string as the first argument')
    }

    var validate_callback = function(callback) {
        if(!_.isFunction(callback))
            throw new Error('calls to `get` must provide a callback function as the second argument')
    }

    var clean_url = function(url) {
        return url.replace(/^\/|\/$/g, '')
    }

    var create_rest_event = function(verb, event) {
        return verb + ':' + event
    }


    exports.get = function(url, callback) {
        validate_url(url)
        validate_callback(callback)

        url = clean_url(url)
        events.on(create_rest_event('get', url), callback)
    }

    exports.request = {

        get: function(url) {
            validate_url(url)

            url = clean_url(url)
            events.emit(create_rest_event('get', url))
        }

    }

    return exports

}
