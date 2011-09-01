app = molly () ->

    @route '/examples/hello_world/', () ->
        alert 'hello'

    @route '/examples/hello_world/users/', () ->
        alert 'Viewing all users'

    @route '/examples/hello_world/users/:id', (id) ->
        alert "Viewing user: #{ id }"
