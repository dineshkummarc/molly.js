describe('events', function() {

    var bar = jasmine.createSpy()
      , baz = jasmine.createSpy()
      , events = molly.events()

    beforeEach(function() {
        events.on('foo', bar)
        events.on('foo', baz)
        events.emit('foo', ['hello', 'world'])
    })

    it('should have an on method', function() {
        expect(typeof events.on).toBe('function')
    })

    it('should have an emit method', function() {
        expect(typeof events.emit).toBe('function')
    })

    it('should trigger the callback when the event is sent', function() {
        expect(bar).toHaveBeenCalled()
    })

    it('should trigger call all listeners', function() {
        expect(baz).toHaveBeenCalled()
    })

    it('should be called with all the arguments', function() {
        expect(bar).toHaveBeenCalledWith('hello', 'world')
    })

})
