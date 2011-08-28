describe('molly', function() {

    var app
      , on
      , emit

    beforeEach(function() {
        on = jasmine.createSpy(),
        emit = jasmine.createSpy()

        spyOn(molly, 'events').andReturn({
            on: on,
            emit: emit
        })

        spyOn(molly, 'routes')

        app = molly();
    })

    it('should define a global function', function() {
        expect(typeof molly).toBe('function');
    })

    it('should return an object', function() {
        expect(typeof app).toBe('object');
    })

    describe('get', function() {

        var example_callback = jasmine.createSpy();

        it('should have a get method', function() {
            expect(typeof app.get).toBe('function')
        })

        it('should assign the url as an event', function() {
            app.get('example', example_callback)
            expect(on).toHaveBeenCalledWith('get:example', example_callback)
        })

        it('should remove extra slashes', function() {
            app.get('/example/', example_callback)
            expect(on).toHaveBeenCalledWith('get:example', example_callback)
        })

        it('should throw an error if an event string is not provided', function() {
            expect(function() {
                app.get(example_callback);
            }).toThrow('calls to `get` must provide a url string as the first argument')
        })

        it('should throw an error if a callback function is not provided', function() {
            expect(function() {
                app.get('example');
            }).toThrow('calls to `get` must provide a callback function as the second argument')
        })

    })

    describe('request', function() {
        
        it('should provide a request object', function() {
            expect(typeof app.request).toBe('object')
        })

        describe('request.get', function() {
            
            it('should provide a get method', function() {
                expect(typeof app.request.get).toBe('function')
            })

            it('it should emit the url', function() {
                app.request.get('example')
                expect(emit).toHaveBeenCalledWith('get:example')
            })

            it('should remove any leading or trailing slashes', function() {
                app.request.get('/example/')
                expect(emit).toHaveBeenCalledWith('get:example')
            })

            it('should thrown an error if no url is provided', function() {
                expect(function() {
                    app.request.get();
                }).toThrow('calls to `get` must provide a url string as the first argument')
            })

        })

    })


    describe('routes', function() {

        it('should be called with the emit function', function() {
            expect(molly.routes).toHaveBeenCalledWith(emit)
        })

    })

})
