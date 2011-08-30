@molly = (constructor) ->

    events = molly.events

    add_leading_slash = (str) ->
        if str[0] != '/' and str[0] != '#' then "/#{ str }" else str

    remove_trailing_slash = (str) ->
        if str != '/' and str[str.length - 1] == '/' then str.substring(0, str.length - 1) else str

    replace_url_arguments = (str) ->
        str.replace /:([\w\d]+)/g, "([^\/]+)"

    parse_url = (str) ->
        add_leading_slash replace_url_arguments str

    exports =
        route: () ->
            molly.type_match arguments,
                'object': (urls) ->
                    for url, callback of urls
                        url = parse_url url
                        events.listen url, callback
                'string, object': (prefix, urls) ->
                    for url, callback of urls
                        url = parse_url "#{ prefix }#{ add_leading_slash url }"
                        events.listen url, callback
                'string, function': (url, callback) ->
                    url = parse_url url
                    events.listen url, callback

        resource: (name, obj) ->
            @route name, obj.index
            @route "#{ name }/:id", obj.show
            @route "#{ name }/:id/edit", obj.edit
            @route "#{ name }/:id/destroy", obj.destroy

        run: () ->
            events.trigger molly.url_handler.path()
            events.trigger molly.url_handler.hash()
    
    if constructor?
        constructor.apply(exports)
        exports.run()
    else 
        exports


molly.events = do ->
    events = {}

    exports =
        listen: (event, callback) ->
            events[event] = callback

        trigger: (path) ->
            for event, callback of events
                args = path.match?(event)
                jstestdriver.console.log args, event, path
                if args?.length
                    callback.apply this, args[1..args.length]


molly.url_handler = do ->
    window.onhashchange = () ->
        molly.events.trigger window.location.hash

    exports =
        path: (url) -> 
            window.location.pathname = url if url?
            window.location.pathname
        hash: (hash) -> 
            if hash?
                window.location.hash = hash if hash?
                molly.events.trigger window.location.hash

            window.location.hash


molly.type_match = (args, methods) ->
    arg_types = (typeof arg for arg in args).join ", "

    for types, method of methods
        method.apply this, args if types == arg_types
