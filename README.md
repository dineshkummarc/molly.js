Simple routing for client-side apps.

## Usage

Using a constructor function.

    molly ->
    
        @use 'users', users.all()
        
        @route '/', ->
            console.log "You're on the home page"

        @route '/users/:id', (id) ->
            console.log "You're user number #{id}"

        @route 'users',
            '/': -> 
                console.log "all users"

            '/:id': (id) ->
                user = @users[id]
                @redirect '/users' if not user
                console.log "You're user number #{id}"

            '/:id/edit': (id) ->
                console.log "Do you want to edit user #{id}"

            '/:id/destroy': (id) ->
                console.log "Do you want to delete user #{id}"
                

Or call methods on an app instance.

    app = molly()
    
    app.use 'users', users.all()

    app.route '/', ->
        console.log "You're on the home page"

    app.route '/users/:id', (id) ->
        console.log "You're user number #{id}"

    app.route 'users',
        '/': -> 
            console.log "all users"

        '/:id': (id) -> 
            user = @users[id]
            @redirect '/users' if not user
            console.log "You're user number #{id}"

        '/:id/edit': (id) ->
            console.log "Do you want to edit user #{id}"

        '/:id/destroy': (id) ->
            console.log "Do you want to delete user #{id}"


    app.run()
    

