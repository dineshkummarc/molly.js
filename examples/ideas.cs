molly () ->

    @route '/', () ->
        console.log 'Hello world'
        @redirect '/users/new'


    @route '/users',
        '/': () ->
            console.log 'all users'

        '/:id': (user) ->
            @session.user = user
            @redirect url 'users/{{ user }}'


    @resource 'users',
        'index': () -> console.log 'all users'
        'show': (user) -> console.log user


app = molly()


app.route '/', () ->
    console.log 'Hello world'


app.route '/:user', (user) ->
    console.log user


app.route '/users'

    '/': () ->
        console.log 'Hello users'

    '/:user': (user) ->
        console.log 'Hello #{ user }'


app.resource 'users',

    'index': () ->
        console.log 'Hello users'

    'show': (user) ->
        console.log 'Hello #{ user }'

app.run()
