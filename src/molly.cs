@molly = (constructor) ->

    events = {}

    add_leading_slash = (str) ->
        if str[0] != '/' and str[0] != '#' then "/#{ str }" else str

    remove_trailing_slash = (str) ->
        if str != '/' and str[str.length - 1] == '/' then str.substring(0, str.length - 1) else str

    replace_url_arguments = (str) ->
        str.replace /:([\w\d]+)/g, "([^\/]+)"

    listen = (event, callback) ->
        event = add_leading_slash remove_trailing_slash replace_url_arguments event
        events[event] = callback

    trigger = (path) ->
        for event, callback of events
            args = path.match?(event)
            callback.apply this, args[1..args.length] if args?

    exports =
        route: (url, callback) ->
            molly.type_match arguments,
                'object': (urls) ->
                    for e, c of urls
                        listen e, c
                'string, object': (prefix, urls) ->
                    for event, callback of urls
                        listen "#{ prefix }#{ add_leading_slash event }", callback
                'string, function': (url, callback) ->
                    listen url, callback

        resource: (name, obj) ->
            @route name, obj.index
            @route "#{ name }/:id", obj.show
            @route "#{ name }/:id/edit", obj.edit
            @route "#{ name }/:id/destroy", obj.destroy

        run: () ->
            trigger molly.url_handler.path()
            trigger molly.url_handler.hash()
    
    if constructor?
        constructor.apply(exports)
        exports.run()
    else 
        exports


molly.url_handler =
    path: () -> 
        molly.type_match arguments,
            'null': () -> window.location.pathname
            'string': (path) -> window.location.pathname = path
    hash: () -> 
        molly.type_match arguments,
            'null': () -> window.location.hash
            'string': (hash) -> window.location.hash = hash


molly.type_match = (args, methods) ->
    arg_types = (typeof arg for arg in args).join ", "

    for types, method of methods
        method.apply this, args if types == arg_types
