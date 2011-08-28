describe('molly.routes', function() {

    var routes, emit

    beforeEach(function() {
        emit = jasmine.createSpy()
        routes = molly.routes(emit)
    })
    
    describe('emit', function() {

        it('should call emit with the current url when the page is loaded', function() {
            expect(emit).toHaveBeenCalledWith('get:' + window.location.pathname)
        })

        it('should be called when the url hash is updated', function() {
            window.location.hash = '#/new/page'
            expect(emit.mostRecentCall.args[0]).toEqual('get:#/new/page')
        })

    })

})
