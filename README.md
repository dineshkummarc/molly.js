## Usage

Using a constructor function.

    molly ->
        
        @route '/', ->
            console.log "You're on the home page"

        @route '/users/:id', (id) ->
            console.log "You're user number #{id}"

        @route 'users',
            '/': -> 
                console.log "all users"

            '/:id': (id) -> 
                console.log "You're user number #{id}"
        
        @resource 'users',
            index: -> 
                console.log "all users"

            show: (id) -> 
                console.log "You're user number #{id}"

Or call methods on an app instance.

    app = molly()


    app.route '/', ->
        console.log "You're on the home page"

    app.route '/users/:id', (id) ->
        console.log "You're user number #{id}"

    app.route 'users',
        '/': -> 
            console.log "all users"

        '/:id': (id) -> 
            console.log "You're user number #{id}"

    app.resource 'users',
        index: -> 
            console.log "all users"

        show: (id) -> 
            console.log "You're user number #{id}"


    app.run()
