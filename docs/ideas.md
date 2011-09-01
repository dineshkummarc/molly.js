## Chained callbacks

    molly ->
       
        @route '/', login_to_facebook, find_friends, () ->
            # do something

        login = [ login_to_facebook, login_to_twitter ]

        @route '/', login, find_friends, () ->


## Type matching

    molly ->

        @route '/users/:id|int', (id) ->
            # do something

        @route '/users/:name|string', (name) ->
            # do something


## Custom matchers

    molly ->

        @register 'facebook_id', /\[1-5]+/
        @register 'facebook_friend', /[bob,bill,frank]+/

        @route '/users/:id|facebook_id', (id) ->
            # do something

        @route '/users/:name|facebook_friend', (name) ->
            # do something


## Wild cards

    molly ->
        
        @route '*', ->
            # every route

        @route 'users/*', ->
            # all user routes

        # OR

        @route '...', ->
            # every route

        @route 'users...', ->
            # all user routes

        @route '...on-lisp', ->
            # a specific post

        @route '...python...', ->
            # all routes mentioning python


## Plugins

    molly ->

        @use resource
        @use verbs

        @get '/', ->
            # get request

        @post '/', (data) ->
            # post request

        @resource 'users',
            'all': ->
            'single': (name) ->
            'change': (name) ->
            'recent': ->


## Sessions

    molly ->

        @use sessions

        @route '/users/:id', (id) ->
            @session['current_user'] = id
