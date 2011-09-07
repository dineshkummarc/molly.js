describe 'molly', () ->

    beforeEach () ->
        @app = molly()


    it 'should define a global function', () ->
        expect(typeof molly).toBe 'function'

    it 'should return an object', () ->
        expect(typeof @app).toBe 'object'

    it 'should accept a create function', () ->
        callback = jasmine.createSpy()
        my_app = molly(callback)

        expect(callback).toHaveBeenCalled()

    it 'should route from the constructor function', () ->
        callback = jasmine.createSpy()
        spyOn(molly.url_handler, 'path').andReturn '/'

        molly () ->
            
            @route '/', callback

        expect(callback).toHaveBeenCalled()


    describe 'route', () ->

        it 'should have a route method on the returned object', () ->
            expect(typeof @app.route).toBe 'function'

        it 'should register a callback for a url string', () ->
            callback = jasmine.createSpy()
            spyOn(molly.url_handler, 'path').andReturn '/'
            @app.route '/', callback
            @app.run()

            expect(callback).toHaveBeenCalled()

        it 'should not trigger callbacks if url is not matched', () ->
            callback = jasmine.createSpy()
            spyOn(molly.url_handler, 'path').andReturn '/'
            @app.route '/foo', callback
            @app.run()

            expect(callback).not.toHaveBeenCalled()

        it 'should only call the current route', () ->
            callback1 = jasmine.createSpy()
            callback2 = jasmine.createSpy()
            spyOn(molly.url_handler, 'path').andReturn '/users/123'

            @app.route
                '/users': callback1
                '/users/:id': callback2

            @app.run()

            expect(callback1).not.toHaveBeenCalled()
            expect(callback2).toHaveBeenCalled()
            

        it 'should route multiple urls if passed an object', () ->
            callback1 = jasmine.createSpy()
            callback2 = jasmine.createSpy()
            spyOn(molly.url_handler, 'path').andReturn '/'

            @app.route
                '/': callback1
                '/foo': callback2

            @app.run()

            expect(callback1).toHaveBeenCalled()

        it 'should route using prefixes if provided', () ->
            callback1 = jasmine.createSpy()
            callback2 = jasmine.createSpy()
            spyOn(molly.url_handler, 'path').andReturn '/users/foo'

            @app.route '/users',
                '/': callback1
                '/foo': callback2

            @app.run()

            expect(callback2).toHaveBeenCalled()

        it 'should route add leading slashes to namespaced urls', () ->
            callback1 = jasmine.createSpy()
            callback2 = jasmine.createSpy()
            spyOn(molly.url_handler, 'path').andReturn '/users/foo'

            @app.route '/users',
                '/': callback1
                'foo': callback2

            @app.run()

            expect(callback2).toHaveBeenCalled()

        it 'should add a leading slash if missing', () ->
            callback = jasmine.createSpy()
            spyOn(molly.url_handler, 'path').andReturn '/foo'
            @app.route 'foo', callback
            @app.run()

            expect(callback).toHaveBeenCalled()

        it 'should pass url parameters to callbacks', () ->
            callback = jasmine.createSpy()
            spyOn(molly.url_handler, 'path').andReturn '/users/123'

            @app.route '/users/:id', callback
            @app.run()

            expect(callback).toHaveBeenCalledWith('123')

        it 'should pass multiple url parameters to callbacks', () ->
            callback = jasmine.createSpy()
            spyOn(molly.url_handler, 'path').andReturn '/posts/programming/intro-to-molly.js'

            @app.route '/posts/:category/:title', callback
            @app.run()

            expect(callback).toHaveBeenCalledWith('programming', 'intro-to-molly.js')

        it 'should allow mapping to hashes', () ->
            callback = jasmine.createSpy()
            spyOn(molly.url_handler, 'hash').andReturn '#hello-world'

            @app.route '#hello-world', callback
            @app.run()

            expect(callback).toHaveBeenCalled()

        it 'should allow url parameters in hash urls', () ->
            callback = jasmine.createSpy()
            spyOn(molly.url_handler, 'hash').andReturn '#users/123'

            @app.route '#users/:id', callback
            @app.run()

            expect(callback).toHaveBeenCalledWith('123')

        it 'should allow arrays of callbacks to be passed', () ->
            callback = jasmine.createSpy()
            second_callback = jasmine.createSpy()
            spyOn(molly.url_handler, 'hash').andReturn '/'

            @app.route '/', callback, second_callback
            @app.run()

            expect(callback).toHaveBeenCalled()
            expect(second_callback).toHaveBeenCalled()

        it 'should allow nested arrays of callbacks to be passed', () ->
            callback = jasmine.createSpy()
            second_callback = jasmine.createSpy()
            third_callback = jasmine.createSpy()
            spyOn(molly.url_handler, 'hash').andReturn '/'

            login = [callback, second_callback]

            @app.route '/', login, third_callback
            @app.run()

            expect(callback).toHaveBeenCalled()
            expect(second_callback).toHaveBeenCalled()
            expect(third_callback).toHaveBeenCalled()


    describe 'run', () ->

        it 'should have a run function', () ->
            expect(typeof @app.run).toBe 'function'

        it 'should find the current url path', () ->
            spyOn(molly.url_handler, 'path').andReturn '/'
            spyOn(molly.events, 'trigger')
            @app.run()

            expect(molly.url_handler.path).toHaveBeenCalled()
            expect(molly.events.trigger).toHaveBeenCalledWith('/')

        it 'should find the current url hash', () ->
            spyOn(molly.url_handler, 'hash').andReturn '#hello'
            spyOn(molly.events, 'trigger')
            @app.run()

            expect(molly.url_handler.hash).toHaveBeenCalled()
            expect(molly.events.trigger).toHaveBeenCalledWith('#hello')


    describe 'url_handler', () ->

        it 'should have a url_handler object', () ->
            expect(typeof molly.url_handler).toBe 'object'

        it 'should have a path method', () ->
            expect(typeof molly.url_handler.path).toBe 'function'

        it 'should have a hash method', () ->
            expect(typeof molly.url_handler.hash).toBe 'function'

        it 'should trigger an event when hash changes', () ->
            spyOn(molly.events, 'trigger')
            molly.url_handler.hash '#hello'

            expect(molly.events.trigger).toHaveBeenCalledWith '#hello'

            
    describe 'type_match', () ->

        it 'should match argument types passed in', () ->
            callback = jasmine.createSpy()
            example = () ->
                molly.type_match arguments,
                    'string, function, string': (message, method, goodbye) ->
                        method(message, goodbye)

            example('hello', callback, 'world')

            expect(callback).toHaveBeenCalledWith('hello', 'world')

        it 'should convert array to object', () ->
            callback = jasmine.createSpy()
            example = () ->
                molly.type_match arguments,
                    'array': () ->
                        callback()

            example([1, 2, 3])

            expect(callback).toHaveBeenCalled()

        it 'should call null option if not arguments are provided', () ->
            callback = jasmine.createSpy()
            example = () ->
                molly.type_match arguments,
                    '*': () ->
                        callback()

            example()

            expect(callback).toHaveBeenCalled()

    describe 'redirect', () ->

        it 'should have a redirect method on route context', () ->
            spyOn(molly.url_handler, 'path').andReturn '/'

            @app.route '/', () ->
                expect(typeof @redirect).toBe 'function'

            @app.run()

        it 'should call url_handler.path with a new url', () ->
            spyOn(molly.url_handler, 'path').andReturn '/'

            @app.route '/', () ->
                @redirect '/foo'
                expect(molly.url_handler.path).toHaveBeenCalledWith '/foo'

            @app.run()

    describe 'config', () ->

        it 'should have a use method', () ->
            expect(typeof @app.use).toBe 'function'

        it 'should set named properties on route context', () ->
            spyOn(molly.url_handler, 'path').andReturn '/'

            config =
                debug: true
                app_id: 12345

            @app.use 'config', config
            @app.use 'foo', () -> 'bar'

            @app.route '/', () ->
                expect(@config.debug).toBe true
                expect(@config.app_id).toBe 12345
                expect(@foo()).toBe 'bar'

            @app.run()

        it 'should assign all object values directly if no name is provided', () ->
            spyOn(molly.url_handler, 'path').andReturn '/'

            @app.use
                config:
                    debug: true
                    app_id: 12345
                foo: () -> 'bar'

            @app.route '/', () ->
                expect(@config.debug).toBe true
                expect(@config.app_id).toBe 12345
                expect(@foo()).toBe 'bar'

            @app.run()
