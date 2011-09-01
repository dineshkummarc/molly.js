@molly = (constructor) ->

    events = molly.events

    add_leading_slash = (url) ->
        if url[0] != '/' and url[0] != '#' then "/#{ url }" else url

    replace_url_arguments = (url) ->
        url.replace /:([\w\d]+)/g, "([^\/]+)"

    parse_url = (url) ->
        add_leading_slash replace_url_arguments url

    context =
        redirect: (url) ->
            molly.url_handler.path url

    exports =
        route: () ->
            molly.type_match arguments,
                'object': (urls) ->
                    for url, callback of urls
                        url = parse_url url
                        events.listen url, callback, context
                'string, object': (prefix, urls) ->
                    for url, callback of urls
                        url = parse_url "#{ prefix }#{ add_leading_slash url }"
                        events.listen url, callback, context
                'string, function': (url, callback) ->
                    url = parse_url url
                    events.listen url, callback, context

        run: () ->
            events.trigger molly.url_handler.path()
            events.trigger molly.url_handler.hash()
    
    if constructor
        constructor.apply(exports)
        exports.run()
        
    return exports


molly.events = do ->
    events = {}

    exports =
        listen: (event, callback, context) ->
            events[event] = { 'callback': callback, 'context': context }

        trigger: (path) ->
            for event, method of events
                args = path.match?(event)
                method.callback.apply method.context, args[1..args.length] if args?[0] == path


molly.url_handler = do ->
    window.onhashchange = () ->
        molly.events.trigger window.location.hash

    exports =
        path: (url) -> 
            window.location.pathname = url if url
            return window.location.pathname
        hash: (hash) -> 
            if hash
                window.location.hash = hash
                molly.events.trigger window.location.hash

            return window.location.hash


molly.type_match = (args, methods) ->
    arg_types = (typeof arg for arg in args).join ", "

    for types, method of methods
        method.apply this, args if types == arg_types
