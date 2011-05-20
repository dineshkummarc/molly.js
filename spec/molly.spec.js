describe('molly', function() {

    var app;

    beforeEach(function() {
        app = molly();
    })

    it('should define a global function', function() {
        expect(typeof molly).toBe('function');
    })

    it('it should return an object', function() {
        expect(typeof app).toBe('object');
    })

    describe('get', function() {

        var example_callback = jasmine.createSpy();

        beforeEach(function() {
            spyOn(molly.events, 'on')
        })

        it('it should have a get method', function() {
            expect(typeof app.get).toBe('function')
        })

        it('should assign the url as an event', function() {
            app.get('example', example_callback)
            expect(molly.events.on).toHaveBeenCalledWith('get/example', example_callback)
        })

        it('should remove extra slashes', function() {
            app.get('/example/', example_callback)
            expect(molly.events.on).toHaveBeenCalledWith('get/example', example_callback)
        })

        it('shoud throw an error if an event string is not provided', function() {
            expect(function() {
                app.get(example_callback);
            }).toThrow('calls to `get` must provide a url string as the first argument')
        })

        it('shoud throw an error if a callback function is not provided', function() {
            expect(function() {
                app.get('example');
            }).toThrow('calls to `get` must provide a callback function as the second argument')
        })

    })

})
