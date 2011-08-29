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

    it 'should register resources from the constructor function', () ->
        callback = jasmine.createSpy()
        spyOn(molly.url_handler, 'path').andReturn '/users'

        molly () ->
            
            @resource 'users',
                index: callback

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

        it 'should route remove trailing slashes to namespaced urls', () ->
            callback1 = jasmine.createSpy()
            callback2 = jasmine.createSpy()
            spyOn(molly.url_handler, 'path').andReturn '/users/foo'

            @app.route '/users',
                '/': callback1
                '/foo/': callback2

            @app.run()

            expect(callback2).toHaveBeenCalled()

        it 'should add a leading slash if missing', () ->
            callback = jasmine.createSpy()
            spyOn(molly.url_handler, 'path').andReturn '/foo'
            @app.route 'foo', callback
            @app.run()

            expect(callback).toHaveBeenCalled()

        it 'should remove trailing slashes', () ->
            callback = jasmine.createSpy()
            spyOn(molly.url_handler, 'path').andReturn '/foo'
            @app.route '/foo/', callback
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


    describe 'resource', () ->

        beforeEach () ->
            spyOn(@app, 'route')

        it 'should have a resource function', () ->
            expect(typeof @app.resource).toBe 'function'

        it 'should create an index route for the resource', () ->
            callback = jasmine.createSpy()
            @app.resource 'users',
                index: callback

            expect(@app.route).toHaveBeenCalledWith('users', callback) 

        it 'should create a show route for the resource', () ->
            callback = jasmine.createSpy()
            @app.resource 'users',
                show: callback

            expect(@app.route).toHaveBeenCalledWith('users/:id', callback) 

        it 'should create an edit route for the resource', () ->
            callback = jasmine.createSpy()
            @app.resource 'users',
                edit: callback

            expect(@app.route).toHaveBeenCalledWith('users/:id/edit', callback) 

        it 'should create a delete route for the resource', () ->
            callback = jasmine.createSpy()
            @app.resource 'users',
                destroy: callback

            expect(@app.route).toHaveBeenCalledWith('users/:id/destroy', callback) 
            

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
